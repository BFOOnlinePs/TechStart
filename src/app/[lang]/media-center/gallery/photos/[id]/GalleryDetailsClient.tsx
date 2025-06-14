"use client"

import Image from "next/image"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface GalleryDetailsClientProps {
  lang: string
  title: string
  images: { id: string; url: string; title_ar?: string; title_en?: string }[]
}

export default function GalleryDetailsClient({ lang, title, images }: GalleryDetailsClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">{title}</h1>
      
      {/* Gallery Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="shadow rounded overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(img.url)}
            >
              <Image
                src={img.url}
                alt={lang === "ar" ? img.title_ar || "صورة" : img.title_en || "Image"}
                width={600}
                height={400}
                className="object-cover w-full h-64 transition-transform duration-200 hover:scale-105"
                priority={i === 0}
              />
              <div className="p-2 text-center text-gray-600">
                {lang === "ar" ? img.title_ar : img.title_en}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          {lang === "ar" ? "لا توجد صور في هذا المعرض." : "No images in this gallery."}
        </p>
      )}

      {/* Modal for Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl w-full mx-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 z-50"
              >
                <X size={24} />
              </button>
              <Image
                src={selectedImage}
                alt="preview"
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
