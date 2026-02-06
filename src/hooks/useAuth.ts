import { useState, useEffect } from 'react'
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

// Define a guest user type
export interface GuestUser {
  id: 'guest'
  email: 'guest@tapa.ai'
  isGuest: true
}

// Union type for authenticated user or guest
export type User = any | GuestUser // Convex user is any, but has id, etc.

// Helper function to check if user is a guest
export const isGuestUser = (user: User | null): user is GuestUser => {
  return user !== null && 'isGuest' in user && user.isGuest === true
}

export const useAuth = () => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const getCurrentUser = useQuery(api.auth.getCurrentUser)
  const createUserProfile = useMutation(api.users.createUserProfile)
  const authActions = useAuthActions()

  useEffect(() => {
    if (isLoading) {
      setLoading(true)
      return
    }

    if (isAuthenticated && getCurrentUser) {
      // Create user profile if it doesn't exist
      createUserProfile({
        full_name: getCurrentUser.name,
        email: getCurrentUser.email,
        avatar_url: getCurrentUser.image
      })
        .then(() => {
          setUser(getCurrentUser)
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error creating user profile:', error)
          setLoading(false)
        })
    } else if (isAuthenticated && !getCurrentUser) {
      setLoading(false)
    } else {
      // Set guest user if not authenticated
      const guestUser: GuestUser = {
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true
      }
      setUser(guestUser)
      setLoading(false)
    }
  }, [isAuthenticated, isLoading, getCurrentUser, createUserProfile])

  const handleSignOut = async () => {
    try {
      await authActions.signOut()
      setUser({
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true
      })
    } catch (error) {
      console.error('Error signing out:', error)
      setUser({
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true
      })
    }
  }

  const handleSignIn = async (provider: string = "google") => {
    try {
      await authActions.signIn(provider)
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    signOut: handleSignOut,
    signIn: handleSignIn
  }
}