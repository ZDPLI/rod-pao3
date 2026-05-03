import { Routes, Route } from "react-router";
import NewHome from "./pages/NewHome";
import EstimatePage from "./pages/EstimatePage";
import LegalPage from "./pages/LegalPage";
import ContractPage from "./pages/ContractPage";
import LogisticsPage from "./pages/LogisticsPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminServices from "./pages/admin/AdminServices";
import AdminContent from "./pages/admin/AdminContent";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";

function DiscountsPage() {
  return (
    <div className="min-h-screen bg-white pt-[60px] p-8">
      <h1 className="text-2xl font-bold text-[#333] mb-4">Скидки и акции</h1>
      <div className="max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Скидка 5%", desc: "При заказе от 5 000 ₽", color: "#00c9a7" },
          { title: "Скидка 10%", desc: "При заказе от 15 000 ₽", color: "#00a896" },
          { title: "Скидка 15%", desc: "При заказе от 30 000 ₽", color: "#008f80" },
          { title: "Скидка 20%", desc: "При заказе от 50 000 ₽", color: "#007a6c" },
        ].map((d) => (
          <div key={d.title} className="p-5 bg-white rounded-xl border border-[#e5e5e5]">
            <div className="text-2xl font-bold mb-1" style={{ color: d.color }}>{d.title}</div>
            <div className="text-sm text-[#666]">{d.desc}</div>
          </div>
        ))}
        <div className="col-span-full p-5 bg-[#00c9a7]/5 rounded-xl border border-[#00c9a7]/20">
          <h3 className="text-sm font-semibold text-[#333] mb-2">Для юридических лиц</h3>
          <p className="text-sm text-[#666]">
            Специальные условия при заключении договора на регулярное обслуживание.
            Индивидуальные цены, отсрочка платежа до 30 дней, персональный менеджер.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Main pages */}
      <Route path="/" element={<NewHome />} />
      <Route path="/estimate" element={<EstimatePage />} />
      <Route path="/legal" element={<LegalPage />} />
      <Route path="/contract" element={<ContractPage />} />
      <Route path="/contacts" element={<LogisticsPage />} />
      <Route path="/discounts" element={<DiscountsPage />} />
      <Route path="/cart" element={<EstimatePage />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/admin/services" element={<AdminServices />} />
      <Route path="/admin/content" element={<AdminContent />} />
      <Route path="/admin/settings" element={<AdminSettings />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
