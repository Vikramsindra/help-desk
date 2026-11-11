export default function FormField({ id, label, error, hint, children }) {
  const helperId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-ink" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && (
        <p
          className="text-xs font-medium text-rose-700"
          id={helperId}
          role="alert"
        >
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-muted" id={helperId}>
          {hint}
        </p>
      )}
    </div>
  );
}
