"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import { ApiError } from "@/lib/apiClient";
import type { Contact } from "@/lib/types";

interface FormState {
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  availability: string;
  cvUrl: string;
}

const EMPTY_FORM: FormState = { email: "", phone: "", whatsapp: "", location: "", availability: "", cvUrl: "" };

export default function AdminContactPage() {
  const api = useApi();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api<Contact>("/contact")
      .then((data) =>
        setForm({
          email: data.email,
          phone: data.phone ?? "",
          whatsapp: data.whatsapp ?? "",
          location: data.location ?? "",
          availability: data.availability ?? "",
          cvUrl: data.cvUrl ?? "",
        })
      )
      .catch(() => toast.error("Impossible de charger les informations de contact."))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api("/contact", {
        method: "PATCH",
        body: {
          email: form.email,
          phone: form.phone || undefined,
          whatsapp: form.whatsapp || undefined,
          location: form.location || undefined,
          availability: form.availability || undefined,
          cvUrl: form.cvUrl || undefined,
        },
      });
      toast.success("Informations de contact mises à jour");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-[Fraunces] text-2xl text-[#111114]">Contact</h1>
      <p className="mt-1 text-sm text-[#111114]/50">
        Ces informations sont affichées publiquement sur le site.
      </p>

      <Card className="mt-6">
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-[#111114]/40">Chargement…</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="location">Localisation</Label>
                <Input id="location" value={form.location} onChange={(e) => set("location", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="availability">Disponibilité</Label>
                <Input id="availability" value={form.availability} onChange={(e) => set("availability", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cvUrl">Lien du CV</Label>
                <Input id="cvUrl" type="url" value={form.cvUrl} onChange={(e) => set("cvUrl", e.target.value)} />
              </div>
              <Button type="submit" disabled={isSubmitting} className="mt-1 self-start">
                {isSubmitting ? "Enregistrement…" : "Enregistrer"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
