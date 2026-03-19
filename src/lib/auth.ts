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

// Sign up new user — also auto-creates an office
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

    if (data.user) {
      // Create user profile
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        name,
        company,
        role: 'user',
        created_at: new Date().toISOString(),
      })

      // Auto-create office so WhatsApp connect works immediately
      try {
        const { OfficeService } = await import('@/services/office.service')
        await OfficeService.ensureUserOffice(data.user.id)
      } catch (officeErr) {
        console.error('[signUp] auto-create office failed (non-blocking):', officeErr)
      }
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

// Update user profile — tries all fields first, falls back to name-only if columns are missing
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  try {
    // Only include fields with actual values to avoid sending undefined
    const safeUpdates: Record<string, string> = {};
    if (updates.name !== undefined) safeUpdates.name = updates.name;
    if (updates.company !== undefined) safeUpdates.company = updates.company;
    if (updates.phone !== undefined) safeUpdates.phone = updates.phone;

    const { error } = await supabase
      .from('users')
      .update(safeUpdates)
      .eq('id', userId)

    if (error) {
      // If a column doesn't exist in schema cache, retry without it
      const missingCol = error.message?.match(/column '(\w+)'/)?.[1]
        || error.message?.match(/'(\w+)' column/)?.[1];
      if (missingCol && safeUpdates[missingCol] !== undefined) {
        console.warn(`[updateUserProfile] column '${missingCol}' missing, retrying without it`);
        delete safeUpdates[missingCol];
        const { error: retryError } = await supabase
          .from('users')
          .update(safeUpdates)
          .eq('id', userId)
        if (retryError) throw retryError;
        return { data: null, error: null };
      }
      throw error;
    }

    return { data: null, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

// Reset password
export async function resetPassword(email: string) {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || ''
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/reset-password`,
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

/** Sign up partner (affiliate) — creates user with role=affiliate and affiliate record. No office. */
export async function signUpPartner(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    if (!data.user) return { user: null, error: "فشل إنشاء الحساب" };

    await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email,
      name,
      role: "affiliate",
      created_at: new Date().toISOString(),
    });

    const { AffiliateRepository } = await import("@/repositories/affiliate.repo");
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    for (let attempt = 0; attempt < 10; attempt++) {
      const existing = await AffiliateRepository.getByReferralCode(code);
      if (!existing) break;
      code = "";
      for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    }
    await AffiliateRepository.createAffiliate(data.user.id, code, null);

    return { user: data.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

// Export lead functions
