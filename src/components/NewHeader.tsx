import { Link, useLocation } from "react-router";
import { MapPin, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NewHeaderProps {
  cartCount?: number;
}

export default function NewHeader({ cartCount = 0 }: NewHeaderProps) {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: "/", label: "Исследования" },
    { path: "/legal", label: "Юр.лицам" },
    { path: "/contacts", label: "Контакты" },
  ];

  return (
    <header className="h-[52px] bg-white flex items-center justify-between px-6 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.06)] w-full flex-shrink-0">
      {/* Left: Logo / spacer */}
      <div className="flex items-center gap-4 flex-1">
        <Link to="/" className="text-[15px] font-semibold text-[#222] tracking-tight">
          ГБУЗ РОД
        </Link>
      </div>

      {/* Center: Nav */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === "/" && location.pathname === "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "text-[#00c9a7]"
                  : "text-[#555] hover:text-[#00c9a7]"
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-[#00c9a7]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right: Location, Cart, Profile */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="flex items-center gap-1 text-[12px] text-[#777]">
          <MapPin className="w-3.5 h-3.5 text-[#00c9a7]" />
          <span>Владикавказ</span>
        </div>

        <Link
          to="/cart"
          className="relative flex items-center gap-1 text-[12px] text-[#777] hover:text-[#00c9a7] transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>корзина</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#00c9a7] text-white text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        <Link
          to={user ? "/admin" : "/login"}
          className="w-7 h-7 rounded-full border border-[#e0e0e0] flex items-center justify-center hover:border-[#00c9a7] hover:bg-[#00c9a7]/5 transition-all duration-200"
        >
          <User className="w-4 h-4 text-[#666]" />
        </Link>
      </div>
    </header>
  );
}
