"use client";

import { useState } from "react";
import { NeumorphicInput } from "@/components/neumorphism";
import { useDebounce } from "@/features/quran/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search surah..." }: SearchBarProps) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 300);

  // When debounced value changes, notify parent
  // We use useEffect equivalent via callback pattern
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    // Immediate update for responsiveness, debounce handled by parent via useDebounce
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <NeumorphicInput
      type="search"
      value={value}
      onChange={handleChange}
      onClear={handleClear}
      placeholder={placeholder}
      icon={<span className="text-base">🔍</span>}
      aria-label="Search surahs"
    />
  );
}
