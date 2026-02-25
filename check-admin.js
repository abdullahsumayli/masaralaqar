/**
 * Script to check user status and reset password if needed
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jtwlyexgptntdubxnnaw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0d2x5ZXhncHRudGR1YnhubmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzODQ3MTQsImV4cCI6MjA4Njk2MDcxNH0.Zl_0D3QHKln3O0w0mmiMzH6mOyJVuSl97F6Z_VDS2k4'

const supabase = createClient(supabaseUrl, supabaseKey)

const adminEmail = 'sumayliabdullah@gmail.com'
const adminPassword = 'Admin@1974!'

async function checkAndLogin() {
  console.log('🔍 Checking user status...')
  console.log(`📧 Email: ${adminEmail}`)

  try {
    // Try to sign in
    console.log('\n1️⃣ Attempting to sign in...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    })

    if (error) {
      console.log('❌ Sign in failed:', error.message)
      
      if (error.message.includes('Email not confirmed')) {
        console.log('\n⚠️ Email needs confirmation!')
        console.log('Check your inbox for confirmation email.')
        
        // Try to resend confirmation
        console.log('\n2️⃣ Resending confirmation email...')
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: adminEmail,
        })
        
        if (resendError) {
          console.log('❌ Could not resend:', resendError.message)
        } else {
          console.log('✅ Confirmation email sent!')
        }
      } else if (error.message.includes('Invalid login credentials')) {
        console.log('\n⚠️ User may not exist or wrong password')
        console.log('\n2️⃣ Sending password reset email...')
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(adminEmail, {
          redirectTo: 'http://localhost:3000/auth/reset-password',
        })
        
        if (resetError) {
          console.log('❌ Could not send reset:', resetError.message)
        } else {
          console.log('✅ Password reset email sent!')
          console.log('Check your inbox and reset your password.')
        }
      }
    } else {
      console.log('✅ Sign in successful!')
      console.log(`   User ID: ${data.user.id}`)
      console.log(`   Email: ${data.user.email}`)
      console.log(`   Confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}`)
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkAndLogin()
