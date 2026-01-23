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

// Openrouter environment variable
export const OPENROUTER_API_KEY = getEnvVar('VITE_OPENROUTER_API_KEY')
