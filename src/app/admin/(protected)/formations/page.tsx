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
import { FormationFormDialog } from "./FormationFormDialog";
import { useApi } from "@/hooks/useApi";
import { ApiError } from "@/lib/apiClient";
import type { Formation } from "@/lib/types";

export default function AdminFormationsPage() {
  const api = useApi();
  const [items, setItems] = useState<Formation[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Formation | null>(null);

  const load = useCallback(async () => {
    const data = await api<Formation[]>("/formations");
    setItems(data);
  }, [api]);

  useEffect(() => {
    api<Formation[]>("/formations")
      .then(setItems)
      .catch(() => toast.error("Impossible de charger les formations."));
  }, [api]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(item: Formation) {
    setEditing(item);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      await api(`/formations/${id}`, { method: "DELETE" });
      toast.success("Formation supprimée");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Échec de la suppression.");
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[Fraunces] text-2xl text-[#111114]">Formations</h1>
          <p className="mt-1 text-sm text-[#111114]/50">Gérez vos formations proposées.</p>
        </div>
        <Button onClick={openCreate} className="self-start sm:self-auto">
          <PlusIcon className="size-4" />
          Nouvelle formation
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-[#111114]/10 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-[#111114]/40">
                  Aucune formation pour le moment.
                </TableCell>
              </TableRow>
            )}
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>{Number(item.price).toFixed(2)} €</TableCell>
                <TableCell>
                  <Badge variant={item.published ? "default" : "secondary"}>
                    {item.published ? "Publiée" : "Brouillon"}
                  </Badge>
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

      <FormationFormDialog open={dialogOpen} onOpenChange={setDialogOpen} item={editing} onSaved={load} />
    </div>
  );
}
