"use server";

import { ApiError } from "@/shared/lib/apis/client.api";

import { uploadImage } from "../apis/dashboard.api";

/** Vercel rejects request bodies over 4.5 MB, so 4 MB is the most that can ever arrive. The API uses the same limit. */
const MAX_BYTES = 4 * 1024 * 1024;

export type UploadResult = { ok: true; path: string } | { ok: false; error: string };

/** Takes a FormData with an `image` file and returns the path the API stored it under. */
export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "اختر صورة أولاً" };
  if (!file.type.startsWith("image/")) return { ok: false, error: "الملف يجب أن يكون صورة" };
  if (file.size > MAX_BYTES) return { ok: false, error: "حجم الصورة كبير (الحد الأقصى 4 ميجابايت)" };

  try {
    const { path } = await uploadImage(file);
    return { ok: true, path };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, error: error.message };
    throw error;
  }
}
