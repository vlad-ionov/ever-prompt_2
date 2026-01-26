-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  model TEXT,
  type TEXT CHECK (type IN ('video', 'audio', 'image', 'text')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  likes INTEGER DEFAULT 0,
  is_liked BOOLEAN DEFAULT false,
  is_saved BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  author JSONB,
  initial_prompt TEXT,
  view_count INTEGER DEFAULT 0,
  use_cases TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  prompt_ids UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Create policies for prompts table
-- Users can insert their own prompts
CREATE POLICY "Users can insert their own prompts"
  ON prompts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own prompts
CREATE POLICY "Users can view their own prompts"
  ON prompts
  FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

-- Users can update their own prompts
CREATE POLICY "Users can update their own prompts"
  ON prompts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own prompts
CREATE POLICY "Users can delete their own prompts"
  ON prompts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for collections table
-- Users can insert their own collections
CREATE POLICY "Users can insert their own collections"
  ON collections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own collections
CREATE POLICY "Users can view their own collections"
  ON collections
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own collections
CREATE POLICY "Users can update their own collections"
  ON collections
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own collections
CREATE POLICY "Users can delete their own collections"
  ON collections
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to prompts
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger to collections
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_type ON prompts(type);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_created_at ON collections(created_at DESC);

-- Storage Bucket Setup
-- Create prompt-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('prompt-images', 'prompt-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own uploaded images" ON storage.objects;

-- Policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'prompt-images' );

-- Policy to allow public to view images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'prompt-images' );

CREATE POLICY "Users can delete their own uploaded images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'prompt-images' AND auth.uid() = owner );

-- Function to increment prompt views
CREATE OR REPLACE FUNCTION increment_prompt_views(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts
  SET view_count = view_count + 1
  WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

