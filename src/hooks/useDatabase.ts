import { useAuth, isGuestUser } from './useAuth'
import * as db from '../lib/database'

// Default guest profile
const GUEST_PROFILE = {
  id: 'guest-profile',
  user_id: 'guest',
  full_name: 'Guest User',
  avatar_url: null,
  subscription_status: 'free' as const,
  created_at: Date.now(),
  updated_at: Date.now()
}

// Hook for user profile
export const useUserProfile = () => {
  const { user } = useAuth()

  // Return guest profile for guest users
  if (isGuestUser(user)) {
    return {
      profile: GUEST_PROFILE,
      loading: false,
      error: null,
      updateProfile: () => Promise.resolve()
    }
  }

  const profile = user ? db.getUserProfile(user.id) : null
  const updateProfileMutation = db.updateUserProfile()

  const updateProfile = async (updates: {
    full_name?: string
    avatar_url?: string
    subscription_status?: 'free' | 'premium' | 'enterprise'
  }) => {
    if (!user || isGuestUser(user)) return

    return await updateProfileMutation({ userId: user.id, ...updates })
  }

  return {
    profile,
    loading: false, // Convex handles loading
    error: null,
    updateProfile
  }
}
