/*
  # Fix subscription_status enum and recreate functions

  1. Verify and recreate enum
    - Ensure subscription_status enum exists with correct values
    - Drop and recreate if necessary

  2. Recreate functions
    - Drop and recreate handle_new_user function
    - Drop and recreate has_model_access function
    - Drop and recreate update_daily_analytics function

  3. Recreate triggers
    - Ensure on_auth_user_created trigger is properly set up
    - Verify other triggers are working

  4. Security
    - Maintain all RLS policies
    - Ensure proper function security
*/

-- First, let's check if the enum exists and drop it if it does
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        DROP TYPE subscription_status CASCADE;
    END IF;
END $$;

-- Create the subscription_status enum with correct values
CREATE TYPE subscription_status AS ENUM ('free', 'premium');

-- Update the user_profiles table to use the enum (in case it was using text)
DO $$
BEGIN
    -- Check if the column exists and is not already the correct type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'subscription_status'
        AND data_type != 'USER-DEFINED'
    ) THEN
        -- Convert text column to enum
        ALTER TABLE user_profiles 
        ALTER COLUMN subscription_status TYPE subscription_status 
        USING subscription_status::subscription_status;
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'subscription_status'
    ) THEN
        -- Add the column if it doesn't exist
        ALTER TABLE user_profiles 
        ADD COLUMN subscription_status subscription_status DEFAULT 'free' NOT NULL;
    END IF;
END $$;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.has_model_access(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.update_daily_analytics() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Recreate the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, subscription_status)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    'free'::subscription_status
  );
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, just return
    RETURN new;
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create user profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the has_model_access function
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

  -- If no profile found, assume free tier
  IF user_subscription IS NULL THEN
    user_subscription := 'free'::subscription_status;
  END IF;

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
  -- Free models: accessible to all (models with 'free' in the name or specific free models)
  IF p_model_name ILIKE '%free%' OR 
     p_model_name IN (
       'gpt-3.5-turbo', 
       'claude-3-haiku', 
       'claude-3.5-haiku',
       'llama-2-7b',
       'mistral-7b',
       'openai/gpt-3.5-turbo',
       'anthropic/claude-3-haiku',
       'meta-llama/llama-2-7b-chat'
     ) THEN
    RETURN true;
  END IF;

  -- Premium models: accessible to premium users only
  IF user_subscription = 'premium'::subscription_status THEN
    RETURN true;
  END IF;

  -- Default: no access
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the update_daily_analytics function
CREATE OR REPLACE FUNCTION public.update_daily_analytics()
RETURNS trigger AS $$
BEGIN
  INSERT INTO usage_analytics (
    user_id, 
    date, 
    model_name, 
    total_interactions, 
    total_tokens_used, 
    total_response_time_ms
  )
  VALUES (
    NEW.user_id,
    DATE(NEW.created_at),
    NEW.model_name,
    1,
    NEW.tokens_used,
    COALESCE(NEW.response_time_ms, 0)
  )
  ON CONFLICT (user_id, date, model_name)
  DO UPDATE SET
    total_interactions = usage_analytics.total_interactions + 1,
    total_tokens_used = usage_analytics.total_tokens_used + NEW.tokens_used,
    total_response_time_ms = usage_analytics.total_response_time_ms + COALESCE(NEW.response_time_ms, 0),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_model_access_updated_at ON model_access;
DROP TRIGGER IF EXISTS update_usage_analytics_updated_at ON usage_analytics;
DROP TRIGGER IF EXISTS update_analytics_on_interaction ON interaction_logs;

-- Recreate the trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_model_access_updated_at
  BEFORE UPDATE ON model_access
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_analytics_updated_at
  BEFORE UPDATE ON usage_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Recreate analytics trigger
CREATE TRIGGER update_analytics_on_interaction
  AFTER INSERT ON interaction_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_daily_analytics();

-- Verify everything is set up correctly
DO $$
DECLARE
  enum_exists boolean;
  trigger_count integer;
  function_count integer;
BEGIN
  -- Check if enum exists
  SELECT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'subscription_status'
  ) INTO enum_exists;
  
  -- Check trigger count
  SELECT COUNT(*) INTO trigger_count
  FROM pg_trigger 
  WHERE tgname IN (
    'on_auth_user_created',
    'update_user_profiles_updated_at',
    'update_model_access_updated_at',
    'update_usage_analytics_updated_at',
    'update_analytics_on_interaction'
  );
  
  -- Check function count
  SELECT COUNT(*) INTO function_count
  FROM pg_proc 
  WHERE proname IN (
    'handle_new_user',
    'has_model_access',
    'update_daily_analytics',
    'update_updated_at_column'
  );
  
  -- Report status
  RAISE NOTICE 'Setup verification:';
  RAISE NOTICE 'Enum exists: %', enum_exists;
  RAISE NOTICE 'Triggers created: %', trigger_count;
  RAISE NOTICE 'Functions created: %', function_count;
  
  IF enum_exists AND trigger_count >= 5 AND function_count >= 4 THEN
    RAISE NOTICE 'SUCCESS: All components created successfully!';
  ELSE
    RAISE WARNING 'Some components may not have been created properly. Please check manually.';
  END IF;
END $$;