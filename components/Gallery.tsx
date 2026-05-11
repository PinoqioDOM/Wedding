"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photo, DBTables } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function Gallery({ initial }: { initial: Photo[] }) {
  const supabase = createClient();
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [uploader, setUploader] = useState("");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<Photo | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("მხოლოდ სურათები მიიღება");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("ფაილი ძალიან დიდია (მაქს. 10MB)");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("wedding-photos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("wedding-photos")
        .getPublicUrl(fileName);

      const insert: DBTables["photos"]["Insert"] = {
        url: publicUrl,
        uploader: uploader.trim() || null,
        caption: caption.trim() || null,
      };

      const { data, error } = await supabase
        .from("photos")
        .insert(insert as never)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setPhotos((prev) => [data as Photo, ...prev]);
        setCaption("");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "ატვირთვა ვერ მოხერხდა";
      alert(msg);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <>
      {/* Upload section */}
      <div className="card p-6 mb-10">
        <h3 className="font-display text-2xl mb-4">გააზიარეთ თქვენი მომენტი</h3>
        <div className="grid gap-3 md:grid-cols-2 mb-4">
          <input
            className="input"
            placeholder="თქვენი სახელი (არასავალდებულო)"
            value={uploader}
            onChange={(e) => setUploader(e.target.value)}
          />
          <input
            className="input"
            placeholder="წარწერა (არასავალდებულო)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <label className="btn-primary cursor-pointer inline-flex">
          {uploading ? "იტვირთება…" : "📷 ფოტოს არჩევა"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleFile}
          />
        </label>
      </div>

      {/* Gallery grid */}
      {photos.length === 0 ? (
        <p className="text-center text-ink-700/60 py-20">
          ჯერ არცერთი ფოტო არ არის ატვირთული. იყავით პირველი! ✨
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {photos.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreview(p)}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-cream-100 border border-cream-200"
            >
              <Image
                src={p.url}
                alt={p.caption ?? "wedding photo"}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              {(p.uploader || p.caption) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent p-3 text-left">
                  {p.caption && (
                    <p className="text-cream-50 text-sm font-medium truncate">{p.caption}</p>
                  )}
                  {p.uploader && (
                    <p className="text-cream-50/80 text-xs">— {p.uploader}</p>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox preview */}
      {preview && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink-900/80 backdrop-blur-sm p-4"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-10 right-0 text-cream-50 text-2xl"
              onClick={() => setPreview(null)}
            >
              ×
            </button>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src={preview.url}
                alt={preview.caption ?? "photo"}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            {(preview.caption || preview.uploader) && (
              <div className="text-center mt-4 text-cream-50">
                {preview.caption && <p className="font-display text-xl">{preview.caption}</p>}
                {preview.uploader && <p className="text-sm opacity-80 mt-1">— {preview.uploader}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}