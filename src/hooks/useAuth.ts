'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (isMounted) {
          setUser(user)

          // Fetch user profile
          if (user) {
            const { data } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .single()

            if (data) {
              setProfile(data)
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setUser(session?.user || null)
        if (!session?.user) {
          setProfile(null)
        }
      }
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [])

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
  }
}

// Hook to protect routes
export function useRequireAuth() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  return { user, loading }
}

// Hook for admin pages
export function useRequireAdmin() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
    
    if (!loading && user && (profile as any)?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, profile, loading, router])

  return { user, profile, loading }
}
