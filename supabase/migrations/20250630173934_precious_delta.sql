/*
  # Database Setup Verification

  This migration verifies that all database components are properly configured:
  1. Enum types
  2. Tables and columns
  3. Functions
  4. Triggers
  5. RLS policies
*/

-- Check enum types
SELECT 
  'ENUM CHECK' as check_type,
  typname as name,
  array_agg(enumlabel ORDER BY enumsortorder) as values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname = 'subscription_status'
GROUP BY typname;

-- Check tables and important columns
SELECT 
  'TABLE CHECK' as check_type,
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name IN ('user_profiles', 'interaction_logs', 'model_access', 'usage_analytics')
  AND column_name IN ('subscription_status', 'user_id', 'id')
ORDER BY table_name, column_name;

-- Check functions
SELECT 
  'FUNCTION CHECK' as check_type,
  proname as function_name,
  pg_get_function_result(oid) as return_type,
  pg_get_function_arguments(oid) as arguments
FROM pg_proc
WHERE proname IN (
  'handle_new_user',
  'has_model_access', 
  'update_daily_analytics',
  'update_updated_at_column'
)
ORDER BY proname;

-- Check triggers (corrected query)
SELECT 
  'TRIGGER CHECK' as check_type,
  n.nspname as schema_name,
  c.relname as table_name,
  t.tgname as trigger_name,
  CASE 
    WHEN t.tgenabled = 'O' THEN 'ENABLED'
    WHEN t.tgenabled = 'D' THEN 'DISABLED'
    ELSE 'UNKNOWN'
  END as status
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE t.tgname IN (
  'on_auth_user_created',
  'update_user_profiles_updated_at',
  'update_model_access_updated_at', 
  'update_usage_analytics_updated_at',
  'update_analytics_on_interaction'
)
AND n.nspname IN ('public', 'auth')
ORDER BY n.nspname, c.relname, t.tgname;

-- Check RLS policies (corrected query)
SELECT 
  'RLS POLICY CHECK' as check_type,
  schemaname,
  tablename,
  policyname,
  cmd as command,
  roles
FROM pg_policies
WHERE tablename IN ('user_profiles', 'interaction_logs', 'model_access', 'usage_analytics')
ORDER BY tablename, policyname;

-- Check if RLS is enabled on tables
SELECT 
  'RLS STATUS CHECK' as check_type,
  n.nspname as schema_name,
  c.relname as table_name,
  CASE 
    WHEN c.relrowsecurity THEN 'ENABLED'
    ELSE 'DISABLED'
  END as rls_status
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relname IN ('user_profiles', 'interaction_logs', 'model_access', 'usage_analytics')
  AND n.nspname = 'public'
ORDER BY c.relname;

-- Test the handle_new_user function (simulation)
SELECT 
  'FUNCTION TEST' as check_type,
  'handle_new_user' as function_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'handle_new_user' 
      AND pg_get_function_result(oid) = 'trigger'
    ) 
    THEN 'READY' 
    ELSE 'NOT FOUND' 
  END as status;

-- Test the has_model_access function
SELECT 
  'FUNCTION TEST' as check_type,
  'has_model_access' as function_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'has_model_access'
      AND pg_get_function_result(oid) = 'boolean'
    ) 
    THEN 'READY' 
    ELSE 'NOT FOUND' 
  END as status;

-- Check if subscription_status enum exists and has correct values
SELECT 
  'ENUM VALIDATION' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname = 'subscription_status'
      AND e.enumlabel IN ('free', 'premium')
    ) 
    THEN 'VALID' 
    ELSE 'INVALID OR MISSING' 
  END as enum_status;

-- Check user_profiles table structure
SELECT 
  'TABLE STRUCTURE CHECK' as check_type,
  'user_profiles' as table_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'user_profiles'
      AND column_name = 'subscription_status'
      AND data_type = 'USER-DEFINED'
    ) 
    THEN 'CORRECT' 
    ELSE 'INCORRECT' 
  END as structure_status;

-- Summary report
SELECT 
  'SUMMARY' as check_type,
  'Database setup verification complete' as message,
  now() as checked_at;