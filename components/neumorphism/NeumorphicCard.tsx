import React from "react";

interface NeumorphicCardProps {
  children: React.ReactNode;
  className?: string;
  pressed?: boolean;
  onClick?: () => void;
  as?: keyof JSX.IntrinsicElements;
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
    // @ts-expect-error dynamic tag
    <Tag
      onClick={onClick}
      className={`${base} ${shadow} ${className} ${onClick ? "cursor-pointer" : ""}`}
    >
      {children}
    </Tag>
  );
}
