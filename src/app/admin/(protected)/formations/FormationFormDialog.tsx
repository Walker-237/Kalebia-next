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
import type { Formation } from "@/lib/types";

interface FormState {
  title: string;
  description: string;
  duration: string;
  price: string;
  published: boolean;
}

const EMPTY_FORM: FormState = { title: "", description: "", duration: "", price: "", published: true };

function toFormState(item: Formation | null): FormState {
  if (!item) return EMPTY_FORM;
  return {
    title: item.title,
    description: item.description,
    duration: item.duration,
    price: item.price,
    published: item.published,
  };
}

export function FormationFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Formation | null;
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
    if (!item && !image) {
      setError("L'image est requise.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("duration", form.duration);
      fd.append("price", form.price);
      fd.append("published", String(form.published));
      if (image) fd.append("image", image);

      if (item) {
        await api(`/formations/${item.id}`, { method: "PATCH", body: fd });
      } else {
        await api("/formations", { method: "POST", body: fd });
      }

      toast.success(item ? "Formation mise à jour" : "Formation créée");
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
          <DialogTitle>{item ? "Modifier la formation" : "Nouvelle formation"}</DialogTitle>
          <DialogDescription>
            {item ? "Mettez à jour les informations ci-dessous." : "Renseignez les informations de la formation."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Titre *</Label>
            <Input id="title" required value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="duration">Durée *</Label>
              <Input
                id="duration"
                required
                placeholder="3 mois"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">Prix (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </div>
          </div>

          <ImageUploadField label="Image" existingUrl={item?.image} onChange={setImage} required={!item} />

          <div className="flex items-center gap-2">
            <Switch id="published" checked={form.published} onCheckedChange={(v) => set("published", v)} />
            <Label htmlFor="published">Publiée</Label>
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
