"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Realisation, Formation, SocialLink, Testimonial, Message } from "@/lib/types";

interface Stats {
  realisations: number;
  formations: number;
  socialLinks: number;
  testimonialsPending: number;
  messagesUnread: number;
}

export default function AdminDashboardPage() {
  const api = useApi();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [realisations, formations, socialLinks, testimonials, messages] = await Promise.all([
        api<Realisation[]>("/realisations"),
        api<Formation[]>("/formations"),
        api<SocialLink[]>("/social-links"),
        api<Testimonial[]>("/testimonials"),
        api<Message[]>("/messages"),
      ]);

      if (cancelled) return;
      setStats({
        realisations: realisations.length,
        formations: formations.length,
        socialLinks: socialLinks.length,
        testimonialsPending: testimonials.filter((t) => !t.published).length,
        messagesUnread: messages.filter((m) => !m.read).length,
      });
    }

    load().catch(() => setStats(null));
    return () => {
      cancelled = true;
    };
  }, [api]);

  const cards = [
    { label: "Réalisations", value: stats?.realisations, href: "/admin/realisations" },
    { label: "Formations", value: stats?.formations, href: "/admin/formations" },
    { label: "Réseaux sociaux", value: stats?.socialLinks, href: "/admin/social-links" },
    { label: "Témoignages en attente", value: stats?.testimonialsPending, href: "/admin/testimonials" },
    { label: "Messages non lus", value: stats?.messagesUnread, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-[Fraunces] text-2xl text-[#111114]">Tableau de bord</h1>
      <p className="mt-1 text-sm text-[#111114]/50">Vue d&apos;ensemble de votre contenu.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-shadow hover:shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#111114]/60">{card.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-[Fraunces] text-3xl text-[#111114]">
                  {card.value ?? "…"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
