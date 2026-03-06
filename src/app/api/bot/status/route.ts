import { type NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getBotSubscriptionByPhone } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get phone from query parameters
    const searchParams = request.nextUrl.searchParams
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Fetch bot subscription
    const { data: subscription, error } = await getBotSubscriptionByPhone(phone)

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found
      console.error('Error fetching bot status:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch subscription status' },
        { status: 500 }
      )
    }

    if (!subscription) {
      return NextResponse.json(
        {
          success: true,
          message: 'No subscription found',
          data: {
            status: 'no_subscription',
            phone,
          },
        },
        { status: 200 }
      )
    }

    // Check if subscription is expired
    let isExpired = false
    if (subscription.expires_at) {
      isExpired = new Date(subscription.expires_at) < new Date()
    }

    // Calculate remaining chats
    let remainingChats = null
    if (subscription.monthly_limit > 0) {
      remainingChats = Math.max(0, subscription.monthly_limit - subscription.usage_count)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Subscription status retrieved',
        data: {
          phone: subscription.phone,
          planType: subscription.plan_type,
          status: subscription.status,
          isExpired,
          usageCount: subscription.usage_count,
          monthlyLimit: subscription.monthly_limit,
          remainingChats,
          usagePercentage:
            subscription.monthly_limit > 0
              ? Math.min(
                  (subscription.usage_count / subscription.monthly_limit) * 100,
                  100
                )
              : 100,
          activatedAt: subscription.activated_at,
          expiresAt: subscription.expires_at,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Bot status API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
