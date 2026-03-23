import React from "react";

interface NeumorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  onClear?: () => void;
}

export function NeumorphicInput({ icon, onClear, className = "", ...props }: NeumorphicInputProps) {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-4 text-neu-muted dark:text-neu-dark-muted pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={`
          w-full bg-neu-bg dark:bg-neu-dark
          rounded-2xl py-3 pr-10
          ${icon ? "pl-11" : "pl-4"}
          shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]
          dark:shadow-[inset_4px_4px_8px_#0a0a0a,inset_-4px_-4px_8px_#2a2a2a]
          text-neu-text dark:text-neu-dark-text
          placeholder:text-neu-muted dark:placeholder:text-neu-dark-muted
          focus:outline-none focus:ring-2 focus:ring-accent/40
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
      {onClear && props.value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 text-neu-muted dark:text-neu-dark-muted hover:text-neu-text transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}
