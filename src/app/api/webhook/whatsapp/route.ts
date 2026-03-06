/**
 * WhatsApp Webhook Handler
 * Receives messages from UltraMsg API
 */

import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppService } from '@/integrations/whatsapp'
import { TenantService } from '@/services/tenant.service'
import { LeadService } from '@/services/lead.service'
import { PropertyService } from '@/services/property.service'
import { AIService } from '@/services/ai.service'
import { TenantContext } from '@/types/message'

// Fixed webhook secret for initial setup
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'masar2024secret'

/**
 * GET: Webhook verification
 * UltraMsg sends GET requests to verify the webhook URL
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')

  // Simple secret verification
  if (secret === WEBHOOK_SECRET) {
    console.log('UltraMsg Webhook verified')
    return NextResponse.json({ status: 'ok', message: 'Webhook verified' })
  }

  // WhatsApp Cloud API verification (fallback)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === WEBHOOK_SECRET) {
    console.log('Webhook verified')
    return new NextResponse(challenge || 'ok')
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

/**
 * POST: Handle incoming messages from UltraMsg
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook secret from query
    const searchParams = request.nextUrl.searchParams
    const secret = searchParams.get('secret')

    // Verify secret
    if (secret !== WEBHOOK_SECRET) {
      console.warn('Invalid webhook secret:', secret)
      return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
    }

    // Parse request body
    const bodyText = await request.text()
    console.log('Webhook received:', bodyText)

    let payload: any
    try {
      payload = JSON.parse(bodyText)
    } catch {
      // UltraMsg may send form-urlencoded data
      const formData = new URLSearchParams(bodyText)
      payload = {
        data: {
          from: formData.get('from'),
          body: formData.get('body'),
          id: formData.get('id'),
        }
      }
    }

    // Parse incoming message using UltraMsg format
    const message = WhatsAppService.parseIncomingMessage(payload)

    if (!message) {
      console.log('No valid message in payload')
      return NextResponse.json({ success: true, message: 'No message to process' })
    }

    console.log('Received message:', message)

    // For now, use a default tenant context (single tenant mode)
    // In multi-tenant mode, lookup tenant by webhook secret
    let tenant = null
    try {
      tenant = await TenantService.getTenantByWebhook(secret)
    } catch (error) {
      console.log('Tenant lookup failed, using default context')
    }

    const tenantContext: TenantContext = {
      tenantId: tenant?.id || 'default',
      whatsappNumber: tenant?.whatsappNumber || '',
      aiPersona: tenant?.aiPersona || {
        agentName: 'مساعد مسار العقار',
        responseStyle: 'friendly',
        welcomeMessage: 'السلام عليكم ورحمة الله وبركاته، أهلاً بك في مسار العقار 🏠'
      },
    }

    // Create or update lead (skip if no tenant)
    let lead = null
    if (tenant?.id) {
      lead = await LeadService.createLeadFromMessage(
        tenant.id,
        message.phone,
        '',
        message.text
      )
    }

    // Analyze message
    const analysis = AIService.analyzeMessage(message.text, tenantContext)
    console.log('Message analysis:', analysis)

    // Search for matching properties (if tenant exists)
    let matchedProperties: any[] = []
    if (tenant?.id && (analysis.extractedData.propertyType || analysis.extractedData.budget)) {
      const searchResult = await PropertyService.searchProperties(tenant.id, {
        type: analysis.extractedData.propertyType,
        minPrice: analysis.extractedData.budget?.min,
        maxPrice: analysis.extractedData.budget?.max,
        city: analysis.extractedData.city,
        bedrooms: analysis.extractedData.bedrooms,
      })
      matchedProperties = searchResult.properties || []
    }

    // Generate reply
    const response = AIService.generatePropertyReply(analysis, matchedProperties, tenantContext)
    console.log('Generated response:', response.reply)

    // Update lead with preferences if extracted
    if (lead && Object.keys(analysis.extractedData).length > 0) {
      await LeadService.updateLeadPreferences(tenant!.id, message.phone, {
        city: analysis.extractedData.city,
        budget: analysis.extractedData.budget,
        propertyType: analysis.extractedData.propertyType,
        bedrooms: analysis.extractedData.bedrooms,
      })
    }

    // Add response to conversation
    if (lead) {
      await LeadService.addMessageToLead(tenant!.id, lead.id, response.reply, 'outgoing')
    }

    // Send reply back to user via UltraMsg
    const sent = await WhatsAppService.sendMessage(message.phone, response.reply, tenant?.id || 'default')

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
