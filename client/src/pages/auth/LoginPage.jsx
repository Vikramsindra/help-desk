import { useState } from "react";
import { ArrowRight, LoaderCircle, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import FormField from "../../components/common/FormField";
import PasswordField from "../../components/common/PasswordField";
import { useAuth } from "../../hooks/useAuth";
import { HOME_BY_ROLE } from "../../lib/constants";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    const normalizedEmail = email.trim();
    if (!emailPattern.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const user = await login(normalizedEmail, password);
      toast.success("Welcome back.");
      navigate(HOME_BY_ROLE[user.role] || "/403", { replace: true });
    } catch (error) {
      setServerError(error.message || "Unable to sign in. Please try again.");
      toast.error(error.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand">
        Welcome back
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
        Sign in
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Use your account email and password to continue.
      </p>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
        {serverError && (
          <div
            className="rounded-md border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800"
            role="alert"
          >
            {serverError}
          </div>
        )}
        <FormField id="login-email" label="Email" error={errors.email}>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={17}
              aria-hidden="true"
            />
            <input
              className={`h-11 w-full rounded-md border bg-white pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15 ${errors.email ? "border-rose-400" : "border-line"}`}
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              required
            />
          </div>
        </FormField>
        <PasswordField
          id="login-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />
        <Button className="w-full" type="submit" disabled={submitting}>
          {submitting ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <ArrowRight size={17} />
          )}
          {submitting ? "Signing in" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New to Helpdesk?{" "}
        <Link
          className="font-semibold text-brand hover:text-brand-dark"
          to="/register"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
