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
import { RealisationFormDialog } from "./RealisationFormDialog";
import { useApi } from "@/hooks/useApi";
import { ApiError } from "@/lib/apiClient";
import type { Realisation } from "@/lib/types";

export default function AdminRealisationsPage() {
  const api = useApi();
  const [items, setItems] = useState<Realisation[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Realisation | null>(null);

  const load = useCallback(async () => {
    const data = await api<Realisation[]>("/realisations");
    setItems(data);
  }, [api]);

  useEffect(() => {
    api<Realisation[]>("/realisations")
      .then(setItems)
      .catch(() => toast.error("Impossible de charger les réalisations."));
  }, [api]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(item: Realisation) {
    setEditing(item);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      await api(`/realisations/${id}`, { method: "DELETE" });
      toast.success("Réalisation supprimée");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Échec de la suppression.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[Fraunces] text-2xl text-[#111114]">Réalisations</h1>
          <p className="mt-1 text-sm text-[#111114]/50">Gérez vos projets et études de cas.</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon className="size-4" />
          Nouvelle réalisation
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-[#111114]/10 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-[#111114]/40">
                  Aucune réalisation pour le moment.
                </TableCell>
              </TableRow>
            )}
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    <Badge variant={item.published ? "default" : "secondary"}>
                      {item.published ? "Publiée" : "Brouillon"}
                    </Badge>
                    {item.featured && <Badge variant="outline">En avant</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}>
                      <PencilIcon className="size-4" />
                    </Button>
                    <ConfirmDeleteDialog
                      title={`Supprimer « ${item.title} » ?`}
                      onConfirm={() => handleDelete(item.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RealisationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editing}
        onSaved={load}
      />
    </div>
  );
}
