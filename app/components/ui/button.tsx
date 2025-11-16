import React from "react";

export function Button({
  children,
  className = "",
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
}) {
  const base = "rounded-full px-4 py-2 text-sm font-medium transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-800",
    outline: "border border-gray-500 text-black hover:bg-gray-200",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
