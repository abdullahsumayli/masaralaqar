/**
 * Script to create admin user
 * Run with: node setup-admin.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase environment variables')
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const adminEmail = 'sumayliabdullah@gmail.com'
const adminPassword = '-abdullah@1974'

async function createAdminUser() {
  console.log('🔧 Setting up admin user...')
  console.log(`📧 Email: ${adminEmail}`)

  try {
    // 1. Create auth user
    console.log('\n1️⃣ Creating auth user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('ℹ️ User already exists, continuing...')
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

    const adminUser = userData.users.find(u => u.email === adminEmail)
    if (!adminUser) {
      throw new Error('Admin user not found')
    }

    const userId = adminUser.id
    console.log(`\n2️⃣ Admin user ID: ${userId}`)

    // 3. Update user profile with admin role
    console.log('\n3️⃣ Setting admin role...')
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({
        role: 'admin',
        name: 'مدير النظام',
        company: 'مسار العقار',
      })
      .eq('id', userId)
      .select()

    if (updateError) throw updateError

    console.log('✅ Admin role assigned')
    console.log(`   Role: ${updateData[0].role}`)

    console.log('\n✨ Admin user setup complete!')
    console.log('\n📌 Login Details:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('\n🔗 Go to: http://localhost:3000/admin/login')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createAdminUser()
