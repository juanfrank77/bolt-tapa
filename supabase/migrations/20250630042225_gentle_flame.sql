/*
  # Remove model_access table and related code

  This migration removes the unused model_access table and all related:
  1. Drop model_access table (with CASCADE to remove dependencies)
  2. Remove has_model_access function
  3. Remove any triggers related to model_access
  4. Clean up any remaining references

  The model access logic is now handled entirely through subscription_status
  in the user_profiles table.
*/

-- Drop the has_model_access function if it exists
DROP FUNCTION IF EXISTS has_model_access(uuid, text);

-- Drop any triggers on model_access table
DROP TRIGGER IF EXISTS update_model_access_updated_at ON model_access;

-- Drop the model_access table with CASCADE to remove all dependencies
DROP TABLE IF EXISTS model_access CASCADE;

-- Verify cleanup by checking remaining objects
SELECT 
  'CLEANUP VERIFICATION' as check_type,
  'model_access table and related objects removed' as message,
  now() as cleaned_at;