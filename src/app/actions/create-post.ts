"use server"

import { PostType } from "@/lib/schema/schema"
import db from "../db/db"
import { revalidatePath } from "next/cache"

export async function createPost(formData: FormData) {
  if (!formData) {
    return { error: "Invalid form data" }
  }

  const data = {
    slug: formData.get("slug"),
    type: formData.get("type"),
    title_en: formData.get("title_en"),
    title_ar: formData.get("title_ar"),
    description_en: formData.get("description_en") || "",
    description_ar: formData.get("description_ar") || "",
    content_en: formData.get("content_en") || "",
    content_ar: formData.get("content_ar") || "",
    pdfUrl: formData.get("pdfUrl"),
    imageUrl: formData.get("imageUrl"),
    readTime: formData.get("readTime") || "",
    published: formData.get("published") === "true",
    featured: formData.get("featured") === "true",
    tags: formData.getAll("tags"),
  }

  try {
    const prismaData = {
      ...data,
      imageUrl: data.imageUrl || null,
      pdfUrl: data.pdfUrl || null,
      content_en: data.type === PostType.PUBLICATION ? "" : (data.content_en || ""),
      content_ar: data.type === PostType.PUBLICATION ? "" : (data.content_ar || ""),
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
    return { success: true, post }
  } catch (error) {
    console.error("Failed to create post:", error)
    return { error: "Failed to create post" }
  }
}
