"use client";

import { useEffect, useState } from "react";
import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboardIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  ContactIcon,
  Share2Icon,
  QuoteIcon,
  MailIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";

const NAV_ITEMS: { href: string; label: string; icon: typeof LayoutDashboardIcon }[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboardIcon },
  { href: "/admin/realisations", label: "Réalisations", icon: BriefcaseIcon },
  { href: "/admin/formations", label: "Formations", icon: GraduationCapIcon },
  { href: "/admin/contact", label: "Contact", icon: ContactIcon },
  { href: "/admin/social-links", label: "Réseaux sociaux", icon: Share2Icon },
  { href: "/admin/testimonials", label: "Témoignages", icon: QuoteIcon },
  { href: "/admin/messages", label: "Messages", icon: MailIcon },
];

function NavLink({
  href,
  label,
  icon: Icon,
  onNavigate,
}: {
  href: LinkProps["href"];
  label: string;
  icon: typeof LayoutDashboardIcon;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href.toString());

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-[#111114] text-[#FAFAF7]"
          : "text-[#111114]/60 hover:bg-[#111114]/5 hover:text-[#111114]"
      }`}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { admin, isLoading, logout } = useAuth();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !admin) {
      router.replace("/admin/login");
    }
  }, [isLoading, admin, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] text-sm text-[#111114]/50">
        Chargement…
      </div>
    );
  }

  if (!admin) {
    // Redirect effect is in-flight — render nothing to avoid a content flash.
    return null;
  }

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAF7]">
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 -translate-x-full flex-col border-r border-[#111114]/10 bg-[#FAFAF7] p-4 transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : ""
        }`}
      >
        <div className="mb-6 flex items-center justify-between gap-2 px-1">
          <div className="min-w-0">
            <p className="font-[Fraunces] text-sm tracking-tight">
              Kalebia <span className="text-[#C9A24B]">Admin</span>
            </p>
            <p className="mt-0.5 truncate text-xs text-[#111114]/40">{admin.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Fermer le menu"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} onNavigate={() => setMobileNavOpen(false)} />
          ))}
        </nav>
        <Button variant="ghost" className="justify-start gap-2.5 text-[#111114]/60" onClick={handleLogout}>
          <LogOutIcon className="size-4" />
          Déconnexion
        </Button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[#111114]/10 p-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <MenuIcon className="size-4" />
          </Button>
          <p className="font-[Fraunces] text-sm tracking-tight">
            Kalebia <span className="text-[#C9A24B]">Admin</span>
          </p>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
