const BMI_MIN = 14;
const BMI_MAX = 40;

const ZONES = [
  { max: 18.5, color: "#60a5fa", label: "< 18.5" },
  { max: 25,   color: "#4ade80", label: "18.5 – 25" },
  { max: 30,   color: "#facc15", label: "25 – 30" },
  { max: BMI_MAX, color: "#f87171", label: "> 30" },
];

interface BmiScaleProps {
  bmi: number;
}

export function BmiScale({ bmi }: BmiScaleProps) {
  const clampedBmi = Math.min(Math.max(bmi, BMI_MIN), BMI_MAX);
  const markerPct = ((clampedBmi - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100;

  return (
    <div className="space-y-3">
      {/* Barre colorée */}
      <div className="relative">
        <div className="flex h-4 w-full overflow-hidden rounded-full">
          {ZONES.map((zone, i) => {
            const start = i === 0 ? BMI_MIN : ZONES[i - 1].max;
            const width = ((zone.max - start) / (BMI_MAX - BMI_MIN)) * 100;
            return (
              <div
                key={zone.label}
                style={{ width: `${width}%`, backgroundColor: zone.color, opacity: 0.8 }}
              />
            );
          })}
        </div>
        {/* Marqueur */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
          style={{ left: `${markerPct}%` }}
        >
          <div className="size-5 rounded-full border-2 border-white bg-foreground shadow-md" />
        </div>
      </div>

      {/* Légende */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {ZONES.map((zone) => (
          <div key={zone.label} className="flex items-center gap-1">
            <span
              className="inline-block size-2 rounded-full"
              style={{ backgroundColor: zone.color }}
            />
            {zone.label}
          </div>
        ))}
      </div>
    </div>
  );
}
