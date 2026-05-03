import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Hash,
  Calendar,
  FileText,
  Package,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import AdminLayout from "./AdminLayout";

const statusConfig: Record<string, { label: string; icon: typeof Inbox; color: string; bg: string; next?: string }> = {
  new: { label: "Новая", icon: Inbox, color: "text-[#00c9a7]", bg: "bg-[#00c9a7]/10", next: "processing" },
  processing: { label: "В работе", icon: Clock, color: "text-amber-500", bg: "bg-amber-50", next: "completed" },
  completed: { label: "Выполнена", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  cancelled: { label: "Отменена", icon: XCircle, color: "text-red-400", bg: "bg-red-50" },
};

const typeLabels: Record<string, string> = {
  request: "Заявка",
  order: "Заказ",
};

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = Number(id);

  const { data: order, isLoading } = trpc.order.getById.useQuery(
    { id: orderId },
    { enabled: !isNaN(orderId) }
  );

  const utils = trpc.useUtils();

  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      utils.order.getById.invalidate({ id: orderId });
      utils.order.list.invalidate();
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-[#999]">Загрузка...</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-[#999]">Заказ не найден</div>
      </AdminLayout>
    );
  }

  const st = statusConfig[order.status];
  const StatusIcon = st?.icon || Inbox;

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/orders")}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f5f5f5] text-[#999] hover:text-[#333] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-[15px] font-semibold text-[#222]">
              {typeLabels[order.type]} #{order.id}
            </h2>
            <div className="text-[11px] text-[#999]">
              Создан {order.createdAt ? new Date(order.createdAt).toLocaleString("ru-RU") : "—"}
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="bg-white rounded-xl p-5 border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-lg text-[13px] font-medium flex items-center gap-1.5 ${st?.bg} ${st?.color}`}>
                <StatusIcon className="w-4 h-4" />
                {st?.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {order.status !== "completed" && order.status !== "cancelled" && (
                <button
                  onClick={() =>
                    updateStatus.mutate({ id: order.id, status: st?.next as "processing" | "completed" })
                  }
                  className="px-4 py-2 rounded-lg bg-[#00c9a7] text-white text-[12px] font-medium hover:bg-[#00b5a0] transition-colors"
                >
                  {st?.next === "processing" ? "Взять в работу" : "Завершить"}
                </button>
              )}
              {order.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus.mutate({ id: order.id, status: "cancelled" })}
                  className="px-4 py-2 rounded-lg border border-[#e5e5e5] text-[#999] text-[12px] font-medium hover:border-red-200 hover:text-red-400 transition-colors"
                >
                  Отменить
                </button>
              )}
              {order.status === "cancelled" && (
                <button
                  onClick={() => updateStatus.mutate({ id: order.id, status: "new" })}
                  className="px-4 py-2 rounded-lg border border-[#e5e5e5] text-[#999] text-[12px] font-medium hover:border-[#00c9a7] hover:text-[#00c9a7] transition-colors"
                >
                  Восстановить
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Client info */}
          <div className="bg-white rounded-xl p-5 border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <h3 className="text-[13px] font-semibold text-[#222] mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#00c9a7]" />
              Информация о клиенте
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00c9a7]/8 flex items-center justify-center flex-shrink-0">
                  <span className="text-[13px] font-semibold text-[#00c9a7]">{order.clientName.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-[13px] font-medium text-[#333]">{order.clientName}</div>
                  {order.organization && (
                    <div className="text-[11px] text-[#888] mt-0.5">{order.organization}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[12px]">
                <Phone className="w-3.5 h-3.5 text-[#999]" />
                <span className="text-[#333]">{order.clientPhone}</span>
              </div>

              {order.clientEmail && (
                <div className="flex items-center gap-3 text-[12px]">
                  <Mail className="w-3.5 h-3.5 text-[#999]" />
                  <span className="text-[#333]">{order.clientEmail}</span>
                </div>
              )}

              {order.inn && (
                <div className="flex items-center gap-3 text-[12px]">
                  <Hash className="w-3.5 h-3.5 text-[#999]" />
                  <span className="text-[#333]">ИНН: {order.inn}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-[12px]">
                <Calendar className="w-3.5 h-3.5 text-[#999]" />
                <span className="text-[#999]">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString("ru-RU") : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-xl p-5 border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <h3 className="text-[13px] font-semibold text-[#222] mb-4">Сводка</h3>
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#999]">Тип</span>
                <span className="text-[#333] font-medium">{typeLabels[order.type]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#999]">Позиций</span>
                <span className="text-[#333] font-medium">{order.items?.length ?? 0}</span>
              </div>
              <div className="border-t border-[#f0f0f0] pt-2 mt-2" />
              <div className="flex justify-between">
                <span className="text-[#333] font-medium">Итого</span>
                <span className="text-[#00c9a7] font-semibold text-[14px]">
                  {(order.totalPrice ?? 0).toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        {order.items && order.items.length > 0 && (
          <div className="bg-white rounded-xl border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#f0f0f0]">
              <h3 className="text-[13px] font-semibold text-[#222] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00c9a7]" />
                Позиции заказа
              </h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#f0f0f0]">
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-[#999] uppercase">Услуга</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-[#999] uppercase text-right">Цена</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-[#999] uppercase text-right">Кол-во</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-[#999] uppercase text-right">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-3 text-[13px] text-[#333]">{item.serviceName}</td>
                    <td className="px-5 py-3 text-[13px] text-[#666] text-right">
                      {(item.price ?? 0).toLocaleString("ru-RU")} ₽
                    </td>
                    <td className="px-5 py-3 text-[13px] text-[#666] text-right">{item.quantity}</td>
                    <td className="px-5 py-3 text-[13px] text-[#333] font-medium text-right">
                      {((item.price ?? 0) * item.quantity).toLocaleString("ru-RU")} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Comment */}
        {order.comment && (
          <div className="bg-white rounded-xl p-5 border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <h3 className="text-[13px] font-semibold text-[#222] mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#999]" />
              Комментарий
            </h3>
            <p className="text-[13px] text-[#555] leading-[1.6]">{order.comment}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
