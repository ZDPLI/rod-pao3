import NewHeader from "@/components/NewHeader";
import YandexMap from "@/components/YandexMap";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Star,
  UserCircle,
} from "lucide-react";
import { useState } from "react";

const reviews = [
  {
    id: 1,
    name: "Др. Асланбеков М.Р.",
    role: "Главный врач ГКБ №3",
    rating: 5,
    text: "Отличное качество гистологических исследований. Быстрая диагностика и точные результаты. Работаем с РОД более 5 лет.",
    date: "2026-03-15",
  },
  {
    id: 2,
    name: "Петрова А.С.",
    role: "Онколог",
    rating: 5,
    text: "ИГХ исследования выполняются на высшем уровне. Особенно ценим расширенные панели для диагностики лимфом.",
    date: "2026-02-28",
  },
  {
    id: 3,
    name: "Др. Хадарцев И.А.",
    role: "Патологоанатом",
    rating: 5,
    text: "Профессиональный коллектив, современное оборудование. Результаты всегда в срок.",
    date: "2026-01-20",
  },
  {
    id: 4,
    name: "Смирнова К.В.",
    role: "Медицинский директор",
    rating: 4,
    text: "Хорошее соотношение цены и качества. Удобная система доставки материалов.",
    date: "2025-12-10",
  },
];

const staff = [
  {
    id: 1,
    name: "Проф. Дзgoев Руслан Х.",
    role: "Заведующий патологоанатомическим отделением",
    experience: "25+ лет",
    specialty: "Онкологическая патология, ИГХ-диагностика",
  },
  {
    id: 2,
    name: "Др. Габараева Светлана М.",
    role: "Врач-патологоанатом",
    experience: "18 лет",
    specialty: "Гистология, цитология",
  },
  {
    id: 3,
    name: "Др. Тедеев Алан В.",
    role: "Врач-патологоанатом",
    experience: "15 лет",
    specialty: "Онкологическая патология",
  },
  {
    id: 4,
    name: "Кокоева Лариса М.",
    role: "Старший лаборант",
    experience: "20 лет",
    specialty: "Препарирование, окраска препаратов",
  },
];

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState<"reviews" | "staff" | "contacts">("contacts");

  const turquoisePanel = (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Контакты и логистика</h2>

      <div className="bg-white/20 rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3 text-white">
          <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium">Адрес</div>
            <div className="text-xs text-white/80">
              РСО-Алания, г. Владикавказ, ул. Титова, д. 1
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 text-white">
          <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium">Телефон</div>
            <div className="text-xs text-white/80">+7 (8672) 55-55-55</div>
          </div>
        </div>

        <div className="flex items-start gap-3 text-white">
          <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium">Режим работы</div>
            <div className="text-xs text-white/80">
              Пн-Пт: 8:00-17:00, Сб: 9:00-14:00
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 text-white">
          <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium">Email</div>
            <div className="text-xs text-white/80">info@rod-ru.ru</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {[
          { key: "contacts" as const, label: "Контакты", icon: MapPin },
          { key: "reviews" as const, label: "Отзывы", icon: Star },
          { key: "staff" as const, label: "Сотрудники", icon: UserCircle },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-[#00c9a7]"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <NewHeader />

      <div className="flex flex-1 pt-[60px] overflow-hidden">
        {/* Left turquoise panel */}
        <div className="w-[45%] max-w-[520px] min-w-[400px] bg-[#00c9a7] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {turquoisePanel}
          </div>

          <div className="p-4 flex items-center gap-3">
            {[
              { key: "contacts" as const, label: "Контакты", icon: MapPin },
              { key: "reviews" as const, label: "Отзывы", icon: Star },
              { key: "staff" as const, label: "Сотрудники", icon: UserCircle },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-white text-[#00c9a7]"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-hidden bg-white">
          {activeTab === "contacts" ? (
            <YandexMap
              latitude={43.0367}
              longitude={44.6678}
              address="РСО-Алания, г. Владикавказ, ул. Титова, д. 1"
              phone="+7 (8672) 55-55-55"
              workHours="Пн-Пт: 8:00-17:00, Сб: 9:00-14:00"
            />
          ) : (
            <div className="h-full overflow-y-auto">
              {activeTab === "reviews" && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#333] mb-4">Отзывы клиентов</h3>
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-white rounded-lg border border-[#e5e5e5]">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#00c9a7]/10 flex items-center justify-center">
                              <UserCircle className="w-5 h-5 text-[#00c9a7]" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#333]">{review.name}</div>
                              <div className="text-xs text-[#888]">{review.role}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-[#ddd]"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-[#666] leading-relaxed">{review.text}</p>
                        <div className="text-xs text-[#999] mt-2">{review.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "staff" && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#333] mb-4">Наши специалисты</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {staff.map((person) => (
                      <div key={person.id} className="p-4 bg-white rounded-lg border border-[#e5e5e5]">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold text-lg">
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#333]">{person.name}</div>
                            <div className="text-xs text-[#00c9a7]">{person.role}</div>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs text-[#666]">
                          <div className="flex items-center gap-2"><span className="text-[#888]">Стаж:</span><span>{person.experience}</span></div>
                          <div className="flex items-center gap-2"><span className="text-[#888]">Специализация:</span><span>{person.specialty}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
