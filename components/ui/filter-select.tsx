import type { ChangeEventHandler } from "react";

type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  name: string;
  defaultValue?: string | string[];
  value?: string | string[];
  multiple?: boolean;
  placeholder: string;
  options: FilterSelectOption[];
  onChange?: ChangeEventHandler<HTMLSelectElement>;
};

export function FilterSelect({
  name,
  defaultValue,
  value,
  multiple = false,
  placeholder,
  options,
  onChange,
}: FilterSelectProps) {
  const baseClassName =
    "flex-1 sm:flex-none rounded-lg border border-input bg-card px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground";

  return (
    <select
      name={name}
      defaultValue={defaultValue ?? ""}
      value={value}
      multiple={multiple}
      onChange={onChange}
      className={multiple ? `h-28 ${baseClassName}` : `h-9 ${baseClassName}`}
    >
      {!multiple && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
