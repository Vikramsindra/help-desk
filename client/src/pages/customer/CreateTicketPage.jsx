import { useState } from "react";
import { ArrowLeft, LoaderCircle, Send } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import FilterDropdown from "../../components/common/FilterDropdown";
import FormField from "../../components/common/FormField";
import PageHeader from "../../components/common/PageHeader";
import { TICKET_PRIORITIES } from "../../lib/constants";
import { ticketService } from "../../services/ticketService";

const priorityOptions = TICKET_PRIORITIES.map((priority) => ({
  value: priority,
  label: priority.charAt(0).toUpperCase() + priority.slice(1),
}));

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
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
    if (!form.title.trim() || form.title.trim().length > 200) {
      nextErrors.title = "Enter a title between 1 and 200 characters.";
    }
    if (!form.description.trim() || form.description.trim().length > 20000) {
      nextErrors.description =
        "Enter a description between 1 and 20,000 characters.";
    }
    if (!form.category.trim() || form.category.trim().length > 100) {
      nextErrors.category = "Enter a category between 1 and 100 characters.";
    }
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const response = await ticketService.create({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        priority: form.priority,
      });
      toast.success("Ticket created.");
      navigate(`/customer/tickets/${response.data._id}`);
    } catch (error) {
      setServerError(error.message || "Could not create your ticket.");
      toast.error(error.message || "Could not create your ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Create a ticket"
        description="Describe what you need help with. You can follow the conversation from your ticket."
        action={
          <Link
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted hover:bg-mist hover:text-ink"
            to="/customer/tickets"
          >
            <ArrowLeft size={15} /> My tickets
          </Link>
        }
      />

      <form
        className="max-w-3xl space-y-5 rounded-lg border border-line bg-white p-4 shadow-sm sm:p-6"
        onSubmit={handleSubmit}
        noValidate
      >
        {serverError && (
          <div
            className="rounded-md border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800"
            role="alert"
          >
            {serverError}
          </div>
        )}
        <FormField id="ticket-title" label="Title" error={errors.title}>
          <input
            className={`h-11 w-full rounded-md border bg-white px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 ${errors.title ? "border-rose-400" : "border-line"}`}
            id="ticket-title"
            name="title"
            type="text"
            maxLength={200}
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "ticket-title-error" : undefined}
            required
          />
        </FormField>
        <FormField
          id="ticket-description"
          label="Description"
          error={errors.description}
          hint="Include any steps or details that could help us understand the issue."
        >
          <textarea
            className={`min-h-40 w-full resize-y rounded-md border bg-white px-3 py-2.5 text-sm leading-6 text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 ${errors.description ? "border-rose-400" : "border-line"}`}
            id="ticket-description"
            name="description"
            maxLength={20000}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description
                ? "ticket-description-error"
                : "ticket-description-hint"
            }
            required
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="ticket-category"
            label="Category"
            error={errors.category}
          >
            <input
              className={`h-11 w-full rounded-md border bg-white px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 ${errors.category ? "border-rose-400" : "border-line"}`}
              id="ticket-category"
              name="category"
              type="text"
              maxLength={100}
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={
                errors.category ? "ticket-category-error" : undefined
              }
              required
            />
          </FormField>
          <FilterDropdown
            label="Priority"
            value={form.priority}
            options={priorityOptions}
            onChange={(priority) => updateField("priority", priority)}
          />
        </div>
        <div className="flex flex-col-reverse justify-end gap-2 border-t border-line pt-4 sm:flex-row">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium text-muted hover:bg-mist hover:text-ink"
            to="/customer/tickets"
          >
            Cancel
          </Link>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
            {submitting ? "Submitting" : "Submit ticket"}
          </Button>
        </div>
      </form>
    </>
  );
}
