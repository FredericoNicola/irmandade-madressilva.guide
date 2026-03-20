import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
      onClick={onCancel}
    >
      <div
        className="card w-full max-w-sm p-8 animate-slideUp sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p
          id="confirm-title"
          className="mb-6 text-sm leading-relaxed"
          style={{ color: "var(--fg)" }}
        >
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="btn-secondary btn-sm"
          >
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger btn-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
