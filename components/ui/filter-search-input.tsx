import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { ChangeEventHandler } from "react";

type FilterSearchInputProps = {
  name: string;
  placeholder: string;
  defaultValue?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export function FilterSearchInput({
  name,
  placeholder,
  defaultValue,
  value,
  onChange,
}: FilterSearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        className="pl-9 bg-card h-9 w-full md:w-96"
      />
    </div>
  );
}
