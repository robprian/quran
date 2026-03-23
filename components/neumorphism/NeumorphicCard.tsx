import React from "react";

interface NeumorphicCardProps {
  children: React.ReactNode;
  className?: string;
  pressed?: boolean;
  onClick?: () => void;
  as?: React.ElementType;
}

export function NeumorphicCard({
  children,
  className = "",
  pressed = false,
  onClick,
  as: Tag = "div",
}: NeumorphicCardProps) {
  const base =
    "bg-neu-bg rounded-2xl transition-all duration-300 dark:bg-neu-dark gold:bg-[#1E293B]";
  const shadow = pressed
    ? "shadow-neu-pressed dark:shadow-neu-dark-pressed gold:shadow-[inset_6px_6px_12px_#090e1a,inset_-6px_-6px_12px_rgba(212,175,55,0.15)]"
    : "shadow-neu-flat dark:shadow-neu-dark-flat gold:shadow-[8px_8px_16px_#090e1a,-8px_-8px_16px_rgba(212,175,55,0.15)]";

  return (
    <Tag
      onClick={onClick}
      className={`${base} ${shadow} ${className} ${onClick ? "cursor-pointer" : ""}`}
    >
      {children}
    </Tag>
  );
}
