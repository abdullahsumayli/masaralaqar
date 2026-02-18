import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name?: string
  company?: string
  phone?: string
  subscription?: string
  role?: string
  created_at?: string
}

// Sign up new user
export async function signUp(email: string, password: string, name: string, company: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          company,
        },
      },
    })

    if (error) throw error

    // Create user profile in database
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        name,
        company,
        created_at: new Date().toISOString(),
      })
    }

    return { user: data.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Sign in user
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { user: data.user, session: data.session, error: null }
  } catch (error: any) {
    return { user: null, session: null, error: error.message }
  }
}

// Sign out user
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    return null
  }
}

// Get current session
export async function getCurrentSession() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    return null
  }
}

// Get user profile
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

// Reset password
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Update password
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}
