-- Added better comments and verification queries
-- Create a storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images', 
  'gallery-images', 
  true,
  10485760, -- 10MB limit per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow public access for the gallery
CREATE POLICY IF NOT EXISTS "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'gallery-images');

CREATE POLICY IF NOT EXISTS "Public Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY IF NOT EXISTS "Public Update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'gallery-images');

CREATE POLICY IF NOT EXISTS "Public Delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'gallery-images');

-- Added verification query to confirm bucket creation
-- Verify the bucket was created successfully
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'gallery-images';
