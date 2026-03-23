import React from "react";

interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "flat" | "pressed" | "accent";
  size?: "sm" | "md" | "lg";
}

export function NeumorphicButton({
  children,
  variant = "flat",
  size = "md",
  className = "",
  ...props
}: NeumorphicButtonProps) {
  const base =
    "rounded-xl font-semibold transition-all duration-200 active:scale-95 focus:outline-none select-none";

  const variants = {
    flat: "bg-neu-bg shadow-neu-flat dark:bg-neu-dark dark:shadow-neu-dark-flat gold:bg-[#1E293B] gold:shadow-[8px_8px_16px_#090e1a,-8px_-8px_16px_rgba(212,175,55,0.15)] text-neu-text dark:text-neu-dark-text hover:shadow-neu-pressed dark:hover:shadow-neu-dark-pressed gold:hover:shadow-[inset_6px_6px_12px_#090e1a,inset_-6px_-6px_12px_rgba(212,175,55,0.15)]",
    pressed:
      "bg-neu-bg shadow-neu-pressed dark:bg-neu-dark dark:shadow-neu-dark-pressed gold:bg-[#1E293B] gold:shadow-[inset_6px_6px_12px_#090e1a,inset_-6px_-6px_12px_rgba(212,175,55,0.15)] text-neu-text dark:text-neu-dark-text",
    accent:
      "bg-gradient-to-br from-accent-light to-accent text-white shadow-[4px_4px_10px_rgba(212,175,55,0.4),-4px_-4px_10px_rgba(212,175,55,0.1)] hover:shadow-[2px_2px_6px_rgba(212,175,55,0.4),-2px_-2px_6px_rgba(212,175,55,0.1)] gold:shadow-[4px_4px_10px_rgba(212,175,55,0.6),-4px_-4px_10px_rgba(212,175,55,0.2)] gold:hover:shadow-[2px_2px_6px_rgba(212,175,55,0.6),-2px_-2px_6px_rgba(212,175,55,0.2)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
