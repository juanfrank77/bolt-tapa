/*
  # Create usage analytics table

  1. New Tables
    - `usage_analytics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date)
      - `model_name` (text)
      - `total_interactions` (integer)
      - `total_tokens_used` (integer)
      - `total_response_time_ms` (bigint)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `usage_analytics` table
    - Add policy for users to read their own analytics
*/

-- Create usage_analytics table for daily aggregated stats
CREATE TABLE IF NOT EXISTS usage_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  model_name text NOT NULL,
  total_interactions integer DEFAULT 0 NOT NULL,
  total_tokens_used integer DEFAULT 0 NOT NULL,
  total_response_time_ms bigint DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, date, model_name)
);

-- Enable RLS
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own usage analytics"
  ON usage_analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update daily analytics
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

-- Create trigger to update analytics on new interaction
CREATE TRIGGER update_analytics_on_interaction
  AFTER INSERT ON interaction_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_daily_analytics();

-- Create trigger for updated_at
CREATE TRIGGER update_usage_analytics_updated_at
  BEFORE UPDATE ON usage_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS usage_analytics_user_id_date_idx 
  ON usage_analytics(user_id, date DESC);

CREATE INDEX IF NOT EXISTS usage_analytics_date_idx 
  ON usage_analytics(date DESC);