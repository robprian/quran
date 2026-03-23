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
    flat: "bg-neu-bg shadow-neu-flat dark:bg-neu-dark dark:shadow-neu-dark-flat text-neu-text dark:text-neu-dark-text hover:shadow-neu-pressed dark:hover:shadow-neu-dark-pressed",
    pressed:
      "bg-neu-bg shadow-neu-pressed dark:bg-neu-dark dark:shadow-neu-dark-pressed text-neu-text dark:text-neu-dark-text",
    accent:
      "bg-gradient-to-br from-accent-light to-accent text-white shadow-[4px_4px_10px_rgba(212,175,55,0.4),-4px_-4px_10px_rgba(212,175,55,0.1)] hover:shadow-[2px_2px_6px_rgba(212,175,55,0.4),-2px_-2px_6px_rgba(212,175,55,0.1)]",
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
