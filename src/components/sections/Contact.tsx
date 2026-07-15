import { apiRequest } from "@/lib/apiClient";
import type { Contact as ContactData } from "@/lib/types";
import { ContactView } from "./ContactView";

const DEFAULT_WHATSAPP_MESSAGE =
  "Bonjour Kalebia, je souhaite discuter d'une collaboration.";

async function getContact(): Promise<ContactData | null> {
  try {
    return await apiRequest<ContactData>("/contact", { cache: "no-store" });
  } catch {
    return null;
  }
}

function buildWhatsappUrl(whatsapp: string | null): string | null {
  if (!whatsapp) return null;
  const digitsOnly = whatsapp.replace(/[^\d]/g, "");
  if (!digitsOnly) return null;
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;
}

export default async function Contact() {
  const contact = await getContact();

  return (
    <ContactView
      cvUrl={contact?.cvUrl ?? null}
      whatsappUrl={buildWhatsappUrl(contact?.whatsapp ?? null)}
      email={contact?.email || null}
    />
  );
}
