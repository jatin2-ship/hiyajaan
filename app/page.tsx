"use client"

import InfiniteGallery from "@/components/InfiniteGallery"
import LoadingScreen from "@/components/LoadingScreen"
import { useSupabaseImages } from "@/hooks/useSupabaseImages"

export default function Home() {
  const { images, loading, progress, error } = useSupabaseImages()

  // Show error state if there's an error
  if (error && !loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="font-serif text-2xl mb-4">Unable to load gallery</h1>
          <p className="font-mono text-sm text-gray-400">{error}</p>
          <p className="font-mono text-xs text-gray-600 mt-2">
            Please upload images to the 'gallery-images' bucket in Supabase Storage
          </p>
        </div>
      </main>
    )
  }

  return (
    <>
      <LoadingScreen isLoading={loading} progress={progress} />

      <main className="min-h-screen">
        {!loading && images.length > 0 && (
          <>
            <InfiniteGallery
              images={images}
              speed={1.2}
              zSpacing={3}
              visibleCount={12}
              falloff={{ near: 0.8, far: 14 }}
              className="h-screen w-full rounded-lg overflow-hidden"
            />
            <div className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white">
              <h1 className="font-serif text-4xl md:text-7xl tracking-tight">
                <span className="italic">us.</span>
              </h1>
            </div>

            <div className="text-center fixed bottom-10 left-0 right-0 font-mono uppercase text-[11px] font-semibold">
              <p>Use mouse wheel, arrow keys, or touch to navigate</p>
              <p className="opacity-60">Auto-play resumes after 3 seconds of inactivity</p>
            </div>
          </>
        )}
      </main>
    </>
  )
}
