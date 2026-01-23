import { useState, useEffect } from 'react'
import { useAuth as useConvexAuth } from 'convex/react'

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
  const { isAuthenticated, isLoading, user: convexUser } = useConvexAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoading) {
      setLoading(true)
      return
    }

    if (isAuthenticated && convexUser) {
      setUser(convexUser)
    } else {
      // Set guest user if not authenticated
      const guestUser: GuestUser = {
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true
      }
      setUser(guestUser)
    }
    setLoading(false)
  }, [isAuthenticated, isLoading, convexUser])

  return {
    user,
    loading,
    signOut: () => {
      // Convex sign out
      // Assuming we have a way, but for now, since guest is default, perhaps redirect or something
      // Convex doesn't have built-in signOut, need to implement based on auth provider
      // For simplicity, set to guest
      setUser({
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true
      })
    }
  }
}