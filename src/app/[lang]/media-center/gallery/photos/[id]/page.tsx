// "use client" ليس هنا لأن هذا ملف سيرفر
import Image from "next/image"
import { notFound } from "next/navigation"
import { getGalleryById } from "@/app/actions/create-gallery"
import GalleryDetailsClient from "./GalleryDetailsClient"

interface GalleryDetailsPageProps {
  params: {
    lang: string
    id: string
  }
}

export async function generateMetadata({ params }: GalleryDetailsPageProps) {
  const { lang } = params

  return {
    title: lang === 'ar' ? 'معرض الصور - تيك ستارت' : 'Photo Gallery - TechStart',
    description: lang === 'ar' 
      ? 'استكشف معرض صور تيك ستارت. شاهد لحظات من فعالياتنا وبرامجنا ومبادراتنا المختلفة.'
      : 'Explore TechStart photo gallery. View moments from our events, programs, and various initiatives.',
  }
}

export default async function GalleryDetailsPage({ params }: GalleryDetailsPageProps) {
  const { lang, id } = params
  const gallery = await getGalleryById(id)

  if (!gallery) return notFound()

  const title = lang === "ar" ? gallery.title_ar : gallery.title_en

  return <GalleryDetailsClient lang={lang} title={title} images={gallery.images} />
}
