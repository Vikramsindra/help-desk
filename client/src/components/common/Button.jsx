import { cn } from "../../lib/utils";

const variants = {
  primary:
    "bg-brand text-white hover:bg-brand-dark focus-visible:outline-brand",
  secondary:
    "border border-line bg-white text-ink hover:bg-mist focus-visible:outline-brand",
  danger:
    "bg-rose-700 text-white hover:bg-rose-800 focus-visible:outline-rose-700",
  subtle: "text-muted hover:bg-mist hover:text-ink focus-visible:outline-brand",
};

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant] || variants.primary,
        className,
      )}
      type={type}
      {...props}
    />
  );
}
