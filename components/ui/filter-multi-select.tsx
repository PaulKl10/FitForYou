"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type FilterMultiSelectOption = {
  value: string;
  label: string;
};

type FilterMultiSelectProps = {
  placeholder: string;
  options: FilterMultiSelectOption[];
  value: string[];
  onChange: (nextValue: string[]) => void;
};

export function FilterMultiSelect({
  placeholder,
  options,
  value,
  onChange,
}: FilterMultiSelectProps) {
  const selected = options.filter((option) => value.includes(option.value));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="h-9 w-full justify-between gap-2 bg-card dark:bg-input font-normal"
          />
        }
      >
        <span className="truncate text-sm">
          {selected.length > 0
            ? `${selected.length} sélectionné(s)`
            : placeholder}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => onChange([])}
          className="text-muted-foreground"
        >
          Tout effacer
        </DropdownMenuItem>
        {options.map((option) => {
          const isChecked = value.includes(option.value);
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isChecked}
              onCheckedChange={(checked) => {
                if (checked) onChange([...value, option.value]);
                else
                  onChange(value.filter((current) => current !== option.value));
              }}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
