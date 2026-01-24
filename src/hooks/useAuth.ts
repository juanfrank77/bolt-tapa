import { useState, useEffect } from 'react'
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
  const signOutMutation = useMutation(api.auth.signOut)
  const getCurrentUser = useQuery(api.auth.getCurrentUser)
  const createUserProfile = useMutation(api.users.createUserProfile)

  useEffect(() => {
    if (isLoading) {
      setLoading(true)
      return
    }

    if (isAuthenticated && getCurrentUser) {
      // Create user profile if it doesn't exist
      createUserProfile()
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
      await signOutMutation()
      setUser({
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true
      })
    } catch (error) {
      console.error('Error signing out:', error)
      // Fallback to guest state even if mutation fails
      setUser({
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true
      })
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    signOut: handleSignOut
  }
}