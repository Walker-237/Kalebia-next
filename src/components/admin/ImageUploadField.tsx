"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadIcon } from "lucide-react";

export function ImageUploadField({
  label,
  existingUrl,
  onChange,
  required,
}: {
  label: string;
  existingUrl?: string | null;
  onChange: (file: File | null) => void;
  required?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
    setPreview(file ? URL.createObjectURL(file) : (existingUrl ?? null));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>
        {label}
        {required && " *"}
      </Label>
      <div className="flex items-center gap-3">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary/blob preview URLs
          <img
            src={preview}
            alt=""
            className="size-16 rounded-lg border border-[#111114]/10 object-cover"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-lg border border-dashed border-[#111114]/20 text-[#111114]/30">
            <UploadIcon className="size-5" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            {existingUrl ? "Remplacer" : "Choisir une image"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
