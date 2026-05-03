import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import {
  LayoutDashboard,
  FolderTree,
  List,
  FileText,
  Settings,
  ArrowLeft,
  LogOut,
  Shield,
  ShoppingBag,
} from "lucide-react";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/orders", label: "Заказы", icon: ShoppingBag },
  { path: "/admin/categories", label: "Категории", icon: FolderTree },
  { path: "/admin/services", label: "Услуги", icon: List },
  { path: "/admin/content", label: "Контент", icon: FileText },
  { path: "/admin/settings", label: "Настройки", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
    if (!isLoading && user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-[#888]">Загрузка...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-[#e5e5e5] flex flex-col fixed h-full">
        <div className="h-14 flex items-center px-4 border-b border-[#e5e5e5]">
          <Shield className="w-5 h-5 text-[#00bfa5] mr-2" />
          <span className="text-sm font-semibold text-[#212121]">
            Админ-панель
          </span>
        </div>

        <nav className="flex-1 py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "text-[#00bfa5] bg-[#f0fafa] border-l-2 border-[#00bfa5]"
                    : "text-[#666] hover:text-[#212121] hover:bg-[#f5f5f5]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#e5e5e5] space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-sm text-[#666] hover:text-[#212121] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            На сайт
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#666] hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Выход
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-[240px]">
        <div className="h-14 flex items-center justify-between px-6 border-b border-[#e5e5e5] bg-white">
          <h1 className="text-sm font-medium text-[#212121]">
            {navItems.find((i) => i.path === location.pathname)?.label ?? "Admin"}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-accent flex items-center justify-center text-white text-xs font-bold">
              {user.name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
            <span className="text-xs text-[#666]">{user.name ?? "Admin"}</span>
          </div>
        </div>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
