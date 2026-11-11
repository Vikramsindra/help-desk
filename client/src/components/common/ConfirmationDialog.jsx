import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm action",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  busy = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="max-w-md"
    >
      <div className="flex gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-700">
          <AlertTriangle size={19} aria-hidden="true" />
        </span>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          className="h-9 rounded-md px-3 text-sm font-medium text-muted hover:bg-mist"
          type="button"
          onClick={onClose}
          disabled={busy}
        >
          Cancel
        </button>
        <button
          className="h-9 rounded-md bg-rose-700 px-3 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-50"
          type="button"
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? "Working…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
