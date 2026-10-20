/* ═══════════════════════════════════════════════════════
   FAKTI — types, formatage FCFA et données de démonstration
   ═══════════════════════════════════════════════════════ */

export type StatutFacture = "brouillon" | "envoyee" | "payee" | "retard";

export interface ClientFakti {
  id: string;
  nom: string;
  telephone: string;
  email?: string;
  ville?: string;
  identifiantFiscal?: string;
}

export interface LigneFacture {
  id: string;
  designation: string;
  quantite: number;
  prixUnitaire: number;
}

export interface Facture {
  id: string;
  numero: string;
  clientId: string;
  lignes: LigneFacture[];
  statut: StatutFacture;
  dateEmission: string; // ISO
  dateEcheance: string; // ISO
}

export const TAUX_TVA = 0.19;

/* ── Formatage ────────────────────────────────────────── */

export function formatFCFA(montant: number): string {
  const n = Math.round(montant); // FCFA : pas de décimales
  const sep = n.toLocaleString("fr-FR").replace(/[\u202F\u00A0]/g, " ");
  return `${sep} FCFA`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function totalHT(lignes: LigneFacture[]): number {
  return lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0);
}

export function totalTVA(lignes: LigneFacture[]): number {
  return totalHT(lignes) * TAUX_TVA;
}

export function totalTTC(lignes: LigneFacture[]): number {
  return totalHT(lignes) + totalTVA(lignes);
}

export function libelleStatut(statut: StatutFacture): string {
  switch (statut) {
    case "brouillon":
      return "Brouillon";
    case "envoyee":
      return "Envoyée";
    case "payee":
      return "Payée";
    case "retard":
      return "En retard";
  }
}

/* ── Identifiants ─────────────────────────────────────── */

let compteur = 0;
export function nouvelId(prefixe: string): string {
  compteur += 1;
  return `${prefixe}-${Date.now()}-${compteur}-${Math.floor(Math.random() * 1000)}`;
}

export function numeroFacture(existantes: Facture[]): string {
  const annee = new Date().getFullYear();
  const suite =
    existantes
      .map((f) => Number(f.numero.split("-")[2] ?? "0"))
      .reduce((m, n) => Math.max(m, n), 0) + 1;
  return `FACT-${annee}-${String(suite).padStart(4, "0")}`;
}

/* ── Entreprise de démonstration (l'utilisateur de l'app) ── */

export const ENTREPRISE_DEMO = {
  nom: "Boutique Kalla & Frères",
  activite: "Électronique & accessoires",
  adresse: "Rue YN-4, Yantala, Niamey",
  telephone: "+227 90 12 34 56",
  identifiantFiscal: "NI-2024-8871",
  rib: "BN-063 01234 5678901234-78",
  orangeMoney: "+227 96 54 32 10",
};

/* ── Données de démonstration ─────────────────────────── */

export const CLIENTS_DEMO: ClientFakti[] = [
  {
    id: "cli-1",
    nom: "Pharmacie Yantala",
    telephone: "+227 90 45 12 88",
    email: "contact@pharmacie-yantala.ne",
    ville: "Niamey",
    identifiantFiscal: "NI-2021-4410",
  },
  {
    id: "cli-2",
    nom: "Garage Tchiney Motors",
    telephone: "+227 98 33 27 40",
    email: "tchiney.motors@gmail.com",
    ville: "Niamey",
    identifiantFiscal: "NI-2019-2077",
  },
  {
    id: "cli-3",
    nom: "Librairie Maman Fati",
    telephone: "+227 91 78 65 23",
    ville: "Zinder",
  },
  {
    id: "cli-4",
    nom: "École Les Palmiers",
    telephone: "+227 96 21 09 77",
    email: "direction@lespalmiers.ne",
    ville: "Niamey",
    identifiantFiscal: "NI-2022-5533",
  },
  {
    id: "cli-5",
    nom: "Restaurant Le Sahel",
    telephone: "+227 89 55 41 12",
    ville: "Maradi",
  },
];

function ilYAParfaisMois(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
}

function dans(nJours: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + nJours);
  return d;
}

