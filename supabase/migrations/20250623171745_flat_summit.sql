/*
  # Create model access table

  1. New Tables
    - `model_access`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `model_name` (text)
      - `access_granted` (boolean)
      - `expires_at` (timestamp, optional)
      - `granted_by` (uuid, references auth.users, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `model_access` table
    - Add policy for users to read their own access records
    - Add policy for admins to manage access records
*/

-- Create model_access table
CREATE TABLE IF NOT EXISTS model_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  model_name text NOT NULL,
  access_granted boolean DEFAULT false NOT NULL,
  expires_at timestamptz,
  granted_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, model_name)
);

-- Enable RLS
ALTER TABLE model_access ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own model access"
  ON model_access
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to check if user has access to a model
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
  IF p_model_name IN ('gpt-3.5-turbo', 'claude-3-haiku', 'llama-2-7b') THEN
    RETURN true;
  END IF;

  -- Premium models: accessible to premium and enterprise users
  IF p_model_name IN ('gpt-4', 'claude-3-sonnet', 'llama-2-70b') AND 
     user_subscription IN ('premium', 'enterprise') THEN
    RETURN true;
  END IF;

  -- Enterprise models: accessible to enterprise users only
  IF p_model_name IN ('gpt-4-turbo', 'claude-3-opus', 'custom-models') AND 
     user_subscription = 'enterprise' THEN
    RETURN true;
  END IF;

  -- Default: no access
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE TRIGGER update_model_access_updated_at
  BEFORE UPDATE ON model_access
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS model_access_user_id_model_name_idx 
  ON model_access(user_id, model_name);