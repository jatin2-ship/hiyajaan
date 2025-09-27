import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createGalleryBucket() {
  try {
    console.log("Creating gallery-images bucket...")

    // Create the bucket
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket("gallery-images", {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      fileSizeLimit: 10485760, // 10MB
    })

    if (bucketError && bucketError.message !== "Bucket already exists") {
      console.error("Error creating bucket:", bucketError)
      return
    }

    console.log("✅ Bucket created successfully!")

    // List existing buckets to verify
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("Error listing buckets:", listError)
      return
    }

    console.log("📁 Available buckets:")
    buckets.forEach((bucket) => {
      console.log(`  - ${bucket.name} (${bucket.public ? "public" : "private"})`)
    })

    // Check if there are any files in the bucket
    const { data: files, error: filesError } = await supabase.storage.from("gallery-images").list()

    if (filesError) {
      console.error("Error listing files:", filesError)
      return
    }

    console.log(`📸 Found ${files.length} images in gallery-images bucket`)

    if (files.length === 0) {
      console.log(
        "💡 Upload some images to the gallery-images bucket in your Supabase dashboard to see them in the gallery!",
      )
    }
  } catch (error) {
    console.error("Unexpected error:", error)
  }
}

createGalleryBucket()
