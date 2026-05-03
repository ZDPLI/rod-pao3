import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  ChevronLeft,
  Star,
  MapPin,
  Phone,
  Clock,
  Mail,
  Microscope,
  FlaskConical,
  Dna,
  Atom,
  Search,
} from "lucide-react";
import NewHeader from "@/components/NewHeader";
import YandexMap from "@/components/YandexMap";

const categories = [
  {
    id: "histology",
    name: "Гистология",
    icon: Microscope,
    description:
      "Микроскопический анализ тканей для диагностики онкологических и других заболеваний. Результат: от 5 до 10 дней (до 14 при сложных случаях).",
  },
  {
    id: "histochemistry",
    name: "Гистохимия",
    icon: FlaskConical,
    description:
      "Химический анализ тканей для оценки клеточного метаболизма и уточнения диагноза. Помогает отличить доброкачественные процессы от злокачественных. Результат: 7–12 дней (срочно — 1–3 дня).",
  },
  {
    id: "immunohistochemistry",
    name: "Иммуногистохимия",
    icon: Search,
    description:
      "Анализ тканей с антителами к специфическим белкам. Помогает точно классифицировать опухоль и подобрать персонализированное лечение. Результат: 10–14 дней (зависит от объёма анализа).",
  },
  {
    id: "molecular",
    name: "Молекулярно-генетическое",
    icon: Dna,
    description:
      "Поиск мутаций в ДНК опухоли или крови. Помогает подобрать персонализированное лечение и оценить наследственные риски. Результат: 12–21 день (зависит от объёма анализа).",
  },
  {
    id: "electron-microscopy",
    name: "Электронно-микроскопическое",
    icon: Atom,
    description:
      "Сверхдетальный анализ клеток на уровне органелл. Помогает в сложных случаях: редкие опухоли, вирусные инфекции, болезни накопления. Результат: до 30 дней.",
  },
];

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
    name: "Проф. Дзгоев Р.Х.",
    role: "Заведующий отделением",
    experience: "25+ лет",
    specialty: "Онкологическая патология, ИГХ-диагностика",
  },
  {
    id: 2,
    name: "Др. Габараева С.М.",
    role: "Врач-патологоанатом",
    experience: "18 лет",
    specialty: "Гистология, цитология",
  },
  {
    id: 3,
    name: "Др. Тедеев А.В.",
    role: "Врач-патологоанатом",
    experience: "15 лет",
    specialty: "Онкологическая патология",
  },
  {
    id: 4,
    name: "Кокоева Л.М.",
    role: "Старший лаборант",
    experience: "20 лет",
    specialty: "Препарирование, окраска препаратов",
  },
];

type RightPanel = "category" | "reviews" | "staff" | "contacts";

