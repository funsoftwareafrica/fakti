import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
      <FileQuestion className="size-10 text-primary" aria-hidden />
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-primary">
        Erreur 404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Cette facture s&apos;est perdue en route.
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
        Retournez à votre tableau de bord :
      </p>
      <Button asChild className="mt-8">
        <a href="/">Retour à l&apos;accueil</a>
      </Button>
    </div>
  );
}
