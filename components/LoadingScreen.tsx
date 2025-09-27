"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  isLoading: boolean
  progress: number
}

export default function LoadingScreen({ isLoading, progress }: LoadingScreenProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => clearInterval(interval)
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center">
        {/* Bengali text "I love you" */}
        <h1 className="font-serif text-4xl md:text-6xl text-white mb-8 tracking-wide">আমি তোমাকে ভালোবাসি</h1>

        {/* Loading indicator */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
          </div>

          <p className="font-mono text-sm text-gray-400 uppercase tracking-wider">Loading images{dots}</p>

          <p className="font-mono text-xs text-gray-600">{Math.round(progress)}%</p>
        </div>
      </div>
    </div>
  )
}
