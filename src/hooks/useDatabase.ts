import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import * as db from '../lib/database'

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
    if (!user) return

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
    if (!user) {
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
    if (!user) return

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
    if (!user) {
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