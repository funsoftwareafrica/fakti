"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  BellRing,
  CheckCircle2,
  Eye,
  FilePlus2,
  Share2,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  type ClientFakti,
  type Facture,
  type LigneFacture,
  type StatutFacture,
  ENTREPRISE_DEMO,
  formatFCFA,
  formatDate,
  libelleStatut,
  nouvelId,
  numeroFacture,
  TAUX_TVA,
  totalHT,
  totalTTC,
  totalTVA,
} from "@/lib/fakti";

function BadgeStatut({ statut }: { statut: StatutFacture }) {
  const styles: Record<StatutFacture, string> = {
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

/* ═══════════════════════════════════════════════════════
   Aperçu du document (modèle « Classique »)
   ═══════════════════════════════════════════════════════ */
function ApercuFacture({
  facture,
  client,
}: {
  facture: Facture;
  client?: ClientFakti;
}) {
  const { toast } = useToast();

  async function partager() {
    const texte = `FACTURE ${facture.numero} — ${ENTREPRISE_DEMO.nom}\nClient : ${client?.nom ?? "-"}\nTotal TTC : ${formatFCFA(totalTTC(facture.lignes))}\nÉchéance : ${formatDate(facture.dateEcheance)}\n\nPayable par Orange Money ${ENTREPRISE_DEMO.orangeMoney} ou virement (${ENTREPRISE_DEMO.rib}).\n— Facturé avec Fakti`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: facture.numero, text: texte });
        return;
      }
      await navigator.clipboard.writeText(texte);
      toast({
        title: "Texte copié",
        description: "Collez-le dans WhatsApp pour l'envoyer au client.",
      });
    } catch {
      // partage annulé par l'utilisateur : rien à signaler
    }
  }

  return (
    <div className="invoice-sheet rounded-xl border shadow-sm">
      {/* En-tête entreprise */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b p-5">
        <div>
          <p className="text-lg font-extrabold">{ENTREPRISE_DEMO.nom}</p>
          <p className="text-xs text-muted-foreground">{ENTREPRISE_DEMO.activite}</p>
          <p className="mt-1 text-xs text-muted-foreground">{ENTREPRISE_DEMO.adresse}</p>
          <p className="nums text-xs text-muted-foreground">
            {ENTREPRISE_DEMO.telephone} · IF {ENTREPRISE_DEMO.identifiantFiscal}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold tracking-tight text-primary">FACTURE</p>
          <p className="nums text-sm font-semibold">{facture.numero}</p>
          <p className="nums mt-1 text-xs text-muted-foreground">
            Émise le {formatDate(facture.dateEmission)}
          </p>
          <p className="nums text-xs text-muted-foreground">
            Échéance {formatDate(facture.dateEcheance)}
          </p>
        </div>
      </div>

      {/* Client */}
      <div className="p-5 pb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Facturé à
        </p>
        <p className="mt-1 font-semibold">{client?.nom ?? "Client supprimé"}</p>
        {client && (
          <p className="nums text-xs text-muted-foreground">
            {client.telephone}
            {client.ville ? ` · ${client.ville}` : ""}
            {client.identifiantFiscal ? ` · IF ${client.identifiantFiscal}` : ""}
          </p>
        )}
      </div>

      {/* Lignes */}
      <div className="px-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 font-medium">Désignation</th>
              <th className="py-2 text-right font-medium">Qté</th>
              <th className="py-2 text-right font-medium">P.U.</th>
              <th className="py-2 text-right font-medium">Montant</th>
            </tr>
          </thead>
          <tbody className="nums">
            {facture.lignes.map((l) => (
              <tr key={l.id} className="border-b last:border-0">
                <td className="py-2.5 pr-2">{l.designation}</td>
                <td className="py-2.5 text-right">{l.quantite}</td>
                <td className="py-2.5 text-right">{formatFCFA(l.prixUnitaire)}</td>
                <td className="py-2.5 text-right font-semibold">
                  {formatFCFA(l.quantite * l.prixUnitaire)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totaux */}
      <div className="flex justify-end p-5 pb-3">
        <div className="w-full max-w-64 space-y-1.5 text-sm">
          <div className="nums flex justify-between text-muted-foreground">
            <span>Total HT</span>
            <span>{formatFCFA(totalHT(facture.lignes))}</span>
          </div>
          <div className="nums flex justify-between text-muted-foreground">
            <span>TVA {Math.round(TAUX_TVA * 100)} %</span>
            <span>{formatFCFA(totalTVA(facture.lignes))}</span>
          </div>
          <Separator />
          <div className="nums flex justify-between text-base font-extrabold">
            <span>Total TTC</span>
            <span className="text-primary">{formatFCFA(totalTTC(facture.lignes))}</span>
          </div>
        </div>
      </div>

      {/* Comment payer */}
      <div className="mx-5 rounded-lg bg-secondary/70 p-4 text-xs leading-relaxed">
        <p className="font-semibold">Comment payer</p>
        <p className="nums mt-1">
          Orange Money : {ENTREPRISE_DEMO.orangeMoney} · Moov Money : même numéro
        </p>
        <p className="nums">Virement bancaire : {ENTREPRISE_DEMO.rib}</p>
        <p className="mt-1 text-muted-foreground">
          Merci d&apos;indiquer le numéro {facture.numero} en référence du paiement.
        </p>
      </div>

      {/* Mentions + boucle virale */}
      <div className="p-5 pt-4">
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          Facture établie conformément aux usages commerciaux en vigueur dans
          l&apos;UEMOA. Tout retard de paiement donne lieu à relance. Document
          généré électroniquement — valable sans signature.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-2.5">
          <p className="text-xs">
            <span className="font-semibold text-primary">Facturé avec Fakti</span>{" "}
            <span className="text-muted-foreground">
              — créez vos factures gratuitement sur fakti.app
            </span>
          </p>
          <Button size="sm" variant="secondary" onClick={partager}>
            <Share2 className="mr-1 size-3.5" />
            Partager sur WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Vue Factures
   ═══════════════════════════════════════════════════════ */
export function Factures({
  factures,
  setFactures,
  clients,
}: {
  factures: Facture[];
  setFactures: React.Dispatch<React.SetStateAction<Facture[]>>;
  clients: ClientFakti[];
}) {
  const { toast } = useToast();
  const [filtre, setFiltre] = useState<"toutes" | StatutFacture>("toutes");
  const [aperçu, setAperçu] = useState<Facture | null>(null);
  const [création, setCréation] = useState(false);

  // Formulaire de création
  const [clientId, setClientId] = useState<string>("");
  const [lignes, setLignes] = useState<LigneFacture[]>([
    { id: nouvelId("lig"), designation: "", quantite: 1, prixUnitaire: 0 },
  ]);

  const listeFiltrée = useMemo(() => {
    const tri = [...factures].sort(
      (a, b) => +new Date(b.dateEmission) - +new Date(a.dateEmission)
    );
    return filtre === "toutes" ? tri : tri.filter((f) => f.statut === filtre);
  }, [factures, filtre]);

  function ajouterLigne() {
    setLignes((prev) => [
      ...prev,
      { id: nouvelId("lig"), designation: "", quantite: 1, prixUnitaire: 0 },
    ]);
  }

  function majLigne(id: string, champ: keyof LigneFacture, valeur: string | number) {
    setLignes((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [champ]: valeur } : l))
    );
  }

  function créerFacture() {
    const valides = lignes.filter(
      (l) => l.designation.trim() && l.quantite > 0 && l.prixUnitaire > 0
    );
    if (!clientId) {
      toast({
        title: "Client manquant",
        description: "Choisissez le client de la facture.",
        variant: "destructive",
      });
      return;
    }
    if (valides.length === 0) {
      toast({
        title: "Lignes vides",
        description: "Ajoutez au moins une ligne avec désignation, quantité et prix.",
        variant: "destructive",
      });
      return;
    }
    const aujourdhui = new Date();
    const échéance = new Date();
    échéance.setDate(échéance.getDate() + 15);
    const nouvelle: Facture = {
      id: nouvelId("fac"),
      numero: numeroFacture(factures),
      clientId,
      lignes: valides,
      statut: "envoyee",
      dateEmission: aujourdhui.toISOString(),
      dateEcheance: échéance.toISOString(),
    };
    setFactures((prev) => [nouvelle, ...prev]);
    setCréation(false);
    setLignes([{ id: nouvelId("lig"), designation: "", quantite: 1, prixUnitaire: 0 }]);
    setClientId("");
    toast({
      title: "Facture créée",
      description: `${nouvelle.numero} — ${formatFCFA(totalTTC(nouvelle.lignes))}`,
    });
  }

  function marquerPayée(f: Facture) {
    setFactures((prev) =>
      prev.map((x) => (x.id === f.id ? { ...x, statut: "payee" } : x))
    );
    toast({
      title: "Bravo !",
      description: `${f.numero} marquée payée — ${formatFCFA(totalTTC(f.lignes))} encaissés.`,
    });
  }

  function relancer(f: Facture) {
    toast({
      title: "Relance préparée",
      description: `Message de relance pour ${f.numero} copié — envoyez-le sur WhatsApp.`,
    });
  }

  function supprimer(f: Facture) {
    setFactures((prev) => prev.filter((x) => x.id !== f.id));
    toast({ title: "Facture supprimée", description: f.numero });
  }

  const clientDe = (id: string) => clients.find((c) => c.id === id);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Factures</h2>
          <p className="text-sm text-muted-foreground">
            Numérotation continue, TVA {Math.round(TAUX_TVA * 100)} %, montants en FCFA.
          </p>
        </div>
        <Button className="btn-shine" onClick={() => setCréation(true)}>
          <FilePlus2 className="mr-1 size-4" />
          Nouvelle facture
        </Button>
      </div>

      {/* ── Filtres ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {(["toutes", "retard", "envoyee", "payee"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filtre === f ? "default" : "outline"}
            onClick={() => setFiltre(f)}
          >
            {f === "toutes" ? "Toutes" : libelleStatut(f)}
          </Button>
        ))}
      </div>

      {/* ── Liste ───────────────────────────────────────── */}
      {listeFiltrée.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <FilePlus2 className="size-8 text-muted-foreground" />
            <p className="font-medium">Aucune facture ici</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Créez votre première facture : choisissez un client, ajoutez vos
              lignes, la TVA et le total se calculent tout seuls.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {listeFiltrée.map((f) => {
            const client = clientDe(f.clientId);
            const enRetard = f.statut === "retard";
            return (
              <Card key={f.id} className="shadow-sm">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 rounded-lg p-2 ${
                        f.statut === "payee"
                          ? "bg-primary/10"
                          : enRetard
                            ? "bg-destructive/10"
                            : "bg-accent"
                      }`}
                    >
                      {f.statut === "payee" ? (
                        <CheckCircle2 className="size-5 text-primary" />
                      ) : enRetard ? (
                        <BellRing className="size-5 text-destructive" />
                      ) : (
                        <BadgeCheck className="size-5 text-accent-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {client?.nom ?? "Client supprimé"}
                      </p>
                      <p className="nums text-xs text-muted-foreground">
                        {f.numero} · émise {formatDate(f.dateEmission)} · échéance{" "}
                        {formatDate(f.dateEcheance)}
                      </p>
                      <p className="nums mt-1 text-base font-extrabold">
                        {formatFCFA(totalTTC(f.lignes))}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <BadgeStatut statut={f.statut} />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAperçu(f)}
                    >
                      <Eye className="mr-1 size-3.5" />
                      Aperçu
                    </Button>
                    {f.statut !== "payee" && (
                      <>
                        {enRetard && (
                          <Button size="sm" variant="secondary" onClick={() => relancer(f)}>
                            <BellRing className="mr-1 size-3.5" />
                            Relancer
                          </Button>
                        )}
                        <Button size="sm" className="btn-shine" onClick={() => marquerPayée(f)}>
                          <CheckCircle2 className="mr-1 size-3.5" />
                          Payée
                        </Button>
                      </>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => supprimer(f)}
                      aria-label={`Supprimer ${f.numero}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Dialog : nouvelle facture ───────────────────── */}
      <Dialog open={création} onOpenChange={setCréation}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvelle facture</DialogTitle>
            <DialogDescription>
              Le numéro, la TVA {Math.round(TAUX_TVA * 100)} % et le total en
              FCFA se calculent automatiquement.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger aria-label="Choisir le client">
                  <SelectValue placeholder="Choisir un client…" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nom}
                      {c.ville ? ` — ${c.ville}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Lignes de la facture</Label>
                <Button size="sm" variant="outline" onClick={ajouterLigne}>
                  <FilePlus2 className="mr-1 size-3.5" />
                  Ajouter une ligne
                </Button>
              </div>
              {lignes.map((l, idx) => (
                <div key={l.id} className="rounded-xl border p-3">
                  <Input
                    value={l.designation}
                    onChange={(e) => majLigne(l.id, "designation", e.target.value)}
                    placeholder={`Désignation (ligne ${idx + 1})`}
                    className="mb-2"
                    aria-label={`Désignation ligne ${idx + 1}`}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Qté</Label>
                      <Input
                        type="number"
                        min={1}
                        value={l.quantite}
                        onChange={(e) =>
                          majLigne(l.id, "quantite", Math.max(1, Number(e.target.value)))
                        }
                        aria-label={`Quantité ligne ${idx + 1}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">
                        Prix unitaire (FCFA)
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        step={500}
                        value={l.prixUnitaire}
                        onChange={(e) =>
                          majLigne(l.id, "prixUnitaire", Math.max(0, Number(e.target.value)))
                        }
                        aria-label={`Prix unitaire ligne ${idx + 1}`}
                      />
                    </div>
                  </div>
                  <p className="nums mt-2 text-right text-sm font-semibold text-muted-foreground">
                    {formatFCFA(l.quantite * l.prixUnitaire)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totaux live */}
            <div className="rounded-xl bg-secondary/60 p-4">
              <div className="nums flex justify-between text-sm">
                <span className="text-muted-foreground">Total HT</span>
                <span>{formatFCFA(totalHT(lignes))}</span>
              </div>
              <div className="nums flex justify-between text-sm">
                <span className="text-muted-foreground">
                  TVA {Math.round(TAUX_TVA * 100)} %
                </span>
                <span>{formatFCFA(totalTVA(lignes))}</span>
              </div>
              <Separator className="my-2" />
              <div className="nums flex justify-between font-extrabold">
                <span>Total TTC</span>
                <span className="text-primary">{formatFCFA(totalTTC(lignes))}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCréation(false)}>
              Annuler
            </Button>
            <Button className="btn-shine" onClick={créerFacture}>
              Créer la facture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : aperçu du document ─────────────────── */}
      <Dialog open={aperçu !== null} onOpenChange={(o) => !o && setAperçu(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="nums">
              Aperçu — {aperçu?.numero}
            </DialogTitle>
            <DialogDescription>
              C&apos;est exactement le document que votre client recevra.
            </DialogDescription>
          </DialogHeader>
          {aperçu && (
            <ApercuFacture facture={aperçu} client={clientDe(aperçu.clientId)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
