"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { MailOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { useApi } from "@/hooks/useApi";
import { ApiError } from "@/lib/apiClient";
import type { Message } from "@/lib/types";

export default function AdminMessagesPage() {
  const api = useApi();
  const [items, setItems] = useState<Message[] | null>(null);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = useCallback(async () => {
    const data = await api<Message[]>("/messages");
    setItems(data);
  }, [api]);

  useEffect(() => {
    api<Message[]>("/messages")
      .then(setItems)
      .catch(() => toast.error("Impossible de charger les messages."));
  }, [api]);

  async function openMessage(message: Message) {
    setSelected(message);
    if (!message.read) {
      try {
        await api(`/messages/${message.id}`, { method: "PATCH", body: { read: true } });
        load();
      } catch {
        // Non-critical — the message is still viewable even if the read
        // flag fails to update.
      }
    }
  }

  async function handleDelete(id: string) {
    try {
      await api(`/messages/${id}`, { method: "DELETE" });
      toast.success("Message supprimé");
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Échec de la suppression.");
    }
  }

  return (
    <div>
      <div>
        <h1 className="font-[Fraunces] text-2xl text-[#111114]">Messages</h1>
        <p className="mt-1 text-sm text-[#111114]/50">Messages reçus via le formulaire de contact.</p>
      </div>

      <div className="mt-6 rounded-xl border border-[#111114]/10 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Nom</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Reçu le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-[#111114]/40">
                  Aucun message pour le moment.
                </TableCell>
              </TableRow>
            )}
            {items?.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() => openMessage(item)}
              >
                <TableCell>{!item.read && <span className="block size-2 rounded-full bg-[#C9A24B]" />}</TableCell>
                <TableCell className={item.read ? "text-[#111114]/70" : "font-semibold"}>{item.name}</TableCell>
                <TableCell className={item.read ? "text-[#111114]/50" : "font-medium"}>
                  {item.subject || <span className="italic text-[#111114]/30">Sans sujet</span>}
                </TableCell>
                <TableCell className="text-[#111114]/50">
                  {new Date(item.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <ConfirmDeleteDialog
                    title={`Supprimer le message de « ${item.name} » ?`}
                    onConfirm={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject || "Sans sujet"}</DialogTitle>
                <DialogDescription>
                  De <a href={`mailto:${selected.email}`} className="underline">{selected.name} ({selected.email})</a>
                  {" · "}
                  {new Date(selected.createdAt).toLocaleString("fr-FR")}
                </DialogDescription>
              </DialogHeader>
              <p className="whitespace-pre-wrap text-sm text-[#111114]/80">{selected.message}</p>
              <DialogFooter>
                <Button render={<a href={`mailto:${selected.email}`} />}>
                  <MailOpenIcon className="size-4" />
                  Répondre par email
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
