"use client";
import React from "react";
import clsx from "clsx";

/* ─── Button ─── */
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[#F57C00] text-white hover:bg-[#E65100] active:scale-[0.98] shadow-sm",
    secondary:
      "bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] active:scale-[0.98] shadow-sm",
    ghost:
      "bg-transparent text-[#6B6B6B] hover:bg-[#F3F3F3] hover:text-[#1A1A1A]",
    danger:
      "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:scale-[0.98] shadow-sm",
    outline:
      "bg-transparent border border-[#E8E8E8] text-[#1A1A1A] hover:bg-[#F9F9F9] active:scale-[0.98]",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-[15px]",
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
}

/* ─── Badge ─── */
type BadgeTone =
  | "green"
  | "amber"
  | "red"
  | "blue"
  | "orange"
  | "gray"
  | "dark";

export function Badge({
  tone = "gray",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  const tones: Record<BadgeTone, string> = {
    green: "bg-[#DCFCE7] text-[#15803D]",
    amber: "bg-[#FEF3C7] text-[#B45309]",
    red: "bg-[#FEE2E2] text-[#B91C1C]",
    blue: "bg-[#DBEAFE] text-[#1D4ED8]",
    orange: "bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]",
    gray: "bg-[#F3F3F3] text-[#6B6B6B]",
    dark: "bg-[#1A1A1A] text-white",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ─── Card ─── */
export function Card({
  children,
  className,
  padding = true,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={clsx(
        "bg-white rounded-[14px] border border-[#E8E8E8] shadow-sm",
        padding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── Input ─── */
export function Input({
  label,
  error,
  hint,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#1A1A1A]">{label}</label>
      )}
      <input
        className={clsx(
          "w-full px-3.5 py-2.5 rounded-[10px] border text-sm text-[#1A1A1A] placeholder:text-[#9B9B9B]",
          "outline-none transition-all duration-150",
          "focus:ring-2 focus:ring-[#F57C00]/20 focus:border-[#F57C00]",
          error
            ? "border-[#DC2626] bg-[#FEF2F2]"
            : "border-[#E8E8E8] bg-white hover:border-[#D0D0D0]",
          className
        )}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-[#9B9B9B]">{hint}</p>
      )}
      {error && <p className="text-xs text-[#DC2626]">{error}</p>}
    </div>
  );
}

/* ─── Select ─── */
export function Select({
  label,
  error,
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#1A1A1A]">{label}</label>
      )}
      <select
        className={clsx(
          "w-full px-3.5 py-2.5 rounded-[10px] border text-sm text-[#1A1A1A]",
          "outline-none transition-all duration-150 bg-white",
          "focus:ring-2 focus:ring-[#F57C00]/20 focus:border-[#F57C00]",
          error
            ? "border-[#DC2626]"
            : "border-[#E8E8E8] hover:border-[#D0D0D0]",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[#DC2626]">{error}</p>}
    </div>
  );
}

/* ─── Textarea ─── */
export function Textarea({
  label,
  error,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#1A1A1A]">{label}</label>
      )}
      <textarea
        className={clsx(
          "w-full px-3.5 py-2.5 rounded-[10px] border text-sm text-[#1A1A1A] placeholder:text-[#9B9B9B] resize-none",
          "outline-none transition-all duration-150",
          "focus:ring-2 focus:ring-[#F57C00]/20 focus:border-[#F57C00]",
          error
            ? "border-[#DC2626] bg-[#FEF2F2]"
            : "border-[#E8E8E8] bg-white hover:border-[#D0D0D0]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#DC2626]">{error}</p>}
    </div>
  );
}

/* ─── Stat Card ─── */
export function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: "orange" | "green" | "blue" | "red";
}) {
  const accents = {
    orange: "text-[#F57C00]",
    green: "text-[#16A34A]",
    blue: "text-[#2563EB]",
    red: "text-[#DC2626]",
  };
  return (
    <Card className="flex items-start gap-4">
      {icon && (
        <div className="w-10 h-10 rounded-[10px] bg-[#F3F3F3] flex items-center justify-center text-xl flex-shrink-0">
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs font-medium text-[#9B9B9B] uppercase tracking-wider">
          {label}
        </p>
        <p
          className={clsx(
            "text-2xl font-bold mt-0.5",
            accent ? accents[accent] : "text-[#1A1A1A]"
          )}
        >
          {value}
        </p>
      </div>
    </Card>
  );
}

/* ─── Toast (simple) ─── */
export function Toast({
  message,
  type = "success",
}: {
  message: string;
  type?: "success" | "error";
}) {
  return (
    <div
      className={clsx(
        "fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-[12px] shadow-lg text-sm font-medium",
        type === "success"
          ? "bg-[#1A1A1A] text-white"
          : "bg-[#DC2626] text-white"
      )}
    >
      {type === "success" ? "✓" : "✗"} {message}
    </div>
  );
}
