import { useState } from "react";
import { Link } from "react-router";
import {
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Trash2,
  Filter,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import AdminLayout from "./AdminLayout";

type StatusFilter = "all" | "new" | "processing" | "completed" | "cancelled";
type TypeFilter = "all" | "request" | "order";

const statusLabels: Record<string, { label: string; icon: typeof Inbox; color: string; bg: string }> = {
  new: { label: "Новая", icon: Inbox, color: "text-[#00c9a7]", bg: "bg-[#00c9a7]/10" },
  processing: { label: "В работе", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
  completed: { label: "Выполнена", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  cancelled: { label: "Отменена", icon: XCircle, color: "text-red-400", bg: "bg-red-50" },
};

const typeLabels: Record<string, string> = {
  request: "Заявка",
  order: "Заказ",
};

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = trpc.order.list.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
    limit: 100,
    offset: 0,
  });

  const deleteOrder = trpc.order.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const filteredList =
    data?.list.filter((order) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        order.clientName.toLowerCase().includes(q) ||
        order.clientPhone.toLowerCase().includes(q) ||
        order.organization?.toLowerCase().includes(q)
      );
    }) ?? [];

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Всего", value: data?.total ?? 0, color: "#00c9a7" },
            { label: "Новые", value: data?.list.filter((o) => o.status === "new").length ?? 0, color: "#00c9a7" },
            { label: "В работе", value: data?.list.filter((o) => o.status === "processing").length ?? 0, color: "#f59e0b" },
            { label: "Выполнено", value: data?.list.filter((o) => o.status === "completed").length ?? 0, color: "#10b981" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-[#999] mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#bbb]" />
              <input
                type="text"
                placeholder="Поиск по имени, телефону, организации"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#e8e8e8] text-[13px] text-[#333] placeholder:text-[#bbb] focus:outline-none focus:border-[#00c9a7]/40"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#999]" />
              {(["all", "new", "processing", "completed", "cancelled"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    statusFilter === s
                      ? "bg-[#00c9a7] text-white"
                      : "bg-[#f5f5f5] text-[#777] hover:bg-[#00c9a7]/10 hover:text-[#00c9a7]"
                  }`}
                >
                  {s === "all" ? "Все" : statusLabels[s]?.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#999]">Тип:</span>
            {(["all", "request", "order"] as TypeFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  typeFilter === t
                    ? "bg-[#00c9a7]/10 text-[#00c9a7]"
                    : "text-[#777] hover:text-[#00c9a7]"
                }`}
              >
                {t === "all" ? "Все" : typeLabels[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-[#999] text-sm">Загрузка...</div>
          ) : filteredList.length === 0 ? (
            <div className="p-8 text-center text-[#999] text-sm">Нет заказов</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#f0f0f0]">
                    <th className="px-4 py-3 text-[11px] font-semibold text-[#999] uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-[#999] uppercase tracking-wider">Клиент</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-[#999] uppercase tracking-wider">Тип</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-[#999] uppercase tracking-wider">Сумма</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-[#999] uppercase tracking-wider">Статус</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-[#999] uppercase tracking-wider">Дата</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-[#999] uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f0]">
                  {filteredList.map((order) => {
                    const st = statusLabels[order.status];
                    const StatusIcon = st?.icon || Inbox;
                    return (
                      <tr key={order.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="px-4 py-3 text-[13px] text-[#333] font-medium">#{order.id}</td>
                        <td className="px-4 py-3">
                          <div className="text-[13px] text-[#333]">{order.clientName}</div>
                          <div className="text-[11px] text-[#999]">{order.clientPhone}</div>
                          {order.organization && (
                            <div className="text-[11px] text-[#888] mt-0.5">{order.organization}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f5f5f5] text-[#666]">
                            {typeLabels[order.type]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#333] font-medium">
                          {(order.totalPrice ?? 0).toLocaleString("ru-RU")} ₽
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 ${st?.bg} ${st?.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {st?.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[#999]">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("ru-RU")
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#00c9a7]/10 text-[#999] hover:text-[#00c9a7] transition-all"
                              title="Просмотр"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => {
                                if (confirm("Удалить заказ?")) deleteOrder.mutate({ id: order.id });
                              }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-[#999] hover:text-red-400 transition-all"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
