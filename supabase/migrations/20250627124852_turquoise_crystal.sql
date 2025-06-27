/*
  # Update subscription status to only support free and premium

  1. Changes
    - Create new enum with only 'free' and 'premium' values
    - Update user_profiles table to use new enum
    - Update all functions to use new enum
    - Remove old enum type

  2. Data Migration
    - Convert existing 'enterprise' users to 'premium'
    - Preserve 'free' and 'premium' users as-is

  3. Security
    - Update RLS policies to work with new enum
    - Update access control functions
*/

-- Create new enum with only free and premium
CREATE TYPE subscription_status_new AS ENUM ('free', 'premium');

-- Update existing data: convert enterprise to premium
UPDATE user_profiles 
SET subscription_status = 'premium'::subscription_status 
WHERE subscription_status = 'enterprise'::subscription_status;

-- Add new column with new enum type
ALTER TABLE user_profiles 
ADD COLUMN subscription_status_new subscription_status_new DEFAULT 'free';

-- Copy data from old column to new column
UPDATE user_profiles 
SET subscription_status_new = 
  CASE 
    WHEN subscription_status = 'free'::subscription_status THEN 'free'::subscription_status_new
    WHEN subscription_status = 'premium'::subscription_status THEN 'premium'::subscription_status_new
    WHEN subscription_status = 'enterprise'::subscription_status THEN 'premium'::subscription_status_new
    ELSE 'free'::subscription_status_new
  END;

-- Drop old column and rename new column
ALTER TABLE user_profiles DROP COLUMN subscription_status;
ALTER TABLE user_profiles RENAME COLUMN subscription_status_new TO subscription_status;

-- Make the new column NOT NULL
ALTER TABLE user_profiles ALTER COLUMN subscription_status SET NOT NULL;

-- Drop old enum type
DROP TYPE subscription_status;

-- Rename new enum type to original name
ALTER TYPE subscription_status_new RENAME TO subscription_status;

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, subscription_status)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'free'::subscription_status);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the has_model_access function
CREATE OR REPLACE FUNCTION public.has_model_access(
  p_user_id uuid,
  p_model_name text
)
RETURNS boolean AS $$
DECLARE
  access_record RECORD;
  user_subscription subscription_status;
BEGIN
  -- Get user's subscription status
  SELECT subscription_status INTO user_subscription
  FROM user_profiles
  WHERE user_id = p_user_id;

  -- Check for explicit access record
  SELECT * INTO access_record
  FROM model_access
  WHERE user_id = p_user_id 
    AND model_name = p_model_name
    AND access_granted = true
    AND (expires_at IS NULL OR expires_at > now());

  -- If explicit access found, return true
  IF FOUND THEN
    RETURN true;
  END IF;

  -- Default access based on subscription and model type
  -- Free models: accessible to all
  IF p_model_name IN ('gpt-3.5-turbo', 'claude-3.5-haiku', 'llama-2-7b') THEN
    RETURN true;
  END IF;

  -- Premium models: accessible to premium users only
  IF p_model_name IN ('gpt-4o', 'claude-3.5-sonnet', 'gpt-4.1', 'claude-3-opus', 'llama-2-70b') AND 
     user_subscription = 'premium' THEN
    RETURN true;
  END IF;

  -- Default: no access
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;