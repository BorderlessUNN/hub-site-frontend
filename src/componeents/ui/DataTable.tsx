import type { ReactNode } from "react";

export type Column<T> = {
  header: string;
  // Return a cell node for a given row.
  cell: (row: T) => ReactNode;
};

export default function DataTable<T>({
  columns,
  rows,
  emptyMessage = "No records to display",
  rowKey,
}: {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
  rowKey: (row: T, index: number) => string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
            {columns.map((col) => (
              <th
                key={col.header}
                className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-[#94A3B8]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={rowKey(row, index)}
                className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]"
              >
                {columns.map((col) => (
                  <td key={col.header} className="px-4 py-3 text-[#0F172A]">
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
