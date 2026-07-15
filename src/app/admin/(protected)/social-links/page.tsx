"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { PlusIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { SocialLinkFormDialog } from "./SocialLinkFormDialog";
import { useApi } from "@/hooks/useApi";
import { ApiError } from "@/lib/apiClient";
import type { SocialLink } from "@/lib/types";
import { SOCIAL_PLATFORMS, resolveSocialPlatform } from "@/lib/socialPlatforms";

export default function AdminSocialLinksPage() {
  const api = useApi();
  const [items, setItems] = useState<SocialLink[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);

  const load = useCallback(async () => {
    const data = await api<SocialLink[]>("/social-links");
    setItems(data);
  }, [api]);

  useEffect(() => {
    api<SocialLink[]>("/social-links")
      .then(setItems)
      .catch(() => toast.error("Impossible de charger les réseaux sociaux."));
  }, [api]);

  const usedPlatformKeys = (items ?? [])
    .map((i) => resolveSocialPlatform(i.platform)?.key)
    .filter((key): key is string => Boolean(key));
  const allPlatformsConfigured = usedPlatformKeys.length >= SOCIAL_PLATFORMS.length;

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(item: SocialLink) {
    setEditing(item);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      await api(`/social-links/${id}`, { method: "DELETE" });
      toast.success("Lien supprimé");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Échec de la suppression.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[Fraunces] text-2xl text-[#111114]">Réseaux sociaux</h1>
          <p className="mt-1 text-sm text-[#111114]/50">Gérez les liens affichés sur le site.</p>
        </div>
        <Button onClick={openCreate} disabled={allPlatformsConfigured}>
          <PlusIcon className="size-4" />
          {allPlatformsConfigured ? "Tous les réseaux sont configurés" : "Nouveau lien"}
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-[#111114]/10 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordre</TableHead>
              <TableHead>Plateforme</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-[#111114]/40">
                  Aucun lien pour le moment.
                </TableCell>
              </TableRow>
            )}
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.order}</TableCell>
                <TableCell className="font-medium">{item.platform}</TableCell>
                <TableCell className="max-w-[240px] truncate text-[#111114]/50">{item.url}</TableCell>
                <TableCell>
                  <Badge variant={item.active ? "default" : "secondary"}>
                    {item.active ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}>
                      <PencilIcon className="size-4" />
                    </Button>
                    <ConfirmDeleteDialog
                      title={`Supprimer « ${item.platform} » ?`}
                      onConfirm={() => handleDelete(item.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SocialLinkFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editing}
        usedPlatformKeys={usedPlatformKeys.filter((key) => key !== resolveSocialPlatform(editing?.platform ?? "")?.key)}
        onSaved={load}
      />
    </div>
  );
}
