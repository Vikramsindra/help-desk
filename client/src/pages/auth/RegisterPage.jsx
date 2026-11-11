import { useState } from "react";
import { ArrowRight, LoaderCircle, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import FormField from "../../components/common/FormField";
import PasswordField from "../../components/common/PasswordField";
import { useAuth } from "../../hooks/useAuth";
import { HOME_BY_ROLE } from "../../lib/constants";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if (normalizedName.length < 3 || normalizedName.length > 100) {
      nextErrors.name = "Name must be between 3 and 100 characters.";
    }
    if (!emailPattern.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!passwordPattern.test(password)) {
      nextErrors.password =
        "Use 8+ characters with uppercase, lowercase, a number, and a symbol.";
    }
    if (!confirmation) {
      nextErrors.confirmation = "Confirm your password.";
    } else if (confirmation !== password) {
      nextErrors.confirmation = "Passwords do not match.";
    }

    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const user = await register(normalizedName, normalizedEmail, password);
      toast.success("Your account is ready.");
      navigate(HOME_BY_ROLE[user.role] || "/403", { replace: true });
    } catch (error) {
      setServerError(
        error.message || "Unable to create your account. Please try again.",
      );
      toast.error(error.message || "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand">
        Get started
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
        Create your account
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Create an account to submit and track support requests.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        {serverError && (
          <div
            className="rounded-md border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800"
            role="alert"
          >
            {serverError}
          </div>
        )}
        <FormField id="register-name" label="Full name" error={errors.name}>
          <div className="relative">
            <UserRound
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={17}
              aria-hidden="true"
            />
            <input
              className={`h-11 w-full rounded-md border bg-white pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15 ${errors.name ? "border-rose-400" : "border-line"}`}
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "register-name-error" : undefined}
              required
            />
          </div>
        </FormField>
        <FormField id="register-email" label="Email" error={errors.email}>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={17}
              aria-hidden="true"
            />
            <input
              className={`h-11 w-full rounded-md border bg-white pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15 ${errors.email ? "border-rose-400" : "border-line"}`}
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "register-email-error" : undefined
              }
              required
            />
          </div>
        </FormField>
        <PasswordField
          id="register-password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          hint="8+ characters, including uppercase, lowercase, a number, and a symbol."
          autoComplete="new-password"
        />
        <PasswordField
          id="register-confirm-password"
          label="Confirm password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          error={errors.confirmation}
          autoComplete="new-password"
        />
        <Button className="mt-2 w-full" type="submit" disabled={submitting}>
          {submitting ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <ArrowRight size={17} />
          )}
          {submitting ? "Creating account" : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          className="font-semibold text-brand hover:text-brand-dark"
          to="/login"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
