/**
 * WhatsApp Webhook Handler
 * Receives messages from WhatsApp Cloud API
 */

import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppService } from '@/integrations/whatsapp'
import { TenantService } from '@/services/tenant.service'
import { LeadService } from '@/services/lead.service'
import { PropertyService } from '@/services/property.service'
import { AIService } from '@/services/ai.service'
import { OpenAIService } from '@/integrations/openai'
import { WebhookPayload } from '@/types/message'
import { TenantContext } from '@/types/message'

/**
 * GET: Webhook verification
 * WhatsApp sends GET requests to verify the webhook URL
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  // Get webhook secret from query
  const secret = searchParams.get('secret')

  if (!secret) {
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 400 })
  }

  // Verify token matches environment variable
  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'default_token'

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('Webhook verified')
    return NextResponse.json(challenge)
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

/**
 * POST: Handle incoming messages
 * Processes messages from WhatsApp Cloud API
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook secret from query
    const searchParams = request.nextUrl.searchParams
    const secret = searchParams.get('secret')

    if (!secret) {
      return NextResponse.json({ error: 'Missing webhook secret' }, { status: 400 })
    }

    // Get raw body for signature verification
    const bodyText = await request.text()

    // Verify signature
    const signature = request.headers.get('x-hub-signature-256')
    if (!WhatsAppService.verifyWebhookSignature(bodyText, signature || '', secret)) {
      console.warn('Invalid webhook signature')
      // For now, we'll allow it through - in production, return 403
      // return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // Parse payload
    const payload: WebhookPayload = JSON.parse(bodyText)

    // Find tenant by webhook secret
    const tenant = await TenantService.getTenantByWebhook(secret)

    if (!tenant) {
      console.error('Tenant not found for webhook secret')
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Parse incoming message
    const message = WhatsAppService.parseIncomingMessage(payload)

    if (!message) {
      // Not a message event (could be delivery status, etc.)
      return NextResponse.json({ success: true })
    }

    console.log('Received message:', message)

    // Create tenant context
    const tenantContext: TenantContext = {
      tenantId: tenant.id,
      whatsappNumber: tenant.whatsappNumber,
      aiPersona: tenant.aiPersona || {
        greeting: 'السلام عليكم ورحمة الله وبركاته',
        style: 'professional',
      },
    }

    // Create or update lead
    let lead = await LeadService.createLeadFromMessage(
      tenant.id,
      message.phone,
      '', // Name will be fetched from WhatsApp contact
      message.text
    )

    if (!lead) {
      console.error('Failed to create/update lead')
      // Still send response even if lead creation fails
    }

    // Analyze message
    const analysis = AIService.analyzeMessage(message.text, tenantContext)

    // Search for matching properties
    let matchedProperties = []
    if (analysis.extractedData.propertyType || analysis.extractedData.budget) {
      const searchResult = await PropertyService.searchProperties(tenant.id, {
        type: analysis.extractedData.propertyType,
        minPrice: analysis.extractedData.budget?.min,
        maxPrice: analysis.extractedData.budget?.max,
        city: analysis.extractedData.city,
        bedrooms: analysis.extractedData.bedrooms,
      })
      matchedProperties = searchResult.properties
    }

    // Generate reply
    const response = AIService.generatePropertyReply(analysis, matchedProperties, tenantContext)

    // Update lead with preferences if extracted
    if (lead && Object.keys(analysis.extractedData).length > 0) {
      await LeadService.updateLeadPreferences(tenant.id, message.phone, {
        city: analysis.extractedData.city,
        budget: analysis.extractedData.budget,
        propertyType: analysis.extractedData.propertyType,
        bedrooms: analysis.extractedData.bedrooms,
      })
    }

    // Add response to conversation
    if (lead) {
      await LeadService.addMessageToLead(tenant.id, lead.id, response.reply, 'outgoing')
    }

    // Send reply back to user
    const sent = await WhatsAppService.sendMessage(message.phone, response.reply, tenant.id)

    if (!sent) {
      console.error('Failed to send WhatsApp reply')
    }

    // Send suggestions if any
    if (response.suggestions && response.suggestions.length > 0) {
      const suggestionsText =
        '📋 اقتراحات:\n' + response.suggestions.map((s) => `• ${s}`).join('\n')
      await WhatsAppService.sendMessage(message.phone, suggestionsText, tenant.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
