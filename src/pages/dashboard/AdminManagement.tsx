import { useEffect, useState } from "react";
import HeaderProps from "../../componeents/dashboard/HeaderPros";
import Button from "../../componeents/ui/Button";
import FormField from "../../componeents/ui/FormField";
import StatusBadge from "../../componeents/ui/StatusBadge";
import DataTable, { type Column } from "../../componeents/ui/DataTable";
import {
  listAdmins,
  createAdmin,
  deactivateAdmin,
  type AdminAccount,
} from "../../../services/apis/admin";

export default function AdminManagement() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"super" | "staff">("staff");

  async function refresh() {
    setLoading(true);
    try {
      const res = await listAdmins();
      setAdmins(res.data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!name || !email || password.length < 8) {
      setError("Enter a name, email and a password of at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await createAdmin({ user_name: name, email, password, admin_role: role });
      setMessage(`Admin "${name}" created.`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("staff");
      refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate(admin: AdminAccount) {
    setError("");
    setMessage("");
    try {
      await deactivateAdmin({ admin_id: admin.id });
      setMessage(`${admin.user_name} deactivated.`);
      refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  }

  const columns: Column<AdminAccount>[] = [
    { header: "Name", cell: (a) => a.user_name },
    { header: "Email", cell: (a) => a.email },
    {
      header: "Role",
      cell: (a) => (
        <StatusBadge
          label={a.admin_role === "super" ? "Super Admin" : "Staff Admin"}
          tone={a.admin_role === "super" ? "active" : "neutral"}
        />
      ),
    },
    {
      header: "Status",
      cell: (a) => (
        <StatusBadge
          label={a.is_active ? "Active" : "Inactive"}
          tone={a.is_active ? "active" : "expired"}
        />
      ),
    },
    {
      header: "Actions",
      cell: (a) =>
        a.is_active ? (
          <button
            onClick={() => handleDeactivate(a)}
            className="text-sm font-semibold text-red-600 hover:underline"
          >
            Deactivate
          </button>
        ) : (
          <span className="text-sm text-[#94A3B8]">—</span>
        ),
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <HeaderProps currentPage="Admins" />
      <div className="p-6 flex-1 space-y-8">
        {error ? (
          <div className="rounded-2xl border border-[#FECACA] bg-[#FEE2E2] px-4 py-3 text-sm text-[#991B1B]">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 text-sm text-[#166534]">
            {message}
          </div>
        ) : null}

        <form
          onSubmit={handleCreate}
          className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Create an admin</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Name" value={name} onChange={setName} required />
            <FormField label="Email" type="email" value={email} onChange={setEmail} required />
            <FormField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              required
            />
            <label className="block text-sm font-semibold text-[#334155]">
              Role
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "super" | "staff")}
                className="mt-2 w-full rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base outline-none transition focus:border-[#FFDD00]"
              >
                <option value="staff">Staff Admin</option>
                <option value="super">Super Admin</option>
              </select>
            </label>
          </div>
          <div className="mt-6">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create admin"}
            </Button>
          </div>
        </form>

        <div>
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Admin accounts</h2>
          {loading ? (
            <p className="text-sm text-[#64748B]">Loading admins...</p>
          ) : (
            <DataTable
              columns={columns}
              rows={admins}
              rowKey={(a) => a.id}
              emptyMessage="No admins found"
            />
          )}
        </div>
      </div>
    </div>
  );
}
