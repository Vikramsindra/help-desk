import { useState } from "react";
import { ArrowLeft, LoaderCircle, UserRoundPlus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import FilterDropdown from "../../components/common/FilterDropdown";
import FormField from "../../components/common/FormField";
import PageHeader from "../../components/common/PageHeader";
import PasswordField from "../../components/common/PasswordField";
import { adminService } from "../../services/adminService";

const roles = [
  { value: "agent", label: "Agent" },
  { value: "admin", label: "Administrator" },
];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function CreateStaffPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 3 || form.name.trim().length > 100)
      nextErrors.name = "Name must be between 3 and 100 characters.";
    if (!emailPattern.test(form.email.trim()))
      nextErrors.email = "Enter a valid email address.";
    if (!passwordPattern.test(form.password))
      nextErrors.password =
        "Use 8+ characters with uppercase, lowercase, a number, and a symbol.";
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await adminService.createStaff({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      toast.success(
        `${form.role === "admin" ? "Administrator" : "Agent"} account created.`,
      );
      navigate("/super-admin/staff");
    } catch (error) {
      setServerError(error.message || "Could not create this staff account.");
      toast.error(error.message || "Could not create this staff account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Add staff member"
        description="Create an agent or administrator account. Super-admin access cannot be granted here."
        action={
          <Link
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted hover:bg-mist hover:text-ink"
            to="/super-admin/staff"
          >
            <ArrowLeft size={15} /> Staff
          </Link>
        }
      />
      <form
        className="max-w-2xl space-y-5 rounded-lg border border-line bg-white p-4 shadow-sm sm:p-6"
        onSubmit={handleSubmit}
        noValidate
      >
        {serverError && (
          <p
            className="rounded-md border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800"
            role="alert"
          >
            {serverError}
          </p>
        )}
        <FormField id="staff-name" label="Full name" error={errors.name}>
          <input
            className={`h-11 w-full rounded-md border bg-white px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 ${errors.name ? "border-rose-400" : "border-line"}`}
            id="staff-name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            autoComplete="name"
            maxLength={100}
            required
          />
        </FormField>
        <FormField id="staff-email" label="Email" error={errors.email}>
          <input
            className={`h-11 w-full rounded-md border bg-white px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 ${errors.email ? "border-rose-400" : "border-line"}`}
            id="staff-email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            autoCapitalize="none"
            spellCheck="false"
            required
          />
        </FormField>
        <PasswordField
          id="staff-password"
          label="Temporary password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
          error={errors.password}
          hint="8+ characters, including uppercase, lowercase, a number, and a symbol."
          autoComplete="new-password"
        />
        <FilterDropdown
          label="Role"
          value={form.role}
          options={roles}
          onChange={(role) => updateField("role", role)}
          className="w-full sm:w-72"
        />
        <div className="flex justify-end border-t border-line pt-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <UserRoundPlus size={16} />
            )}
            {submitting ? "Creating" : "Create staff account"}
          </Button>
        </div>
      </form>
    </>
  );
}
