"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useApi } from "@/hooks/useApi";
import { ApiError } from "@/lib/apiClient";
import type { Testimonial } from "@/lib/types";

interface FormState {
  name: string;
  role: string;
  company: string;
  rating: string;
  comment: string;
  published: boolean;
}

const EMPTY_FORM: FormState = { name: "", role: "", company: "", rating: "5", comment: "", published: false };

function toFormState(item: Testimonial | null): FormState {
  if (!item) return EMPTY_FORM;
  return {
    name: item.name,
    role: item.role ?? "",
    company: item.company ?? "",
    rating: String(item.rating),
    comment: item.comment,
    published: item.published,
  };
}

export function TestimonialFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Testimonial | null;
  onSaved: () => void;
}) {
  const api = useApi();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // See RealisationFormDialog: key-based remount would break the
    // Dialog's close animation, so resetting on open/item change here
    // is the correct trade-off.
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(toFormState(item));
      setImage(null);
      setError(null);
    }
  }, [open, item]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Testimonials are only ever edited by an admin here (the public
      // creation form lives on the site itself), so this always PATCHes.
      if (!item) throw new Error("No testimonial to edit");

      const fd = new FormData();
      fd.append("name", form.name);
      if (form.role.trim()) fd.append("role", form.role.trim());
      if (form.company.trim()) fd.append("company", form.company.trim());
      fd.append("rating", form.rating);
      fd.append("comment", form.comment);
      fd.append("published", String(form.published));
      if (image) fd.append("image", image);

      await api(`/testimonials/${item.id}`, { method: "PATCH", body: fd });

      toast.success("Témoignage mis à jour");
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier le témoignage</DialogTitle>
          <DialogDescription>Mettez à jour les informations ci-dessous.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rating">Note (1-5) *</Label>
              <Input
                id="rating"
                type="number"
                min={1}
                max={5}
                required
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role">Poste</Label>
              <Input id="role" value={form.role} onChange={(e) => set("role", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="company">Entreprise</Label>
              <Input id="company" value={form.company} onChange={(e) => set("company", e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="comment">Commentaire *</Label>
            <Textarea id="comment" required rows={4} value={form.comment} onChange={(e) => set("comment", e.target.value)} />
          </div>

          <ImageUploadField label="Photo (optionnel)" existingUrl={item?.image} onChange={setImage} />

          <div className="flex items-center gap-2">
            <Switch id="published" checked={form.published} onCheckedChange={(v) => set("published", v)} />
            <Label htmlFor="published">Publié</Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
