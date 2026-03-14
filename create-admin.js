/**
 * Script to create admin user using public API
 * Run with: node create-admin.js
 */

const { createClient } = require('@supabase/supabase-js')

// Use values directly since .env.local might not load properly
const supabaseUrl = 'https://jtwlyexgptntdubxnnaw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0d2x5ZXhncHRudGR1YnhubmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzODQ3MTQsImV4cCI6MjA4Njk2MDcxNH0.Zl_0D3QHKln3O0w0mmiMzH6mOyJVuSl97F6Z_VDS2k4'

const supabase = createClient(supabaseUrl, supabaseKey)

const adminEmail = 'sumayliabdullah@gmail.com'
const adminPassword = 'Admin@1974!'

async function createAdminUser() {
  console.log('🔧 Creating admin user...')
  console.log(`📧 Email: ${adminEmail}`)

  try {
    // Sign up new user
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          name: 'مدير النظام',
          company: 'مسار العقار',
        },
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('ℹ️ User already exists!')
        console.log('\n📌 Try logging in with:')
        console.log(`   Email: ${adminEmail}`)
        console.log('   Password: (use your existing password)')
        return
      }
      throw error
    }

    console.log('✅ Admin user created!')
    
    if (data.user) {
      console.log(`   ID: ${data.user.id}`)
      
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: data.user.id,
          email: adminEmail,
          name: 'مدير النظام',
          company: 'مسار العقار',
          role: 'admin',
          created_at: new Date().toISOString(),
        })

      if (profileError) {
        console.log('⚠️ Could not create profile:', profileError.message)
      } else {
        console.log('✅ Admin profile created with role: admin')
      }
    }

    console.log('\n✨ Setup complete!')
    console.log('\n📌 Login Details:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('\n🔗 Go to: http://localhost:3000/admin/login')
    console.log('\n⚠️ Note: Check your email to confirm the account if required.')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createAdminUser()
