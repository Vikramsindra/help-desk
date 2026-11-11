export default function LoadingSpinner({
  label = "Loading",
  fullScreen = false,
}) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-sm text-muted ${fullScreen ? "min-h-screen" : "min-h-32"}`}
      role="status"
      aria-live="polite"
    >
      <span className="size-5 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
      <span>{label}</span>
    </div>
  );
}
