"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { PencilIcon, CheckIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { TestimonialFormDialog } from "./TestimonialFormDialog";
import { useApi } from "@/hooks/useApi";
import { ApiError } from "@/lib/apiClient";
import type { Testimonial } from "@/lib/types";

type Filter = "pending" | "published" | "all";

export default function AdminTestimonialsPage() {
  const api = useApi();
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [filter, setFilter] = useState<Filter>("pending");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const load = useCallback(async () => {
    const data = await api<Testimonial[]>("/testimonials");
    setItems(data);
  }, [api]);

  useEffect(() => {
    api<Testimonial[]>("/testimonials")
      .then(setItems)
      .catch(() => toast.error("Impossible de charger les témoignages."));
  }, [api]);

  const filtered = useMemo(() => {
    if (!items) return null;
    if (filter === "pending") return items.filter((t) => !t.published);
    if (filter === "published") return items.filter((t) => t.published);
    return items;
  }, [items, filter]);

  function openEdit(item: Testimonial) {
    setEditing(item);
    setDialogOpen(true);
  }

  async function handleApprove(item: Testimonial) {
    try {
      await api(`/testimonials/${item.id}`, { method: "PATCH", body: { published: true } });
      toast.success("Témoignage approuvé");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Échec de l'approbation.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await api(`/testimonials/${id}`, { method: "DELETE" });
      toast.success("Témoignage supprimé");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Échec de la suppression.");
    }
  }

  return (
    <div>
      <div>
        <h1 className="font-[Fraunces] text-2xl text-[#111114]">Témoignages</h1>
        <p className="mt-1 text-sm text-[#111114]/50">Modérez les avis soumis par vos visiteurs.</p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)} className="mt-4">
        <TabsList>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="published">Publiés</TabsTrigger>
          <TabsTrigger value="all">Tous</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 rounded-xl border border-[#111114]/10 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Commentaire</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-[#111114]/40">
                  Aucun témoignage.
                </TableCell>
              </TableRow>
            )}
            {filtered?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.name}
                  {(item.role || item.company) && (
                    <p className="text-xs font-normal text-[#111114]/40">
                      {[item.role, item.company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-0.5">
                    <StarIcon className="size-3.5 fill-[#C9A24B] text-[#C9A24B]" />
                    {item.rating}
                  </span>
                </TableCell>
                <TableCell className="max-w-[280px] truncate text-[#111114]/60">{item.comment}</TableCell>
                <TableCell>
                  <Badge variant={item.published ? "default" : "secondary"}>
                    {item.published ? "Publié" : "En attente"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {!item.published && (
                      <Button variant="ghost" size="icon-sm" onClick={() => handleApprove(item)} title="Approuver">
                        <CheckIcon className="size-4 text-[#4a7a4a]" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}>
                      <PencilIcon className="size-4" />
                    </Button>
                    <ConfirmDeleteDialog
                      title={`Supprimer le témoignage de « ${item.name} » ?`}
                      onConfirm={() => handleDelete(item.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TestimonialFormDialog open={dialogOpen} onOpenChange={setDialogOpen} item={editing} onSaved={load} />
    </div>
  );
}
