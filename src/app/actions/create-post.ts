"use server"

import { PostType } from "@/lib/schema/schema"
import db from "../db/db"
import { revalidatePath } from "next/cache"

export async function createPost(formData: FormData) {
  if (!formData) {
    return { error: "Invalid form data" }
  }

  const data = {
    slug: formData.get("slug") as string || "",
    type: formData.get("type") as string,
    title_en: formData.get("title_en") as string,
    title_ar: formData.get("title_ar") as string,
    description_en: (formData.get("description_en") as string) || "",
    description_ar: (formData.get("description_ar") as string) || "",
    content_en: (formData.get("content_en") as string) || "",
    content_ar: (formData.get("content_ar") as string) || "",
    pdfUrl: formData.get("pdfUrl") as string | null,
    imageUrl: formData.get("imageUrl") as string | null,
    readTime: (formData.get("readTime") as string) || "",
    published: formData.get("published") === "true",
    featured: formData.get("featured") === "true",
    publishedAt: formData.get("publishedAt") as string || new Date().toISOString(),
    tags: formData.getAll("tags"),
  }

  try {
    const prismaData = {
      ...data,
      imageUrl: data.imageUrl || null,
      pdfUrl: data.pdfUrl || null,
      publishedAt: new Date(data.publishedAt),
      content_en: (data.type === PostType.PUBLICATION || data.type === PostType.TESTIMONIALS) ? "" : (data.content_en || ""),
      content_ar: (data.type === PostType.PUBLICATION || data.type === PostType.TESTIMONIALS) ? "" : (data.content_ar || ""),
      tags: {
        connect: data.tags.map((tagId) => ({
          id: parseInt(tagId.toString(), 10)
        })),
      },
    }

    const post = await db.post.create({
      data: prismaData
    })

    revalidatePath("/admin/blog")
    revalidatePath("/admin/blog", "layout")
    revalidatePath(`/[lang]/media-center`, "page")
    return { success: true, post }
  } catch (error) {
    console.error("Failed to create post:", error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
