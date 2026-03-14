#!/usr/bin/env node

/**
 * Clear all data from Supabase tables using REST API
 * Keeps the table structure and RLS policies intact
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ خطأ: يجب تعيين NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const tables = [
  'invoices',
  'bank_transfers',
  'user_subscriptions',
  'user_profiles',
  'blog_posts',
  'library_items',
  'subscription_plans',
]

// Add JWT token bypass for admin operations
const adminToken = process.env.SUPABASE_SERVICE_ROLE_KEY
const headers = {
  'Content-Type': 'application/json',
  'apikey': supabaseAnonKey,
  ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
}

async function clearData() {
  try {
    console.log('🗑️  جاري مسح البيانات...\n')

    for (const table of tables) {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/${table}?select=id`,
          {
            method: 'GET',
            headers,
          }
        )

        if (!response.ok) {
          console.log(`⚠️  ${table}: تعذر الحصول على البيانات`)
          continue
        }

        const records = await response.json()
        
        if (Array.isArray(records) && records.length > 0) {
          const ids = records.map(r => r.id)
          
          // Delete records via REST
          const deleteResponse = await fetch(
            `${supabaseUrl}/rest/v1/${table}`,
            {
              method: 'DELETE',
              headers,
              body: JSON.stringify({ id: ids }),
            }
          )

          if (deleteResponse.ok) {
            console.log(`✅ ${table}: تم حذف ${records.length} سجل`)
          } else {
            console.log(`⚠️  ${table}: فشل الحذف`)
          }
        } else {
          console.log(`✅ ${table}: لا توجد بيانات للحذف`)
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`)
      }
    }

    console.log('\n✨ تم انتهاء مسح البيانات!')
    console.log('📝 ملاحظة: هيكل الجداول وسياسات RLS محفوظة')
  } catch (error) {
    console.error('❌ خطأ أثناء مسح البيانات:', error)
    process.exit(1)
  }
}

clearData()
