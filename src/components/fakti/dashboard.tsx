"use client";

import Image from "next/image";
import {
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  Clock3,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ClientFakti,
  type Facture,
  caParMois,
  formatFCFA,
  formatDate,
  indicateurs,
  libelleStatut,
  totalTTC,
} from "@/lib/fakti";

function BadgeStatut({ statut }: { statut: Facture["statut"] }) {
  const styles: Record<Facture["statut"], string> = {
    payee: "bg-primary/10 text-primary border-primary/25",
    envoyee: "bg-accent text-accent-foreground border-accent",
    retard: "bg-destructive/10 text-destructive border-destructive/30",
    brouillon: "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge variant="outline" className={`${styles[statut]} border`}>
      {libelleStatut(statut)}
    </Badge>
  );
}

export function Dashboard({
  factures,
  clients,
  onVoirFactures,
}: {
  factures: Facture[];
  clients: ClientFakti[];
  onVoirFactures: () => void;
}) {
  const { caDuMois, impayes, enRetard, encaisseAnnee } = indicateurs(factures);
  const serie = caParMois(factures);
  const max = Math.max(...serie.map((s) => s.total), 1);
  const recentes = [...factures]
    .sort((a, b) => +new Date(b.dateEmission) - +new Date(a.dateEmission))
    .slice(0, 5);

  const kpis = [
    {
      titre: "Encaissé cette année",
      valeur: formatFCFA(encaisseAnnee),
      icone: Banknote,
      note: "Toutes les factures payées",
    },
    {
      titre: "CA du mois (payé)",
      valeur: formatFCFA(caDuMois),
      icone: TrendingUp,
      note: "Factures payées ce mois-ci",
    },
    {
      titre: "Impayés en cours",
      valeur: formatFCFA(impayes),
      icone: Clock3,
      note: "Envoyées et en attente",
    },
    {
      titre: "Factures en retard",
      valeur: String(enRetard),
      icone: AlertTriangle,
      note: "À relancer dès aujourd'hui",
      alerte: enRetard > 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground">
          Bonjour ! Voici où en est votre argent aujourd&apos;hui.
        </p>
      </div>

      {/* ── Indicateurs clés ─────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.titre} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                  {k.titre}
                </p>
                <k.icone
                  className={`size-4 ${k.alerte ? "text-destructive" : "text-primary"}`}
                />
              </div>
              <p
                className={`nums mt-2 text-lg font-extrabold leading-tight sm:text-xl ${
                  k.alerte ? "text-destructive" : ""
                }`}
              >
                {k.valeur}
              </p>
              <p className="mt-1 hidden text-xs text-muted-foreground sm:block">
                {k.note}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* ── Graphique 6 mois ───────────────────────────── */}
        <Card className="shadow-sm lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Encaissements des 6 derniers mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 gap-2 sm:gap-4">
              {serie.map((s, i) => (
                <div
                  key={s.label + i}
                  className="flex h-full min-w-0 flex-1 flex-col items-center gap-1.5"
                >
                  <span className="nums text-[10px] font-semibold text-muted-foreground sm:text-xs">
                    {s.total > 0 ? formatFCFA(s.total).replace(" FCFA", "") : "—"}
                  </span>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="bar-grow w-full rounded-t-md bg-primary/85 transition-colors hover:bg-primary"
                      style={{
                        height: `${Math.max((s.total / max) * 100, 3)}%`,
                        animationDelay: `${i * 90}ms`,
                      }}
                      role="img"
                      aria-label={`${s.label} : ${formatFCFA(s.total)}`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Montants TTC en FCFA — factures payées uniquement
            </p>
          </CardContent>
        </Card>

        {/* ── Factures récentes ──────────────────────────── */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Dernières factures</CardTitle>
            <Button variant="ghost" size="sm" onClick={onVoirFactures}>
              Tout voir
              <ArrowUpRight className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentes.map((f) => {
              const client = clients.find((c) => c.id === f.clientId);
              return (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-3 rounded-xl border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {client?.nom ?? "Client supprimé"}
                    </p>
                    <p className="nums text-xs text-muted-foreground">
                      {f.numero} · {formatDate(f.dateEmission)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="nums text-sm font-bold">
                      {formatFCFA(totalTTC(f.lignes))}
                    </p>
                    <BadgeStatut statut={f.statut} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* ── Relance du jour (conseil business) ──────────── */}
      {enRetard > 0 && (
        <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
          <CardContent className="flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-semibold">
                  {enRetard} facture{enRetard > 1 ? "s" : ""} en retard à relancer
                </p>
                <p className="text-sm text-muted-foreground">
                  Une relance polie aujourd&apos;hui peut débloquer{" "}
                  <span className="nums font-semibold text-destructive">
                    {formatFCFA(impayes * 0.6)}
                  </span>{" "}
                  cette semaine.
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={onVoirFactures}>
              Voir et relancer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Astuce empty-state visuel pour le SaaS final */}
      <div className="hidden items-center gap-4 rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
        <Image
          src="/fakti-empty.png"
          alt=""
          width={56}
          height={56}
          className="rounded-xl"
        />
        Astuce : dans la version finale, un nouveau commerçant verrait ici un
        accueil guidé « Créez votre première facture en 30 secondes ».
      </div>
    </div>
  );
}
