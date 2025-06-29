/*
  # Database Setup Verification Script
  
  Run this script to verify that all database components are properly set up.
  This script will check:
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

-- Check triggers
SELECT 
  'TRIGGER CHECK' as check_type,
  schemaname,
  tablename,
  triggername,
  CASE 
    WHEN tgenabled = 'O' THEN 'ENABLED'
    WHEN tgenabled = 'D' THEN 'DISABLED'
    ELSE 'UNKNOWN'
  END as status
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE triggername IN (
  'on_auth_user_created',
  'update_user_profiles_updated_at',
  'update_model_access_updated_at', 
  'update_usage_analytics_updated_at',
  'update_analytics_on_interaction'
)
ORDER BY schemaname, tablename, triggername;

-- Check RLS policies
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

-- Summary report
SELECT 
  'SUMMARY' as check_type,
  'Database setup verification complete' as message,
  now() as checked_at;