// Database types will be generated here
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  avatar_url?: string
  subscription_status: 'free' | 'premium'
  created_at: string
  updated_at: string
}

export interface InteractionLog {
  id: string
  user_id: string
  model_name: string
  prompt: string
  response: string
  tokens_used: number
  created_at: string
}

export interface ModelAccess {
  id: string
  user_id: string
  model_name: string
  access_granted: boolean
  expires_at?: string
  created_at: string
}