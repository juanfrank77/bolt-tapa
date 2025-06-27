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
  subscription_status?: 'free' | 'premium'
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
  // Free models: gpt-3.5-turbo, claude-3.5-haiku
  // Premium models: gpt-4o, claude-3.5-sonnet  
  // Enterprise models: gpt-4.1, claude-3-opus
  
  const freeModels = ['gpt-3.5-turbo', 'claude-3.5-haiku'];
  const premiumModels = ['gpt-4o', 'claude-3.5-sonnet', 'gpt-4.1', 'claude-3-opus'];
  
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
    return subscriptionStatus === 'premium';
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
