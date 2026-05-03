import { Phone, Clock, MapPin, Shield, List } from "lucide-react";
import { Link, useLocation } from "react-router";

interface HeaderProps {
  phone: string;
  workHours: string;
  address: string;
  isAdmin?: boolean;
}

export default function Header({
  phone,
  workHours,
  address,
  isAdmin,
}: HeaderProps) {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] z-50 glass-panel border-b border-[#e5e5e5] shadow-sm">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">РОД</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[#212121] font-semibold text-sm leading-tight">
                ГБУЗ &quot;РОД&quot; ПАО
              </h1>
              <div className="flex items-center gap-1 text-[#888] text-xs">
                <MapPin className="w-3 h-3 text-[#00bfa5]" />
                <span className="truncate max-w-[200px]">{address}</span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-4">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                location.pathname === "/"
                  ? "text-[#00bfa5] bg-[#00bfa5]/10"
                  : "text-[#666] hover:text-[#212121] hover:bg-[#f5f5f5]"
              }`}
            >
              Главная
            </Link>
            <Link
              to="/services"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                location.pathname === "/services"
                  ? "text-[#00bfa5] bg-[#00bfa5]/10"
                  : "text-[#666] hover:text-[#212121] hover:bg-[#f5f5f5]"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Услуги на карте
            </Link>
          </nav>
        </div>

        {/* Right: Info + Admin */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[#666]">
              <Phone className="w-3.5 h-3.5 text-[#00bfa5]" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#666]">
              <Clock className="w-3.5 h-3.5 text-[#00bfa5]" />
              <span>{workHours}</span>
            </div>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-xs text-[#00bfa5] hover:border-[#00bfa5] transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Админка</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
