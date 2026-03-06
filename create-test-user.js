/**
 * Script to create test user account
 * Run with: node create-test-user.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jtwlyexgptntdubxnnaw.supabase.co'
let supabaseKey = process.env.SUPABASE_SERVICE_KEY

// If not set, use the key directly
if (!supabaseKey) {
  supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0d2x5ZXhncHRudGR1YnhubmF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM4NDcxNCwiZXhwIjoyMDg2OTYwNzE0fQ.7N2XRif1EChlm1gbrB-ayf11Cp-9zrOR3JTREeORoSI'
}

if (!supabaseUrl) {
  console.error('❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL')
  process.exit(1)
}

if (!supabaseKey) {
  console.error('❌ Error: Missing SUPABASE_SERVICE_KEY')
  console.error('📌 Get it from Supabase Dashboard > Project Settings > API > Service Role Secret')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Test user details
const testEmail = 'test@masaralaqar.com'
const testPassword = 'Test@123456'
const testName = 'Test User'
const testCompany = 'Test Company'

async function createTestUser() {
  console.log('🔧 Creating test user account...\n')

  try {
    // 1. Create auth user
    console.log('1️⃣ Creating auth user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️ User already exists, getting existing user...')
      } else {
        throw authError
      }
    } else {
      console.log('✅ Auth user created')
      console.log(`   ID: ${authData.user.id}`)
    }

    // 2. Get user ID
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()
    if (userError) throw userError

    const testUser = userData.users.find(u => u.email === testEmail)
    if (!testUser) {
      throw new Error('Test user not found')
    }

    const userId = testUser.id
    console.log(`\n2️⃣ Test user ID: ${userId}`)

    // 3. Update or create user profile
    console.log('\n3️⃣ Creating user profile...')
    
    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    let profileData
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('users')
        .update({
          name: testName,
          email: testEmail,
          role: 'user',
        })
        .eq('id', userId)
        .select()

      if (error) throw error
      profileData = data
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: testEmail,
          name: testName,
          role: 'user',
        })
        .select()

      if (error) throw error
      profileData = data
    }

    console.log('✅ User profile created/updated')

    console.log('\n' + '='.repeat(50))
    console.log('✨ TEST USER SETUP COMPLETE!')
    console.log('='.repeat(50))
    console.log('\n📌 Login Details:')
    console.log(`   📧 Email: ${testEmail}`)
    console.log(`   🔐 Password: ${testPassword}`)
    console.log(`   👤 Name: ${testName}`)
    console.log('='.repeat(50))
    console.log('\n🌐 Login at: https://masaralaqar.com/login')
    console.log('📱 Local: http://localhost:3000/login')
    console.log('\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createTestUser()
