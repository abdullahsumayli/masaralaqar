#!/usr/bin/env node

/**
 * Clear all data from Supabase tables
 * Keeps the table structure and RLS policies intact
 * Usage: node scripts/clear-data.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ خطأ: يجب تعيين NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY في .env.local')
  console.error('\n📝 للحصول على SUPABASE_SERVICE_ROLE_KEY:')
  console.error('1. توجه إلى: https://supabase.com/dashboard')
  console.error('2. اختر مشروعك')
  console.error('3. Settings > API > Service Role Secret')
  console.error('4. أضف القيمة إلى .env.local كـ: SUPABASE_SERVICE_ROLE_KEY=...')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const tables = [
  'invoices',
  'bank_transfers',
  'user_subscriptions',
  'user_profiles',
  'blog_posts',
  'library_items',
  'subscription_plans',
]

async function clearData() {
  try {
    console.log('🗑️  Starting data clear...\n')

    for (const table of tables) {
      try {
        const { error, count } = await supabase
          .from(table)
          .delete()
          .neq('id', '') // Delete all rows

        if (error) {
          console.log(`⚠️  ${table}: ${error.message}`)
        } else {
          console.log(`✅ ${table}: Cleared ${count || '0'} records`)
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`)
      }
    }

    console.log('\n✨ Data clear complete!')
    console.log('📝 Note: Table structures and RLS policies are preserved')
  } catch (error) {
    console.error('❌ Error during data clear:', error)
    process.exit(1)
  }
}

clearData()
