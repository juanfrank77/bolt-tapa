import { useState, useEffect } from 'react'
import { useAuth, isGuestUser } from './useAuth'
import * as db from '../lib/database'

// Default guest profile
const GUEST_PROFILE = {
  id: 'guest-profile',
  user_id: 'guest',
  full_name: 'Guest User',
  avatar_url: null,
  subscription_status: 'free' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

// Hook for user profile
export const useUserProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    // Return guest profile for guest users
    if (isGuestUser(user)) {
      setProfile(GUEST_PROFILE)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await db.getUserProfile(user.id)
        setProfile(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const updateProfile = async (updates: {
    full_name?: string
    avatar_url?: string
    subscription_status?: 'free' | 'premium' | 'enterprise'
  }) => {
    if (!user || isGuestUser(user)) return

    try {
      const updatedProfile = await db.updateUserProfile(user.id, updates)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      throw err
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile
  }
}

// Hook for model access
export const useModelAccess = (modelName?: string) => {
  const { user } = useAuth()
  const [hasAccess, setHasAccess] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !modelName) {
      setHasAccess(false)
      setLoading(false)
      return
    }

    // Guest users only have access to free models
    if (isGuestUser(user)) {
      const freeModels = ['gpt-3.5-turbo', 'claude-3-haiku', 'llama-2-7b']
      setHasAccess(freeModels.includes(modelName))
      setLoading(false)
      return
    }

    const checkAccess = async () => {
      try {
        setLoading(true)
        const access = await db.checkModelAccess(user.id, modelName)
        setHasAccess(access)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check access')
        setHasAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [user, modelName])

  return {
    hasAccess,
    loading,
    error
  }
}

// Hook for interaction history
export const useInteractionHistory = (limit: number = 50) => {
  const { user } = useAuth()
  const [interactions, setInteractions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || isGuestUser(user)) {
      setInteractions([])
      setLoading(false)
      return
    }

    const fetchHistory = async () => {
      try {
        setLoading(true)
        const data = await db.getUserInteractionHistory(user.id, limit)
        setInteractions(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [user, limit])

  const logNewInteraction = async (
    modelName: string,
    prompt: string,
    response: string,
    tokensUsed: number,
    responseTimeMs?: number
  ) => {
    if (!user || isGuestUser(user)) return

    try {
      const newInteraction = await db.logInteraction(
        user.id,
        modelName,
        prompt,
        response,
        tokensUsed,
        responseTimeMs
      )
      setInteractions(prev => [newInteraction, ...prev])
      return newInteraction
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log interaction')
      throw err
    }
  }

  return {
    interactions,
    loading,
    error,
    logNewInteraction
  }
}

// Hook for usage analytics
export const useUsageAnalytics = (startDate?: string, endDate?: string) => {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || isGuestUser(user)) {
      setAnalytics([])
      setLoading(false)
      return
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const data = await db.getUserUsageAnalytics(user.id, startDate, endDate)
        setAnalytics(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user, startDate, endDate])

  return {
    analytics,
    loading,
    error
  }
}