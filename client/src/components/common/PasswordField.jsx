import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import FormField from "./FormField";

export default function PasswordField({
  id,
  label = "Password",
  value,
  onChange,
  error,
  hint,
  autoComplete = "current-password",
  required = true,
}) {
  const [visible, setVisible] = useState(false);
  const helperId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        <input
          className={`h-11 w-full rounded-md border bg-white px-3 pr-11 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15 ${error ? "border-rose-400" : "border-line"}`}
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={helperId}
        />
        <button
          className="absolute inset-y-0 right-1 grid w-9 place-items-center rounded text-muted hover:bg-mist hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </FormField>
  );
}
