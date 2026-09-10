import { useEffect, useState } from "react";
import HeaderProps from "../../componeents/dashboard/HeaderPros";
import Button from "../../componeents/ui/Button";
import StatusBadge from "../../componeents/ui/StatusBadge";
import DataTable, { type Column } from "../../componeents/ui/DataTable";
import {
  listMembers,
  searchByPhone,
  type SearchedUser,
} from "../../../services/apis/admin";
import { listSubscriptions, type Subscription } from "../../../services/apis/subscription";

export default function Members() {
  const [members, setMembers] = useState<SearchedUser[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [searchResult, setSearchResult] = useState<SearchedUser | null>(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);

  async function refresh(search?: string) {
    setLoading(true);
    setError("");
    try {
      const [membersRes, subsRes] = await Promise.all([
        listMembers(search),
        listSubscriptions(),
      ]);
      setMembers(membersRes.data);
      setSubs(subsRes.data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function latestStatusFor(userId: string): string {
    const mine = subs
      .filter((s) => s.user === userId)
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    return mine[0]?.status ?? "No subscription";
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchError("");
    setSearchResult(null);
    if (!phone.trim()) {
      setSearchError("Enter a phone number.");
      return;
    }
    setSearching(true);
    try {
      const res = await searchByPhone(phone.trim());
      setSearchResult(res.data);
    } catch (err: unknown) {
      setSearchError((err as Error).message);
    } finally {
      setSearching(false);
    }
  }

  const columns: Column<SearchedUser>[] = [
    { header: "Name", cell: (m) => m.user_name },
    { header: "Email", cell: (m) => m.email },
    { header: "Phone", cell: (m) => m.phone_number || "—" },
    { header: "Department", cell: (m) => m.department || "—" },
    {
      header: "Subscription",
      cell: (m) => <StatusBadge status={latestStatusFor(m.id)} />,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <HeaderProps currentPage="Members" />
      <div className="p-6 flex-1 space-y-8">
        {/* Phone search */}
        <form
          onSubmit={handleSearch}
          className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Search by phone number</h2>
          <div className="flex flex-wrap items-end gap-3">
            <label className="block text-sm font-semibold text-[#334155]">
              Phone number
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08012345678"
                className="mt-2 block w-64 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base outline-none transition focus:border-[#FFDD00]"
              />
            </label>
            <Button type="submit" disabled={searching}>
              {searching ? "Searching..." : "Search"}
            </Button>
          </div>
          {searchError ? <p className="mt-3 text-sm text-red-500">{searchError}</p> : null}
          {searchResult ? (
            <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#0F172A]">{searchResult.user_name}</p>
                  <p className="text-sm text-[#64748B]">
                    {searchResult.email} · {searchResult.phone_number}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge label={searchResult.role} tone="neutral" />
                  <StatusBadge status={latestStatusFor(searchResult.id)} />
                </div>
              </div>
            </div>
          ) : null}
        </form>

        {/* Member directory */}
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Community members</h2>
          {error ? (
            <div className="mb-4 rounded-2xl border border-[#FECACA] bg-[#FEE2E2] px-4 py-3 text-sm text-[#991B1B]">
              {error}
            </div>
          ) : null}
          {loading ? (
            <p className="text-sm text-[#64748B]">Loading members...</p>
          ) : (
            <DataTable
              columns={columns}
              rows={members}
              rowKey={(m) => m.id}
              emptyMessage="No community members yet"
            />
          )}
        </div>
      </div>
    </div>
  );
}
