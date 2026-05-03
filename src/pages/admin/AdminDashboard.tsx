import AdminLayout from "./AdminLayout";
import { trpc } from "@/providers/trpc";
import {
  FolderTree,
  List,
  FileText,
  Settings,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: categories } = trpc.category.list.useQuery();
  const { data: services } = trpc.service.list.useQuery();
  const { data: contents } = trpc.content.list.useQuery();
  const { data: settingsList } = trpc.settings.list.useQuery();
  const { data: ordersData } = trpc.order.list.useQuery({ limit: 100, offset: 0 });

  const stats = [
    {
      label: "Категории",
      value: categories?.length ?? 0,
      icon: FolderTree,
      color: "#00c9a7",
      link: "/admin/categories",
    },
    {
      label: "Услуги",
      value: services?.length ?? 0,
      icon: List,
      color: "#0088ff",
      link: "/admin/services",
    },
    {
      label: "Заказы",
      value: ordersData?.total ?? 0,
      icon: ShoppingBag,
      color: "#00c9a7",
      link: "/admin/orders",
    },
    {
      label: "Новые",
      value: ordersData?.list.filter((o) => o.status === "new").length ?? 0,
      icon: ShoppingBag,
      color: "#f59e0b",
      link: "/admin/orders",
    },
    {
      label: "Контент",
      value: contents?.length ?? 0,
      icon: FileText,
      color: "#888",
      link: "/admin/content",
    },
    {
      label: "Настройки",
      value: settingsList?.length ?? 0,
      icon: Settings,
      color: "#888",
      link: "/admin/settings",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <a
              key={stat.label}
              href={stat.link}
              className="block p-4 rounded-xl bg-white border border-[#f0f0f0] hover:border-[#00c9a7]/30 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                <TrendingUp className="w-4 h-4 text-[#ccc] group-hover:text-[#00c9a7] transition-colors" />
              </div>
              <div className="text-2xl font-bold text-[#212121]">{stat.value}</div>
              <div className="text-[11px] text-[#999] mt-1 uppercase tracking-wider">{stat.label}</div>
            </a>
          ))}
        </div>

        <div className="rounded-xl bg-white border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="px-5 py-3 border-b border-[#f0f0f0] flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-[#212121]">Последние заказы</h2>
            <a href="/admin/orders" className="text-[11px] text-[#00c9a7] hover:underline">Все заказы →</a>
          </div>
          <div className="divide-y divide-[#f0f0f0]">
            {ordersData?.list.slice(0, 5).map((order) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between hover:bg-[#fafafa] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    order.status === "new" ? "bg-[#00c9a7]" :
                    order.status === "processing" ? "bg-amber-400" :
                    order.status === "completed" ? "bg-emerald-400" : "bg-red-300"
                  }`} />
                  <div>
                    <h3 className="text-[13px] text-[#212121] font-medium">{order.clientName}</h3>
                    <p className="text-[11px] text-[#888]">{order.clientPhone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] text-[#333] font-medium">{(order.totalPrice ?? 0).toLocaleString("ru-RU")} ₽</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    order.status === "new" ? "bg-[#00c9a7]/10 text-[#00c9a7]" :
                    order.status === "processing" ? "bg-amber-50 text-amber-500" :
                    order.status === "completed" ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-400"
                  }`}>
                    {order.status === "new" ? "Новая" : order.status === "processing" ? "В работе" : order.status === "completed" ? "Выполнена" : "Отменена"}
                  </span>
                </div>
              </div>
            ))}
            {(!ordersData?.list || ordersData.list.length === 0) && (
              <div className="px-5 py-6 text-center text-[12px] text-[#999]">Нет заказов</div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)] p-4">
          <h2 className="text-[13px] font-semibold text-[#212121] mb-3">Быстрые действия</h2>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/orders" className="px-4 py-2 rounded-lg bg-[#00c9a7]/8 border border-[#00c9a7]/20 text-[12px] text-[#00c9a7] hover:bg-[#00c9a7]/15 transition-colors font-medium">
              📋 Заказы
            </a>
            <a href="/admin/categories" className="px-4 py-2 rounded-lg bg-[#f5f5f5] border border-[#e5e5e5] text-[12px] text-[#212121] hover:border-[#00c9a7]/30 transition-colors">
              + Категория
            </a>
            <a href="/admin/services" className="px-4 py-2 rounded-lg bg-[#f5f5f5] border border-[#e5e5e5] text-[12px] text-[#212121] hover:border-[#00c9a7]/30 transition-colors">
              + Услуга
            </a>
            <a href="/admin/content" className="px-4 py-2 rounded-lg bg-[#f5f5f5] border border-[#e5e5e5] text-[12px] text-[#212121] hover:border-[#00c9a7]/30 transition-colors">
              + Контент
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
