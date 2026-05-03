import { MapPin, Phone, Clock, Mail } from "lucide-react";

interface FooterProps {
  address: string;
  phone: string;
  workHours: string;
  email: string;
  orgFullName: string;
}

export default function Footer({
  address,
  phone,
  workHours,
  email,
  orgFullName,
}: FooterProps) {
  return (
    <footer className="bg-[#f5f5f5] border-t border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center">
                <span className="text-white font-bold text-xs">РОД</span>
              </div>
              <h3 className="text-sm font-semibold text-[#212121]">
                ГБУЗ &quot;РОД&quot; ПАО
              </h3>
            </div>
            <p className="text-xs text-[#888] leading-relaxed">{orgFullName}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-[#00bfa5] uppercase tracking-wider mb-4">
              Контакты
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#666]">
                <MapPin className="w-3.5 h-3.5 text-[#00bfa5]" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#666]">
                <Phone className="w-3.5 h-3.5 text-[#00bfa5]" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#666]">
                <Mail className="w-3.5 h-3.5 text-[#00bfa5]" />
                <span>{email}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-[#00bfa5] uppercase tracking-wider mb-4">
              Режим работы
            </h4>
            <div className="flex items-start gap-2 text-xs text-[#666]">
              <Clock className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
              <span>{workHours}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#e5e5e5] text-center">
          <p className="text-xs text-[#888]">
            &copy; {new Date().getFullYear()} {orgFullName}. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
