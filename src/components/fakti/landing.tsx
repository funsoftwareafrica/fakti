"use client";

import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  FileText,
  ShieldCheck,
  Smartphone,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ATOUTS = [
  {
    icone: FileText,
    titre: "Factures en FCFA, sans faute",
    texte:
      "TVA paramétrable, montants sans décimales, numérotation continue. Vos documents respectent les usages de la zone UEMOA, du Niger au Cameroun.",
  },
  {
    icone: ArrowRight,
    titre: "Du devis à la facture, en un clic",
    texte:
      "Envoyez un devis, votre client accepte, vous le transformez en facture. Aucune ressaisie, aucune erreur de calcul, zéro perte de temps.",
  },
  {
    icone: BellRing,
    titre: "Les impayés sous contrôle",
    texte:
      "Chaque facture en retard remonte immédiatement. Vous savez qui vous doit quoi, depuis quand, et vous relancez sans gêne, en un appui.",
  },
  {
    icone: WifiOff,
    titre: "Pensé pour nos réseaux",
    texte:
      "Interface légère et rapide même en 3G, conçue d'abord pour le téléphone. Votre activité ne s'arrête pas quand le réseau s'interrompt.",
  },
];

const ETAPES = [
  {
    numero: "01",
    titre: "Créez votre compte",
    texte:
      "30 secondes, juste le nom de votre entreprise. Pas de carte bancaire, pas d'engagement.",
  },
  {
    numero: "02",
    titre: "Ajoutez clients et produits",
    texte:
      "Votre catalogue avec prix en FCFA et taux de TVA. Enregistrez une fois, réutilisez toujours.",
  },
  {
    numero: "03",
    titre: "Facturez et suivez",
    texte:
      "Devis, factures, relances : tout est suivi. Le tableau de bord vous dit où en est votre argent.",
  },
];

const TARIFS = [
  {
    nom: "Gratuit",
    prix: "0 FCFA",
    periode: "pour toujours",
    points: [
      "10 factures ou devis par mois",
      "1 modèle de facture professionnel",
      "Suivi des clients et du catalogue",
      "Tableau de bord essentiel",
    ],
    cta: "Commencer gratuitement",
    misEnAvant: false,
  },
  {
    nom: "Pro",
    prix: "5 000 FCFA",
    periode: "par mois",
    points: [
      "Factures illimitées",
      "3 modèles élégants + votre logo",
      "Relances automatiques",
      "Partage WhatsApp en un appui",
      "Export propre pour votre comptable",
    ],
    cta: "Essayer Pro",
    misEnAvant: true,
  },
];

