"use client";

import Select, { MultiValue } from "react-select";
import { CATEGORIES } from "@/lib/categories";

interface CategorySelectProps {
  id?: string;
  value: string[];
  onChange: (categories: string[]) => void;
}

type Option = { value: string; label: string };

const OPTIONS: Option[] = CATEGORIES.map((category) => ({
  value: category,
  label: category,
}));

// A multi-select dropdown restricted to the fixed list in
// lib/categories.ts. Unlike the old free-text comma-separated input,
// there's no way to type in a category that isn't on that list.
export function CategorySelect({ id, value, onChange }: CategorySelectProps) {
  // react-select works with { value, label } objects, but the rest of the
  // app just deals in plain category strings — this converts between the
  // two at the boundary, so nothing outside this component needs to know
  // react-select exists.
  const selected = OPTIONS.filter((option) => value.includes(option.value));

  function handleChange(selectedOptions: MultiValue<Option>) {
    onChange(selectedOptions.map((option) => option.value));
  }

  return (
    <Select<Option, true>
      inputId={id}
      isMulti
      options={OPTIONS}
      value={selected}
      onChange={handleChange}
      placeholder="Select categories..."
      classNamePrefix="category-select"
    />
  );
}
