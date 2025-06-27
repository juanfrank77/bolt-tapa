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
