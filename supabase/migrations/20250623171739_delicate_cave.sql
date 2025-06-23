/*
  # Create interaction logs table

  1. New Tables
    - `interaction_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `model_name` (text)
      - `prompt` (text)
      - `response` (text)
      - `tokens_used` (integer)
      - `response_time_ms` (integer, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `interaction_logs` table
    - Add policy for users to read their own logs
    - Add policy for users to insert their own logs
*/

-- Create interaction_logs table
CREATE TABLE IF NOT EXISTS interaction_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  model_name text NOT NULL,
  prompt text NOT NULL,
  response text NOT NULL,
  tokens_used integer DEFAULT 0 NOT NULL,
  response_time_ms integer,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE interaction_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own interaction logs"
  ON interaction_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interaction logs"
  ON interaction_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS interaction_logs_user_id_created_at_idx 
  ON interaction_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS interaction_logs_model_name_idx 
  ON interaction_logs(model_name);