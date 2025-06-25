import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

// User Profile operations
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export const updateUserProfile = async (userId: string, updates: {
  full_name?: string
  avatar_url?: string
  subscription_status?: 'free' | 'premium' | 'enterprise'
}) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Model Access operations
export const checkModelAccess = async (userId: string, modelName: string) => {
  // For now, implement basic access logic based on subscription status
  // Free models: gpt-3.5-turbo, claude-3-haiku
  // Premium models: gpt-4, claude-3-sonnet  
  // Enterprise models: gpt-4-turbo, claude-3-opus
  
  const freeModels = ['gpt-3.5-turbo', 'claude-3-haiku'];
  const premiumModels = ['gpt-4', 'claude-3-sonnet'];
  const enterpriseModels = ['gpt-4-turbo', 'claude-3-opus'];
  
  // Get user's subscription status
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('subscription_status')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  
  const subscriptionStatus = profile?.subscription_status || 'free';
  
  // Check access based on subscription
  if (freeModels.includes(modelName)) {
    return true; // Everyone has access to free models
  } else if (premiumModels.includes(modelName)) {
    return subscriptionStatus === 'premium' || subscriptionStatus === 'enterprise';
  } else if (enterpriseModels.includes(modelName)) {
    return subscriptionStatus === 'enterprise';
  }
  
  return false; // Default to no access
}

export const getUserModelAccess = async (userId: string) => {
  const { data, error } = await supabase
    .from('model_access')
    .select('*')
    .eq('user_id', userId)
    .eq('access_granted', true)

  if (error) throw error
  return data
}

// Interaction Logs operations
export const logInteraction = async (
  userId: string,
  modelName: string,
  prompt: string,
  response: string,
  tokensUsed: number,
  responseTimeMs?: number
) => {
  const { data, error } = await supabase
    .from('interaction_logs')
    .insert({
      user_id: userId,
      model_name: modelName,
      prompt,
      response,
      tokens_used: tokensUsed,
      response_time_ms: responseTimeMs
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getUserInteractionHistory = async (
  userId: string,
  limit: number = 50,
  offset: number = 0
) => {
  const { data, error } = await supabase
    .from('interaction_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

// Usage Analytics operations
export const getUserUsageAnalytics = async (
  userId: string,
  startDate?: string,
  endDate?: string
) => {
  let query = supabase
    .from('usage_analytics')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (startDate) {
    query = query.gte('date', startDate)
  }
  if (endDate) {
    query = query.lte('date', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export const getUserDailyUsage = async (userId: string, date: string) => {
  const { data, error } = await supabase
    .from('usage_analytics')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)

  if (error) throw error
  return data
}

// Helper function to get user's current subscription status
export const getUserSubscriptionStatus = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('subscription_status')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data.subscription_status
}