export default function NewHome() {
  const [activeCategory, setActiveCategory] = useState<string>("histology");
  const [rightPanel, setRightPanel] = useState<RightPanel>("category");

  const activeCat = categories.find((c) => c.id === activeCategory);
  const ActiveIcon = activeCat?.icon || Microscope;

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    setRightPanel("category");
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#fafafa]">
      <NewHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-[42%] min-w-[360px] max-w-[480px] flex flex-col bg-[#00c9a7] relative">
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-2">
            <h2 className="text-[15px] font-semibold text-white/90 tracking-wide uppercase mb-5">
              Исследования
            </h2>

            <div className="space-y-1.5">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id && rightPanel === "category";
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`group w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white text-[#333] shadow-sm"
                        : "bg-white/10 text-white/90 hover:bg-white/20"
                    }`}
                  >
                    <CatIcon className={`w-4 h-4 ${isActive ? "text-[#00c9a7]" : "text-white/60"}`} />
                    <span className="flex-1 text-left">{cat.name}</span>
                    {isActive ? (
                      <ChevronLeft className="w-3.5 h-3.5 text-[#00c9a7]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom section: discounts + nav buttons */}
          <div className="px-6 pb-5 pt-2 space-y-3">
            <Link
              to="/discounts"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 text-white/90 text-[12px] font-medium hover:bg-white/25 transition-all duration-200"
            >
              <span>Скидки и акции</span>
            </Link>

            <div className="flex gap-2">
              {(["reviews", "staff", "contacts"] as const).map((panel) => {
                const labels = { reviews: "Отзывы", staff: "Сотрудники", contacts: "Контакты" };
                const isActive = rightPanel === panel;
                return (
                  <button
                    key={panel}
                    onClick={() => setRightPanel(panel)}
                    className={`flex-1 py-2 rounded-xl text-[12px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white text-[#00c9a7] shadow-sm"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {labels[panel]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-[#fafafa] overflow-y-auto">
          {rightPanel === "category" && activeCat && (
            <div className="p-8">
              <div className="max-w-lg">
                <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-7 border border-[#f0f0f0]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#00c9a7]/8 flex items-center justify-center">
                      <ActiveIcon className="w-5 h-5 text-[#00c9a7]" />
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#222]">{activeCat.name}</h3>
                  </div>
                  <p className="text-[13px] text-[#555] leading-[1.7] whitespace-pre-line">
                    {activeCat.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {rightPanel === "reviews" && (
            <div className="p-8">
              <h3 className="text-[15px] font-semibold text-[#222] mb-5">Отзывы клиентов</h3>
              <div className="space-y-3 max-w-lg">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl p-5 border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#00c9a7]/8 flex items-center justify-center text-[#00c9a7] text-[13px] font-semibold">
                          {review.name.split(" ").pop()?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-[#222]">{review.name}</div>
                          <div className="text-[11px] text-[#999]">{review.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-[#e8e8e8]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[13px] text-[#555] leading-[1.6]">{review.text}</p>
                    <div className="text-[11px] text-[#bbb] mt-3">{review.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rightPanel === "staff" && (
            <div className="p-8">
              <h3 className="text-[15px] font-semibold text-[#222] mb-5">Наши специалисты</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                {staff.map((person) => (
                  <div
                    key={person.id}
                    className="bg-white rounded-2xl p-5 border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-semibold text-[14px]">
                        {person.name.split(" ").pop()?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[#222]">{person.name}</div>
                        <div className="text-[11px] text-[#00c9a7]">{person.role}</div>
                      </div>
                    </div>
                    <div className="space-y-1 text-[12px] text-[#777]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#bbb]">Стаж</span>
                        <span className="text-[#444] font-medium">{person.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#bbb]">Специализация</span>
                        <span className="text-[#444]">{person.specialty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rightPanel === "contacts" && (
            <div className="p-8">
              <h3 className="text-[15px] font-semibold text-[#222] mb-5">Контактная информация</h3>
              <div className="space-y-2.5 max-w-lg">
                {[
                  { icon: MapPin, label: "Адрес", value: "РСО-Алания, г. Владикавказ, ул. Титова, д. 1" },
                  { icon: Phone, label: "Телефон", value: "+7 (8672) 55-55-55" },
                  { icon: Clock, label: "Режим работы", value: "Пн–Пт: 8:00–17:00, Сб: 9:00–14:00" },
                  { icon: Mail, label: "Email", value: "info@rod-ru.ru" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 bg-white rounded-xl px-5 py-3.5 border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
                  >
                    <item.icon className="w-4 h-4 text-[#00c9a7] flex-shrink-0" />
                    <div>
                      <div className="text-[11px] text-[#aaa] uppercase tracking-wider">{item.label}</div>
                      <div className="text-[13px] text-[#333] font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}

                <div className="mt-4 rounded-2xl overflow-hidden border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                  <YandexMap
                    latitude={43.0367}
                    longitude={44.6678}
                    address="РСО-Алания, г. Владикавказ, ул. Титова, д. 1"
                    phone="+7 (8672) 55-55-55"
                    workHours="Пн-Пт: 8:00-17:00, Сб: 9:00-14:00"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
