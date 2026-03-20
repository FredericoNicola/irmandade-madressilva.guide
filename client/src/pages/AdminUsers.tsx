import { useEffect, useState, FormEvent } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/users";
import { User } from "../types";
import ConfirmDialog from "../components/ConfirmDialog";
import LoadingScreen from "../components/LoadingScreen";

interface UserForm {
  email: string;
  name: string;
  password: string;
  role: string;
}

const emptyForm: UserForm = { email: "", name: "", password: "", role: "USER" };

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchUsers = () => {
    getUsers()
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      email: user.email,
      name: user.name,
      password: "",
      role: user.role,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editingUser) {
        const data: Partial<UserForm> = {
          name: form.name,
          email: form.email,
          role: form.role,
        };
        if (form.password) data.password = form.password;
        await updateUser(editingUser.id, data);
      } else {
        await createUser(form);
      }
      setShowForm(false);
      fetchUsers();
    } catch {
      setError("Failed to save user. Email might already be in use.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    await deleteUser(confirmDeleteId);
    setUsers((prev) => prev.filter((u) => u.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div
        className="mb-10 flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <p
            className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--fg-muted)" }}
          >
            Administration
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl"
            style={{ color: "var(--fg)" }}
          >
            User Management
          </h1>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary btn-md self-start sm:self-auto"
        >
          + Add User
        </button>
      </div>

      {showForm && (
        <div className="card mb-6 border-surface-200 p-6 dark:border-surface-700">
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
            {editingUser ? "Edit User" : "New User"}
          </h2>
          {error && (
            <div className="mb-4 rounded-lg bg-danger-50 px-4 py-2 text-sm text-danger-700 dark:bg-danger-900/20 dark:text-danger-300">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label mb-1">Name *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="label mb-1">Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="label mb-1">
                  Password {editingUser ? "(leave blank to keep current)" : "*"}
                </label>
                <input
                  required={!editingUser}
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="input w-full"
                />
              </div>
              <div>
                <label className="label mb-1">Role *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="input w-full"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary btn-md"
              >
                {saving
                  ? "Saving…"
                  : editingUser
                    ? "Update User"
                    : "Create User"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary btn-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="card overflow-x-auto border-surface-200 dark:border-surface-700">
          <table className="w-full min-w-[560px] text-sm">
            <thead
              style={{
                borderBottom: "1px solid var(--border)",
                backgroundColor: "var(--bg-soft)",
              }}
            >
              <tr>
                <th
                  className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "var(--fg-muted)" }}
                >
                  Name
                </th>
                <th className="px-5 py-4 text-left font-medium text-surface-600 dark:text-surface-400">
                  Email
                </th>
                <th className="px-5 py-4 text-left font-medium text-surface-600 dark:text-surface-400">
                  Role
                </th>
                <th className="px-5 py-4 text-left font-medium text-surface-600 dark:text-surface-400">
                  Created
                </th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td
                    className="px-5 py-4 font-medium"
                    style={{ color: "var(--fg)" }}
                  >
                    {u.name}
                  </td>
                  <td
                    className="px-5 py-4"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    {u.email}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={u.role === "ADMIN" ? "badge-brand" : "badge"}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-surface-400 dark:text-surface-600">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(u)}
                        className="btn-secondary btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(u.id)}
                        className="btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="py-8 text-center text-surface-400 dark:text-surface-600">
              No users found.
            </p>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
