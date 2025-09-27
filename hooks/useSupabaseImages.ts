"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface ImageItem {
  src: string
  alt: string
}

interface UseSupabaseImagesReturn {
  images: ImageItem[]
  loading: boolean
  progress: number
  error: string | null
}

export function useSupabaseImages(): UseSupabaseImagesReturn {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchImages() {
      try {
        const supabase = createClient()

        // List all files in the gallery-images bucket
        const { data: files, error: listError } = await supabase.storage.from("gallery-images").list("", {
          limit: 100,
          sortBy: { column: "name", order: "asc" },
        })

        if (listError) {
          console.error("Error listing files:", listError)
          setError("Failed to load images from storage")
          setLoading(false)
          return
        }

        if (!files || files.length === 0) {
          console.log("No images found in bucket")
          setError("No images found in storage bucket")
          setLoading(false)
          return
        }

        // Filter for image files only
        const imageFiles = files.filter((file) => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))

        if (imageFiles.length === 0) {
          setError("No image files found in storage bucket")
          setLoading(false)
          return
        }

        // Get public URLs for all images
        const imagePromises = imageFiles.map(async (file, index) => {
          const { data } = supabase.storage.from("gallery-images").getPublicUrl(file.name)

          // Update progress
          setProgress(((index + 1) / imageFiles.length) * 80) // 80% for URL generation

          return {
            src: data.publicUrl,
            alt: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for alt text
          }
        })

        const imageItems = await Promise.all(imagePromises)

        // Preload images to ensure they're ready before showing gallery
        const preloadPromises = imageItems.map((item, index) => {
          return new Promise<void>((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => {
              setProgress(80 + ((index + 1) / imageItems.length) * 20) // Remaining 20% for preloading
              resolve()
            }
            img.onerror = () => {
              console.warn(`Failed to preload image: ${item.src}`)
              resolve() // Don't reject, just continue
            }
            img.src = item.src
          })
        })

        await Promise.all(preloadPromises)

        setImages(imageItems)
        setProgress(100)

        // Small delay to show 100% before hiding loading screen
        setTimeout(() => {
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error("Error fetching images:", err)
        setError("Failed to load images")
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  return { images, loading, progress, error }
}
