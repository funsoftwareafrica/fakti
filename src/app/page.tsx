"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Clients } from "@/components/fakti/clients";
import { Dashboard } from "@/components/fakti/dashboard";
import { Factures } from "@/components/fakti/invoices";
import { Landing } from "@/components/fakti/landing";
import {
  CLIENTS_DEMO,
  FACTURES_DEMO,
  type ClientFakti,
  type Facture,
} from "@/lib/fakti";

type Vue = "accueil" | "tableau-de-bord" | "clients" | "factures";

const ONGLETS: { id: Vue; label: string; icone: typeof LayoutDashboard }[] = [
  { id: "tableau-de-bord", label: "Tableau de bord", icone: LayoutDashboard },
  { id: "clients", label: "Clients", icone: Users },
  { id: "factures", label: "Factures", icone: FileText },
];

export default function Page() {
  const [vue, setVue] = useState<Vue>("accueil");
  const [clients, setClients] = useState<ClientFakti[]>(CLIENTS_DEMO);
  const [factures, setFactures] = useState<Facture[]>(FACTURES_DEMO);

  if (vue === "accueil") {
    return <Landing onStartApp={() => setVue("tableau-de-bord")} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      {/* ── En-tête de l'application ─────────────────────── */}
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/fakti-icon.png"
              alt="Logo Fakti"
              width={34}
              height={34}
              className="rounded-lg"
              priority
            />
            <div className="leading-tight">
              <p className="font-bold text-primary">Fakti</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Boutique Kalla &amp; Frères — démo
              </p>
            </div>
          </div>

          {/* Navigation bureau */}
          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-1 md:flex"
          >
            {ONGLETS.map((o) => (
              <Button
                key={o.id}
                variant={vue === o.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setVue(o.id)}
              >
                <o.icone className="mr-1.5 size-4" />
                {o.label}
              </Button>
            ))}
          </nav>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setVue("accueil")}
          >
            <LogOut className="mr-1 size-4" />
            <span className="hidden sm:inline">Quitter la démo</span>
            <span className="sm:hidden">Sortir</span>
          </Button>
        </div>
      </header>

      {/* ── Navigation mobile (barre d'onglets) ──────────── */}
      <nav
        aria-label="Navigation mobile"
        className="sticky top-16 z-30 border-b bg-background/90 backdrop-blur md:hidden"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-3 px-2">
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              onClick={() => setVue(o.id)}
              aria-current={vue === o.id ? "page" : undefined}
              className={`flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
                vue === o.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <o.icone className="size-4" />
              {o.id === "tableau-de-bord" ? "Bord" : o.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Contenu ──────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:pb-8">
        {vue === "tableau-de-bord" && (
          <Dashboard
            factures={factures}
            clients={clients}
            onVoirFactures={() => setVue("factures")}
          />
        )}
        {vue === "clients" && <Clients clients={clients} setClients={setClients} />}
        {vue === "factures" && (
          <Factures factures={factures} setFactures={setFactures} clients={clients} />
        )}
      </main>

      {/* ── Pied de page collé ───────────────────────────── */}
      <footer className="mt-auto border-t bg-background py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row">
          <p>
            <span className="font-semibold text-foreground">Fakti</span> — maquette
            de démonstration interactive (données fictives)
          </p>
          <p className="nums">Montants en FCFA · TVA 19 % · © 2026</p>
        </div>
      </footer>
    </div>
  );
}
