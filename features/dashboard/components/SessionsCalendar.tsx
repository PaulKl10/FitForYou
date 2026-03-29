"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SessionCalendarEntry } from "@/features/dashboard/types";

const WEEKDAYS_LONG = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const WEEKDAYS_SHORT = ["L", "M", "M", "J", "V", "S", "D"];

function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // lundi = 0

  const days: (Date | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

interface SessionsCalendarProps {
  sessions: SessionCalendarEntry[];
}

export function SessionsCalendar({ sessions }: SessionsCalendarProps) {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const sessionsByDate = new Map<string, SessionCalendarEntry[]>();
  for (const s of sessions) {
    const key = toLocalDateKey(new Date(s.date));
    const existing = sessionsByDate.get(key) ?? [];
    sessionsByDate.set(key, [...existing, s]);
  }

  const days = getCalendarDays(year, month);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const monthLabel = new Date(year, month, 1).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const todayKey = toLocalDateKey(today);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  return (
    <Card className="border-border/60 overflow-hidden">
      {/* Header navigation */}
      <div className="flex items-center justify-center gap-2 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          aria-label="Mois précédent"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <h2 className="text-base font-semibold capitalize">{monthLabel}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          aria-label="Mois suivant"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 border-b border-border/60">
        {WEEKDAYS_LONG.map((day, i) => (
          <div
            key={day + i}
            className="py-2 text-center text-xs font-semibold text-muted-foreground"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{WEEKDAYS_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div>
        {weeks.map((week, wi) => (
          <div
            key={wi}
            className={cn(
              "grid grid-cols-7",
              wi < weeks.length - 1 && "border-b border-border/60",
            )}
          >
            {week.map((day, di) => {
              const isLastCol = di === 6;

              if (!day) {
                return (
                  <div
                    key={di}
                    className={cn(
                      "min-h-12 sm:min-h-28 bg-muted/30",
                      !isLastCol && "border-r border-border/60",
                    )}
                  />
                );
              }

              const key = toLocalDateKey(day);
              const daySessions = sessionsByDate.get(key) ?? [];
              const isToday = key === todayKey;

              return (
                <div
                  key={di}
                  className={cn(
                    "min-h-12 sm:min-h-28 p-1 sm:p-1.5 flex flex-col gap-0.5",
                    !isLastCol && "border-r border-border/60",
                    isToday && "bg-primary/5",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-medium size-5 sm:size-6 flex items-center justify-center rounded-full self-start shrink-0",
                      isToday
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-muted-foreground",
                    )}
                  >
                    {day.getDate()}
                  </span>

                  {/* Mobile : points colorés */}
                  {daySessions.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 sm:hidden mt-0.5">
                      {daySessions.slice(0, 3).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => router.push(`/sessions/${s.id}`)}
                          aria-label={s.name ?? "Séance"}
                          className="w-full h-1 rounded-full bg-primary hover:bg-primary/70 transition-colors"
                        />
                      ))}
                    </div>
                  )}

                  {/* Desktop : pills avec nom */}
                  <div className="hidden sm:flex flex-col gap-0.5">
                    {daySessions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => router.push(`/sessions/${s.id}`)}
                        className="w-full text-left text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium truncate hover:bg-primary/30 transition-colors"
                      >
                        {s.name ?? "Séance"}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
}
