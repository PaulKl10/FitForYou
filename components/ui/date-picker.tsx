"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { fr as frDF } from "date-fns/locale";
import { fr } from "react-day-picker/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  id?: string;
  placeholder?: string;
}

export function DatePicker({ value, onChange, id, placeholder }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            className="h-9 w-full justify-between gap-2 bg-card dark:bg-input font-normal"
          />
        }
      >
        <span className="truncate text-sm">
          {value ? format(parseISO(value), "d MMMM yyyy", { locale: frDF }) : placeholder ?? "Sélectionner une date"}
        </span>
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? parseISO(value) : undefined}
          onSelect={(d) => {
            if (d) {
              onChange(format(d, "yyyy-MM-dd"));
              setOpen(false);
            }
          }}
          defaultMonth={value ? parseISO(value) : new Date()}
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  );
}
