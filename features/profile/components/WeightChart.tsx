"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { WeightEntry } from "@/features/profile/types";

interface WeightChartProps {
  weightHistory: WeightEntry[];
}

interface TooltipPayload {
  value: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-md">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold">{payload[0].value} kg</p>
    </div>
  );
}

export function WeightChart({ weightHistory }: WeightChartProps) {
  if (weightHistory.length < 2) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        Enregistre au moins 2 pesées pour voir l&apos;évolution.
      </p>
    );
  }

  const data = weightHistory.map((entry) => ({
    date: format(new Date(entry.recordedAt), "d MMM", { locale: fr }),
    weight: entry.weight,
  }));

  const weights = data.map((d) => d.weight);
  const min = Math.floor(Math.min(...weights)) - 2;
  const max = Math.ceil(Math.max(...weights)) + 2;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[min, max]}
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="weight"
          stroke="var(--color-primary)"
          strokeWidth={2}
          fill="url(#weightGradient)"
          dot={{ r: 3, fill: "var(--color-primary)", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "var(--color-primary)", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
