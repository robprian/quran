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
    "bg-neu-bg rounded-2xl transition-all duration-300 dark:bg-neu-dark";
  const shadow = pressed
    ? "shadow-neu-pressed dark:shadow-neu-dark-pressed"
    : "shadow-neu-flat dark:shadow-neu-dark-flat";

  return (
    <Tag
      onClick={onClick}
      className={`${base} ${shadow} ${className} ${onClick ? "cursor-pointer" : ""}`}
    >
      {children}
    </Tag>
  );
}
