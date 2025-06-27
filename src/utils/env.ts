// Environment variable helpers
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key]
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required`)
  }
  return value || defaultValue!
}

export const isDevelopment = () => import.meta.env.DEV
export const isProduction = () => import.meta.env.PROD

// Supabase environment variables
export const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL')
export const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY')

// Openrouter environment variable
export const OPENROUTER_API_KEY = getEnvVar('VITE_OPENROUTER_API_KEY')