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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApi } from "@/hooks/useApi";
import { ApiError } from "@/lib/apiClient";
import type { SocialLink } from "@/lib/types";
import { SOCIAL_PLATFORMS, resolveSocialPlatform } from "@/lib/socialPlatforms";

interface FormState {
  platform: string;
  url: string;
  active: boolean;
  order: string;
}

const EMPTY_FORM: FormState = { platform: "", url: "", active: true, order: "0" };

function toFormState(item: SocialLink | null): FormState {
  if (!item) return EMPTY_FORM;
  return {
    platform: item.platform,
    url: item.url,
    active: item.active,
    order: String(item.order),
  };
}

export function SocialLinkFormDialog({
  open,
  onOpenChange,
  item,
  usedPlatformKeys,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SocialLink | null;
  /** Platform keys already attached to another link — excluded from the create picker. */
  usedPlatformKeys: string[];
  onSaved: () => void;
}) {
  const api = useApi();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // See RealisationFormDialog: key-based remount would break the
    // Dialog's close animation, so resetting on open/item change here
    // is the correct trade-off.
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(toFormState(item));
      setError(null);
    }
  }, [open, item]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!item && !form.platform) {
      setError("Choisissez un réseau social.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (item) {
        const body = {
          url: form.url,
          active: form.active,
          order: Number(form.order) || 0,
        };
        await api(`/social-links/${item.id}`, { method: "PATCH", body });
      } else {
        const body = {
          platform: form.platform,
          url: form.url,
          active: form.active,
          order: Number(form.order) || 0,
        };
        await api("/social-links", { method: "POST", body });
      }

      toast.success(item ? "Lien mis à jour" : "Lien créé");
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Modifier le lien" : "Nouveau lien"}</DialogTitle>
          <DialogDescription>
            {item ? "Mettez à jour les informations ci-dessous." : "Ajoutez un nouveau réseau social."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="platform">Plateforme *</Label>
            {item ? (
              <Input id="platform" disabled value={resolveSocialPlatform(item.platform)?.label ?? item.platform} />
            ) : (
              <Select value={form.platform || undefined} onValueChange={(v) => set("platform", v as string)}>
                <SelectTrigger id="platform" className="w-full">
                  <SelectValue placeholder="Choisir un réseau social" />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.filter((p) => !usedPlatformKeys.includes(p.key)).map((p) => (
                    <SelectItem key={p.key} value={p.key}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              required
              placeholder="https://instagram.com/..."
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="order">Ordre d&apos;affichage</Label>
            <Input id="order" type="number" value={form.order} onChange={(e) => set("order", e.target.value)} />
          </div>

          <div className="flex items-center gap-2">
            <Switch id="active" checked={form.active} onCheckedChange={(v) => set("active", v)} />
            <Label htmlFor="active">Actif</Label>
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
