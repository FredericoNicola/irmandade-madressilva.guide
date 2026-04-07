import { FormEvent, useState } from "react";
import { changePassword } from "../api/auth";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ChangePasswordDialog({
  open,
  onClose,
  onSuccess,
}: ChangePasswordDialogProps) {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.oldPassword === form.newPassword) {
      setError("New password must be different from old password");
      return;
    }

    setLoading(true);
    try {
      await changePassword(form.oldPassword, form.newPassword);
      setSuccess(true);
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const axiosError = err as { response?: { data?: { message: string } } };
        setError(
          axiosError?.response?.data?.message || "Failed to change password",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setError("");
    setSuccess(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="relative w-full max-w-md rounded-lg p-6 shadow-lg"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <h2 className="mb-4 font-serif text-2xl" style={{ color: "var(--fg)" }}>
          Change Password
        </h2>

        {success ? (
          <div className="rounded border border-success-200 bg-success-50 px-4 py-3 text-success-700 dark:border-success-800 dark:bg-success-900/20 dark:text-success-300">
            Password changed successfully! 🎉
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700 dark:border-danger-800 dark:bg-danger-900/20 dark:text-danger-300">
                {error}
              </div>
            )}

            <div>
              <label className="label">Current Password *</label>
              <input
                type="password"
                required
                value={form.oldPassword}
                onChange={(e) =>
                  setForm({ ...form, oldPassword: e.target.value })
                }
                className="input"
                placeholder="Enter current password"
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">New Password *</label>
              <input
                type="password"
                required
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                className="input"
                placeholder="At least 8 characters"
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">Confirm New Password *</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="input"
                placeholder="Confirm new password"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary btn-sm flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary btn-sm flex-1"
                disabled={loading}
              >
                {loading ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
