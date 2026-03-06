import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isValidSaudiPhone, formatSaudiPhone } from '@/lib/bot';

interface SubscriptionRequest {
  phone: string;
  planType: 'free' | 'basic' | 'pro';
  userId: string;
}

interface BotWebhookPayload {
  phone: string;
  plan_type: 'free' | 'basic' | 'pro';
  status: 'active' | 'inactive';
  expires_at?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: SubscriptionRequest = await request.json();
    const { phone, planType, userId } = body;

    // Validate input
    if (!phone || !planType || !userId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!isValidSaudiPhone(phone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Saudi phone format. Use 966XXXXXXXXX' },
        { status: 400 }
      );
    }

    // Format phone number
    const formattedPhone = formatSaudiPhone(phone);

    // Validate plan type
    if (!['free', 'basic', 'pro'].includes(planType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Get bot server URL from environment
    const botServerUrl = process.env.BOT_SERVER_URL;
    if (!botServerUrl) {
      console.error('BOT_SERVER_URL not configured');
      return NextResponse.json(
        { success: false, message: 'Bot service configuration error' },
        { status: 500 }
      );
    }

    // Prepare bot webhook payload
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const botPayload: BotWebhookPayload = {
      phone: formattedPhone,
      plan_type: planType,
      status: 'active',
      expires_at: expiresAt.toISOString(),
    };

    // Send to bot server with retry logic
    let botResponse;
    let lastError: Error | null = null;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        botResponse = await fetch(`${botServerUrl}/webhook/subscription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(botPayload),
        });

        if (botResponse.ok) {
          break; // Success, exit retry loop
        }

        lastError = new Error(
          `Bot API returned status ${botResponse.status}`
        );

        if (attempt < maxRetries - 1) {
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    if (!botResponse || !botResponse.ok) {
      console.error('Bot subscription activation failed:', lastError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to activate bot subscription. Please try again.',
        },
        { status: 503 }
      );
    }

    // Log successful activation
    console.log(
      `Bot subscription activated: userId=${userId}, phone=${formattedPhone}, plan=${planType}`
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Subscription activated successfully',
        data: {
          phone: formattedPhone,
          planType,
          status: 'active',
          expiresAt: expiresAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
