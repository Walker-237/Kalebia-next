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
import type { Realisation } from "@/lib/types";

interface FormState {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  client: string;
  category: string;
  technologies: string;
  projectUrl: string;
  githubUrl: string;
  completionDate: string;
  featured: boolean;
  published: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  shortDescription: "",
  longDescription: "",
  client: "",
  category: "",
  technologies: "",
  projectUrl: "",
  githubUrl: "",
  completionDate: "",
  featured: false,
  published: true,
};

function toFormState(item: Realisation | null): FormState {
  if (!item) return EMPTY_FORM;
  return {
    title: item.title,
    slug: item.slug,
    shortDescription: item.shortDescription,
    longDescription: item.longDescription,
    client: item.client ?? "",
    category: item.category,
    technologies: item.technologies.join(", "),
    projectUrl: item.projectUrl ?? "",
    githubUrl: item.githubUrl ?? "",
    completionDate: item.completionDate ? item.completionDate.slice(0, 10) : "",
    featured: item.featured,
    published: item.published,
  };
}

export function RealisationFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Realisation | null;
  onSaved: () => void;
}) {
  const api = useApi();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dialog must stay mounted through its close transition, so a
    // key-based remount (the usual effect-free way to reset form state)
    // would break the animation — resetting on `open`/`item` change here
    // is the correct trade-off.
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(toFormState(item));
      setCoverImage(null);
      setGalleryFiles(null);
      setError(null);
    }
  }, [open, item]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!item && !coverImage) {
      setError("L'image de couverture est requise.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      if (form.slug.trim()) fd.append("slug", form.slug.trim());
      fd.append("shortDescription", form.shortDescription);
      fd.append("longDescription", form.longDescription);
      if (form.client.trim()) fd.append("client", form.client.trim());
      fd.append("category", form.category);
      for (const tech of form.technologies.split(",").map((t) => t.trim()).filter(Boolean)) {
        fd.append("technologies", tech);
      }
      if (form.projectUrl.trim()) fd.append("projectUrl", form.projectUrl.trim());
      if (form.githubUrl.trim()) fd.append("githubUrl", form.githubUrl.trim());
      if (form.completionDate) fd.append("completionDate", form.completionDate);
      fd.append("featured", String(form.featured));
      fd.append("published", String(form.published));
      if (coverImage) fd.append("coverImage", coverImage);

      if (item) {
        await api(`/realisations/${item.id}`, { method: "PATCH", body: fd });
      } else {
        await api("/realisations", { method: "POST", body: fd });
      }

      toast.success(item ? "Réalisation mise à jour" : "Réalisation créée");
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddGalleryImages() {
    if (!item || !galleryFiles || galleryFiles.length === 0) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      for (const file of Array.from(galleryFiles)) fd.append("gallery", file);
      await api(`/realisations/${item.id}/gallery`, { method: "POST", body: fd });
      toast.success("Images ajoutées à la galerie");
      setGalleryFiles(null);
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Échec de l'ajout des images.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Modifier la réalisation" : "Nouvelle réalisation"}</DialogTitle>
          <DialogDescription>
            {item ? "Mettez à jour les informations ci-dessous." : "Renseignez les informations du projet."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Titre *</Label>
            <Input id="title" required value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">Slug (optionnel — généré automatiquement sinon)</Label>
            <Input id="slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="shortDescription">Description courte *</Label>
            <Textarea
              id="shortDescription"
              required
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="longDescription">Description longue *</Label>
            <Textarea
              id="longDescription"
              required
              rows={4}
              value={form.longDescription}
              onChange={(e) => set("longDescription", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="client">Client</Label>
              <Input id="client" value={form.client} onChange={(e) => set("client", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Catégorie *</Label>
              <Input id="category" required value={form.category} onChange={(e) => set("category", e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="technologies">Technologies (séparées par des virgules)</Label>
            <Input
              id="technologies"
              placeholder="Figma, Illustrator, Notion"
              value={form.technologies}
              onChange={(e) => set("technologies", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="projectUrl">Lien du projet</Label>
              <Input id="projectUrl" type="url" value={form.projectUrl} onChange={(e) => set("projectUrl", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="githubUrl">Lien GitHub</Label>
              <Input id="githubUrl" type="url" value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="completionDate">Date de réalisation</Label>
            <Input
              id="completionDate"
              type="date"
              value={form.completionDate}
              onChange={(e) => set("completionDate", e.target.value)}
            />
          </div>

          <ImageUploadField
            label="Image de couverture"
            existingUrl={item?.coverImage}
            onChange={setCoverImage}
            required={!item}
          />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch id="featured" checked={form.featured} onCheckedChange={(v) => set("featured", v)} />
              <Label htmlFor="featured">Mise en avant</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="published" checked={form.published} onCheckedChange={(v) => set("published", v)} />
              <Label htmlFor="published">Publiée</Label>
            </div>
          </div>

          {item && (
            <div className="flex flex-col gap-2 rounded-lg border border-[#111114]/10 p-3">
              <Label>Galerie ({item.gallery.length} image{item.gallery.length !== 1 ? "s" : ""})</Label>
              {item.gallery.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.gallery.map((url) => (
                    // eslint-disable-next-line @next/next/no-img-element -- Cloudinary URL
                    <img key={url} src={url} alt="" className="size-12 rounded-md border border-[#111114]/10 object-cover" />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={(e) => setGalleryFiles(e.target.files)}
                  className="text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!galleryFiles || galleryFiles.length === 0 || isSubmitting}
                  onClick={handleAddGalleryImages}
                >
                  Ajouter à la galerie
                </Button>
              </div>
            </div>
          )}

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
