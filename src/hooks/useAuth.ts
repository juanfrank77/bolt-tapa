import { useState, useEffect } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// Define a guest user type
export interface GuestUser {
  id: 'guest'
  email: 'guest@tapa.ai'
  isGuest: true
}

// Union type for authenticated user or guest
export type User = SupabaseUser | GuestUser

// Helper function to check if user is a guest
export const isGuestUser = (user: User | null): user is GuestUser => {
  return user !== null && 'isGuest' in user && user.isGuest === true
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          // Clear any stale session data if there's an error
          await supabase.auth.signOut()
          throw error
        }
        
        if (session?.user) {
          setUser(session.user)
        } else {
          // Set guest user if no authenticated session
          const guestUser: GuestUser = {
            id: 'guest',
            email: 'guest@tapa.ai',
            isGuest: true
          }
          setUser(guestUser)
        }
      } catch (error) {
        // If there's any error (including refresh token issues), clear session and set guest user
        await supabase.auth.signOut()
        const guestUser: GuestUser = {
          id: 'guest',
          email: 'guest@tapa.ai',
          isGuest: true
        }
        setUser(guestUser)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            setUser(session.user)
          } else {
            // Set guest user if no authenticated session
            const guestUser: GuestUser = {
              id: 'guest',
              email: 'guest@tapa.ai',
              isGuest: true
            }
            setUser(guestUser)
          }
        } catch (error) {
          // Handle any errors during auth state changes
          await supabase.auth.signOut()
          const guestUser: GuestUser = {
            id: 'guest',
            email: 'guest@tapa.ai',
            isGuest: true
          }
          setUser(guestUser)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    signOut: () => supabase.auth.signOut()
  }
}