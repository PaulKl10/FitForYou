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
import type { ExerciseProgressPoint } from "@/features/exercises/types";

interface ExerciseProgressChartProps {
  progress: ExerciseProgressPoint[];
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

export function ExerciseProgressChart({ progress }: ExerciseProgressChartProps) {
  const withWeight = progress.filter((p) => p.maxWeightKg != null);

  if (withWeight.length < 2) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        Fais au moins 2 séances avec du poids pour voir ta progression.
      </p>
    );
  }

  const data = withWeight.map((p) => ({
    date: format(new Date(p.date), "d MMM", { locale: fr }),
    poids: p.maxWeightKg as number,
    session: p.sessionName,
  }));

  const values = data.map((d) => d.poids);
  const min = Math.max(0, Math.floor(Math.min(...values)) - 2);
  const max = Math.ceil(Math.max(...values)) + 2;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
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
          dataKey="poids"
          stroke="var(--color-primary)"
          strokeWidth={2}
          fill="url(#progressGradient)"
          dot={{ r: 3, fill: "var(--color-primary)", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "var(--color-primary)", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
