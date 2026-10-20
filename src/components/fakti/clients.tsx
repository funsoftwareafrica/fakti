"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import {
  type ClientFakti,
  nouvelId,
} from "@/lib/fakti";

const CHAMP_VIDE = { nom: "", telephone: "", email: "", ville: "", identifiantFiscal: "" };

export function Clients({
  clients,
  setClients,
}: {
  clients: ClientFakti[];
  setClients: React.Dispatch<React.SetStateAction<ClientFakti[]>>;
}) {
  const { toast } = useToast();
  const [recherche, setRecherche] = useState("");
  const [ouvert, setOuvert] = useState(false);
  const [enEdition, setEnEdition] = useState<ClientFakti | null>(null);
  const [form, setForm] = useState(CHAMP_VIDE);

  const filtres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.nom.toLowerCase().includes(q) ||
        c.ville?.toLowerCase().includes(q) ||
        c.telephone.includes(q)
    );
  }, [clients, recherche]);

  function ouvrirCreation() {
    setEnEdition(null);
    setForm(CHAMP_VIDE);
    setOuvert(true);
  }

  function ouvrirEdition(c: ClientFakti) {
    setEnEdition(c);
    setForm({
      nom: c.nom,
      telephone: c.telephone,
      email: c.email ?? "",
      ville: c.ville ?? "",
      identifiantFiscal: c.identifiantFiscal ?? "",
    });
    setOuvert(true);
  }

  function enregistrer() {
    if (!form.nom.trim() || !form.telephone.trim()) {
      toast({
        title: "Informations manquantes",
        description: "Le nom et le téléphone sont obligatoires.",
        variant: "destructive",
      });
      return;
    }
    if (enEdition) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === enEdition.id ? { ...c, ...form } : c
        )
      );
      toast({ title: "Client modifié", description: form.nom });
    } else {
      const nouveau: ClientFakti = { id: nouvelId("cli"), ...form };
      setClients((prev) => [nouveau, ...prev]);
      toast({ title: "Client ajouté", description: form.nom });
    }
    setOuvert(false);
  }

  function supprimer(c: ClientFakti) {
    setClients((prev) => prev.filter((x) => x.id !== c.id));
    toast({ title: "Client supprimé", description: c.nom });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
          <p className="text-sm text-muted-foreground">
            {clients.length} client{clients.length > 1 ? "s" : ""} enregistré
            {clients.length > 1 ? "s" : ""} — facturez en deux clics.
          </p>
        </div>
        <Button className="btn-shine" onClick={ouvrirCreation}>
          <Plus className="mr-1 size-4" />
          Nouveau client
        </Button>
      </div>

      {/* ── Recherche ───────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un nom, une ville, un téléphone…"
          className="pl-9"
          aria-label="Rechercher un client"
        />
      </div>

      {/* ── Liste ───────────────────────────────────────── */}
      {filtres.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <Users className="size-8 text-muted-foreground" />
            <p className="font-medium">Aucun client trouvé</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Ajoutez vos premiers clients : ils seront proposés
              automatiquement lors de la création de vos factures.
            </p>
            <Button variant="outline" size="sm" className="mt-2" onClick={ouvrirCreation}>
              <Plus className="mr-1 size-4" />
              Ajouter un client
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtres.map((c) => (
            <Card key={c.id} className="shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{c.nom}</p>
                    <p className="nums text-sm text-muted-foreground">{c.telephone}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => ouvrirEdition(c)}
                      aria-label={`Modifier ${c.nom}`}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => supprimer(c)}
                      aria-label={`Supprimer ${c.nom}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  {c.ville && (
                    <span className="rounded-md bg-muted px-2 py-0.5">{c.ville}</span>
                  )}
                  {c.email && (
                    <span className="max-w-full truncate rounded-md bg-muted px-2 py-0.5">
                      {c.email}
                    </span>
                  )}
                  {c.identifiantFiscal && (
                    <span className="nums rounded-md bg-muted px-2 py-0.5">
                      IF {c.identifiantFiscal}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Dialog création / édition ───────────────────── */}
      <Dialog open={ouvert} onOpenChange={setOuvert}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {enEdition ? "Modifier le client" : "Nouveau client"}
            </DialogTitle>
            <DialogDescription>
              Le nom et le téléphone suffisent pour facturer. Le reste est
              optionnel.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="cli-nom">Nom / Raison sociale *</Label>
              <Input
                id="cli-nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                placeholder="Ex. Pharmacie Yantala"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cli-tel">Téléphone *</Label>
              <Input
                id="cli-tel"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                placeholder="+227 90 00 00 00"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="cli-ville">Ville</Label>
                <Input
                  id="cli-ville"
                  value={form.ville}
                  onChange={(e) => setForm({ ...form, ville: e.target.value })}
                  placeholder="Niamey"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="cli-if">Identifiant fiscal</Label>
                <Input
                  id="cli-if"
                  value={form.identifiantFiscal}
                  onChange={(e) =>
                    setForm({ ...form, identifiantFiscal: e.target.value })
                  }
                  placeholder="NI-…"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cli-email">Email (optionnel)</Label>
              <Input
                id="cli-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="client@exemple.ne"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOuvert(false)}>
              Annuler
            </Button>
            <Button onClick={enregistrer}>
              {enEdition ? "Enregistrer" : "Ajouter le client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
