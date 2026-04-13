import { type ChangeEvent, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  rightLabel?: ReactNode;
  suffix?: ReactNode;
}

export default function FormField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  rightLabel,
  suffix,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id} className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wide">
          {label}
        </Label>
        {rightLabel}
      </div>
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className={`bg-stone-50 text-stone-800 placeholder:text-stone-400 focus-visible:ring-orange-300 focus-visible:border-orange-400 ${suffix ? "pr-10" : ""} ${error ? "border-red-400" : ""}`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
