"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Carte avec halo lumineux qui suit le curseur (effet "spotlight",
 * signature des studios premium type Linear / Magic UI).
 *
 * C'est le SEUL composant client du site — tout le reste reste en
 * composants serveur pour des performances maximales.
 * Le halo est dessiné en CSS pur (.spotlight-card dans globals.css) :
 * ce composant se contente de transmettre la position du curseur
 * via les variables CSS --spotlight-x / --spotlight-y.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn("spotlight-card", className)}
    >
      {children}
    </div>
  );
}