export function Landing({ onStartApp }: { onStartApp: () => void }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Navigation ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/fakti-icon.png"
              alt="Logo Fakti — document de facturation émeraude"
              width={34}
              height={34}
              className="rounded-lg"
              priority
            />
            <span className="text-xl font-bold tracking-tight text-primary">Fakti</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex"
              onClick={onStartApp}
            >
              Voir la démo
            </Button>
            <Button className="btn-shine" onClick={onStartApp}>
              Essayer gratuitement
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 70% 20%, oklch(0.47 0.105 165 / 0.08), transparent 70%)",
            }}
          />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
            <div className="anim-fade-up">
              <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1">
                <ShieldCheck className="size-3.5" />
                Conçu pour la zone FCFA
              </Badge>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Vos factures,{" "}
                <span className="text-primary">propres et payées</span>{" "}
                à temps.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                Fakti est l&apos;outil de facturation des commerces et PME
                d&apos;Afrique de l&apos;Ouest : devis, factures en FCFA,
                suivi des impayés et relances — sans Excel, sans erreurs,
                sans stress.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="btn-shine" onClick={onStartApp}>
                  Essayer la démo
                  <ArrowRight className="ml-1 size-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={onStartApp}>
                  Créer ma première facture
                </Button>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                <BadgeCheck className="size-4 text-primary" />
                Gratuit jusqu&apos;à 10 factures par mois — sans carte bancaire
              </p>
            </div>
            <div className="anim-fade-up anim-delay-2 relative">
              <div
                aria-hidden
                className="absolute inset-x-8 bottom-2 h-10 rounded-full bg-primary/15 blur-2xl"
              />
              <Image
                src="/fakti-hero.png"
                alt="Illustration 3D : documents de facturation émeraude, calculatrice et pièces dorées"
                width={1344}
                height={768}
                priority
                className="anim-float relative w-full rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* ── Atouts ───────────────────────────────────── */}
        <section className="border-t bg-card/50 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="anim-fade-up text-center text-3xl font-bold tracking-tight md:text-4xl">
              Tout ce qu&apos;un commerce a besoin.{" "}
              <span className="text-primary">Rien de plus.</span>
            </h2>
            <p className="anim-fade-up anim-delay-1 mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              Fakti ne vous noie pas sous les options. Chaque fonction répond
              à une douleur réelle du quotidien : facturer proprement, être
              payé à temps, voir clair dans son argent.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ATOUTS.map((a, i) => (
                <Card
                  key={a.titre}
                  className={`anim-fade-up anim-delay-${i + 1} border shadow-sm transition-shadow hover:shadow-md`}
                >
                  <CardContent className="p-5">
                    <div className="mb-3 inline-flex rounded-xl bg-secondary p-2.5">
                      <a.icone className="size-5 text-primary" />
                    </div>
                    <h3 className="mb-1.5 font-semibold">{a.titre}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {a.texte}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comment ça marche ────────────────────────── */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="anim-fade-up text-center text-3xl font-bold tracking-tight">
              Prêt en 3 étapes
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {ETAPES.map((e) => (
                <div
                  key={e.numero}
                  className="anim-fade-up rounded-2xl border bg-card p-6 shadow-sm"
                >
                  <span className="text-sm font-bold text-primary">{e.numero}</span>
                  <h3 className="mt-2 text-lg font-semibold">{e.titre}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {e.texte}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tarifs ───────────────────────────────────── */}
        <section className="border-t bg-card/50 py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="anim-fade-up text-center text-3xl font-bold tracking-tight">
              Un prix honnête, en FCFA
            </h2>
            <p className="anim-fade-up anim-delay-1 mt-3 text-center text-muted-foreground">
              Payez par Orange Money, Moov Money ou virement. Annulez quand
              vous voulez.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {TARIFS.map((t) => (
                <Card
                  key={t.nom}
                  className={`anim-fade-up relative ${
                    t.misEnAvant
                      ? "border-primary shadow-lg ring-1 ring-primary/30"
                      : "shadow-sm"
                  }`}
                >
                  {t.misEnAvant && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      Recommandé
                    </Badge>
                  )}
                  <CardContent className="p-6">
                    <h3 className="font-semibold">{t.nom}</h3>
                    <p className="mt-2">
                      <span className="nums text-3xl font-extrabold">{t.prix}</span>{" "}
                      <span className="text-sm text-muted-foreground">{t.periode}</span>
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {t.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm">
                          <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`mt-6 w-full ${t.misEnAvant ? "btn-shine" : ""}`}
                      variant={t.misEnAvant ? "default" : "outline"}
                      onClick={onStartApp}
                    >
                      {t.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ────────────────────────────────── */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <div className="anim-fade-up rounded-3xl border bg-card p-10 shadow-sm">
              <Smartphone className="mx-auto size-8 text-primary" />
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                Votre première facture en 30 secondes
              </h2>
              <p className="mt-3 text-muted-foreground">
                Rejoignez les commerces qui facturent proprement et se font
                payer plus vite.
              </p>
              <Button size="lg" className="btn-shine mt-6" onClick={onStartApp}>
                Ouvrir la démo
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Pied de page (collé en bas, repoussé naturellement) ── */}
      <footer className="mt-auto border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/fakti-icon.png"
              alt="Logo Fakti"
              width={22}
              height={22}
              className="rounded-md"
            />
            <span className="font-semibold text-foreground">Fakti</span>
            <span>— Des factures propres, des clients fidèles.</span>
          </div>
          <p className="nums">© 2026 Fakti · Niamey · TVA 19 % intégrée</p>
        </div>
      </footer>
    </div>
  );
}
