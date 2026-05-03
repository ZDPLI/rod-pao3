import { Link, useLocation } from "react-router";
import { MessageSquare, Users, Phone } from "lucide-react";
import NewHeader from "./NewHeader";

interface MainLayoutProps {
  children: React.ReactNode;
  turquoiseContent?: React.ReactNode;
  cartCount?: number;
}

export default function MainLayout({
  children,
  turquoiseContent,
  cartCount = 0,
}: MainLayoutProps) {
  const location = useLocation();

  const bottomLinks = [
    { path: "/contacts", label: "Отзывы", icon: MessageSquare },
    { path: "/contacts/staff", label: "Сотрудники", icon: Users },
    { path: "/contacts/info", label: "Контакты", icon: Phone },
  ];

  return (
    <div className="h-screen w-screen bg-white overflow-hidden flex flex-col">
      <NewHeader cartCount={cartCount} />

      <div className="flex flex-1 pt-[60px]">
        {/* Left turquoise panel */}
        <div className="w-[45%] max-w-[520px] min-w-[400px] bg-[#00c9a7] flex flex-col relative">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6">
            {turquoiseContent}
          </div>

          {/* Bottom navigation buttons */}
          <div className="p-4 flex items-center gap-3">
            {bottomLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                  location.pathname === link.path
                    ? "bg-white text-[#00c9a7]"
                    : "bg-[#00c9a7] text-white border border-white/40 hover:bg-white/20"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right gray content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