export const FACTURES_DEMO: Facture[] = [
  {
    id: "fac-1",
    numero: "FACT-2026-0001",
    clientId: "cli-1",
    lignes: [
      { id: "l1", designation: "Thermomètre digital (lot de 5)", quantite: 2, prixUnitaire: 45000 },
      { id: "l2", designation: "Tensiomètre bras", quantite: 1, prixUnitaire: 78000 },
    ],
    statut: "payee",
    dateEmission: ilYAParfaisMois(5).toISOString(),
    dateEcheance: ilYAParfaisMois(4).toISOString(),
  },
  {
    id: "fac-2",
    numero: "FACT-2026-0002",
    clientId: "cli-2",
    lignes: [
      { id: "l3", designation: "Batterie de secours 2000W", quantite: 1, prixUnitaire: 315000 },
    ],
    statut: "payee",
    dateEmission: ilYAParfaisMois(4).toISOString(),
    dateEcheance: ilYAParfaisMois(3).toISOString(),
  },
  {
    id: "fac-3",
    numero: "FACT-2026-0003",
    clientId: "cli-4",
    lignes: [
      { id: "l4", designation: "Imprimante laser (lot de 2)", quantite: 1, prixUnitaire: 240000 },
      { id: "l5", designation: "Toner noir (lot de 4)", quantite: 2, prixUnitaire: 55000 },
    ],
    statut: "payee",
    dateEmission: ilYAParfaisMois(3).toISOString(),
    dateEcheance: ilYAParfaisMois(2).toISOString(),
  },
  {
    id: "fac-4",
    numero: "FACT-2026-0004",
    clientId: "cli-3",
    lignes: [
      { id: "l6", designation: "Calculatrices scientifiques (lot de 10)", quantite: 3, prixUnitaire: 62000 },
    ],
    statut: "retard",
    dateEmission: ilYAParfaisMois(2).toISOString(),
    dateEcheance: ilYAParfaisMois(1).toISOString(),
  },
  {
    id: "fac-5",
    numero: "FACT-2026-0005",
    clientId: "cli-5",
    lignes: [
      { id: "l7", designation: "Glacière solaire 45L", quantite: 2, prixUnitaire: 185000 },
      { id: "l8", designation: "Installation", quantite: 1, prixUnitaire: 40000 },
    ],
    statut: "retard",
    dateEmission: ilYAParfaisMois(1).toISOString(),
    dateEcheance: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "fac-6",
    numero: "FACT-2026-0006",
    clientId: "cli-1",
    lignes: [
      { id: "l9", designation: "Petit matériel médical (divers)", quantite: 1, prixUnitaire: 320000 },
    ],
    statut: "envoyee",
    dateEmission: new Date(Date.now() - 86400000 * 6).toISOString(),
    dateEcheance: dans(9).toISOString(),
  },
  {
    id: "fac-7",
    numero: "FACT-2026-0007",
    clientId: "cli-2",
    lignes: [
      { id: "l10", designation: "Onduleur 1500VA + batteries", quantite: 1, prixUnitaire: 410000 },
    ],
    statut: "envoyee",
    dateEmission: new Date(Date.now() - 86400000 * 2).toISOString(),
    dateEcheance: dans(13).toISOString(),
  },
];

/* ── Indicateurs du tableau de bord ───────────────────── */

export function indicateurs(factures: Facture[]) {
  const maintenant = new Date();
  const caDuMois = factures
    .filter((f) => {
      const d = new Date(f.dateEmission);
      return (
        f.statut === "payee" &&
        d.getMonth() === maintenant.getMonth() &&
        d.getFullYear() === maintenant.getFullYear()
      );
    })
    .reduce((s, f) => s + totalTTC(f.lignes), 0);

  const impayes = factures
    .filter((f) => f.statut === "envoyee" || f.statut === "retard")
    .reduce((s, f) => s + totalTTC(f.lignes), 0);

  const enRetard = factures.filter((f) => f.statut === "retard").length;

  const encaisseAnnee = factures
    .filter((f) => f.statut === "payee")
    .reduce((s, f) => s + totalTTC(f.lignes), 0);

  return { caDuMois, impayes, enRetard, encaisseAnnee };
}

export function caParMois(factures: Facture[]): { label: string; total: number }[] {
  const moisLabels = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const res: { label: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = ilYAParfaisMois(i);
    const total = factures
      .filter((f) => {
        const e = new Date(f.dateEmission);
        return f.statut === "payee" && e.getMonth() === d.getMonth() && e.getFullYear() === d.getFullYear();
      })
      .reduce((s, f) => s + totalTTC(f.lignes), 0);
    res.push({ label: moisLabels[d.getMonth()], total });
  }
  return res;
}
