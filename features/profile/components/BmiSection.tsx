import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from "@/components/ui/collapsible";
import { BmiScale } from "@/features/profile/components/BmiScale";

interface BmiSectionProps {
  weight: number;
  height: number;
}

function getBmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Insuffisance pondérale", color: "text-blue-400" };
  if (bmi < 25)   return { label: "Poids normal", color: "text-green-500" };
  if (bmi < 30)   return { label: "Surpoids", color: "text-yellow-500" };
  return { label: "Obésité", color: "text-red-500" };
}

export function BmiSection({ weight, height }: BmiSectionProps) {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const { label, color } = getBmiCategory(bmi);

  return (
    <div className="rounded-xl border border-border/60 p-4 space-y-4">
      {/* Valeur IMC */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Indice de masse corporelle</p>
          <p className={cn("text-xs mt-0.5", color)}>{label}</p>
        </div>
        <p className={cn("text-3xl font-extrabold tabular-nums", color)}>
          {bmi.toFixed(1)}
        </p>
      </div>

      {/* Échelle */}
      <BmiScale bmi={bmi} />

      {/* Accordéon explicatif */}
      <Collapsible>
        <CollapsibleTrigger className="text-muted-foreground text-xs">
          En savoir plus sur l&apos;IMC
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <div className="pt-3 space-y-3 text-sm text-muted-foreground">
            <p>
              L&apos;<strong className="text-foreground">indice de masse corporelle (IMC)</strong> est
              un indicateur simple calculé à partir du poids et de la taille :
            </p>
            <p className="rounded-md bg-muted/50 px-3 py-2 text-center font-mono text-xs text-foreground">
              IMC = poids (kg) / taille² (m)
            </p>
            <div className="space-y-1.5">
              {[
                { range: "< 18.5", label: "Insuffisance pondérale", color: "bg-blue-400" },
                { range: "18.5 – 24.9", label: "Poids normal", color: "bg-green-500" },
                { range: "25 – 29.9", label: "Surpoids", color: "bg-yellow-500" },
                { range: "≥ 30", label: "Obésité", color: "bg-red-500" },
              ].map((cat) => (
                <div key={cat.range} className="flex items-center gap-2">
                  <span className={cn("inline-block size-2 rounded-full shrink-0", cat.color)} />
                  <span className="text-foreground font-medium w-20 shrink-0">{cat.range}</span>
                  <span>{cat.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs">
              L&apos;IMC est un indicateur de référence mais ne tient pas compte de la composition
              corporelle (masse musculaire, osseuse, etc.).
            </p>
          </div>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  );
}
