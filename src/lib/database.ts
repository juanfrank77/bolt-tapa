import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

// User Profile operations
export const getUserProfile = (userId: string) => {
  return useQuery(api.users.getUserProfile, { userId })
}

export const updateUserProfile = () => {
  return useMutation(api.users.updateUserProfile)
}

// Interaction Logs operations
export const logInteraction = () => {
  return useMutation(api.interactions.logInteraction)
}
