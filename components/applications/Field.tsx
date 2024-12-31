"use client";

interface FieldProps {
  label: string;
  value: string | number | undefined;
}

export function Field({ label, value }: FieldProps) {
  const isEmpty = typeof value === "string" ? value.trim() === "" : !value;
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-600 max-md:text-xs">
        {label}
      </p>
      <p
        className={`md:text-lg ${isEmpty ? "text-gray-400" : "text-gray-900"}`}
      >
        {isEmpty ? "[Empty]" : value}
      </p>
    </div>
  );
}
