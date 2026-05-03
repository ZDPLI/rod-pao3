import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Link } from "react-router";
import {
  Calculator,
  Clock,
  ChevronDown,
  ChevronRight,
  Filter,
  Plus,
  Tag,
} from "lucide-react";
import { estimateData } from "@/lib/estimateData";

const tumorTypes = [
  "Все",
  "РМЖ",
  "Лёгкое",
  "Толстая кишка",
  "Желудок",
  "Предстательная железа",
  "Щитовидная железа",
  "Лимфома",
];

const localizationTypes = [
  "Все",
  "Люминальный А",
  "Люминальный B",
  "HER2-положительный",
  "Тройной негативный",
  "Кишечный",
  "Диффузный",
];

export default function ResearchDetailPage() {
  const [selectedType, setSelectedType] = useState("Все");
  const [selectedLocalization, setSelectedLocalization] = useState("Все");
  const [typeOpen, setTypeOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);

  // Get all IHC items
  const ihcCategory = estimateData.find(
    (c) => c.id === "immunohistochemistry"
  );
  const allMarkers = ihcCategory?.items ?? [];

  // Filter markers (simplified logic)
  const filteredMarkers = allMarkers.filter((m) => {
    if (selectedType === "Все" && selectedLocalization === "Все") return true;
    if (selectedType === "РМЖ" && selectedLocalization === "Люминальный А") {
      return ["er", "pr", "ki67"].includes(m.id);
    }
    if (selectedType === "РМЖ" && selectedLocalization === "HER2-положительный") {
      return ["her2", "ki67", "p53"].includes(m.id);
    }
    if (selectedType === "Лимфома") {
      return ["cd20", "cd3", "ki67"].includes(m.id);
    }
    return true;
  });

  const turquoisePanel = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-white/80 text-sm">
        <Link to="/" className="hover:text-white">
          Главная
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/research" className="hover:text-white">
          Вид исследования
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white">ИГХ</span>
      </div>

      <h2 className="text-2xl font-bold text-white">ИММУНОГИСТОХИМИЯ</h2>

      <p className="text-white/80 text-sm leading-relaxed">
        Иммуногистохимические исследования позволяют выявлять
        специфические антигены в тканях. Используйте фильтры для поиска
        нужных маркеров.
      </p>

      <div className="space-y-2.5">
        <Link
          to="/estimate"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-[#00c9a7] text-sm font-medium hover:bg-white/90"
        >
          <Calculator className="w-5 h-5" />
          Рассчитать смету на исследование
        </Link>
        <Link
          to="/timeline"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#00c9a7] text-white border border-white/40 text-sm font-medium hover:bg-white/20"
        >
          <Clock className="w-5 h-5" />
          Сроки исследования
        </Link>
        <Link
          to="/discounts"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#00c9a7] text-white border border-white/40 text-sm font-medium hover:bg-white/20"
        >
          <Tag className="w-5 h-5" />
          Скидки и акции
        </Link>
      </div>
    </div>
  );

  return (
    <MainLayout turquoiseContent={turquoisePanel}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-[#888]" />
          <span className="text-sm text-[#888]">Используйте фильтры</span>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-[200px]">
            <label className="text-xs text-[#888] mb-1 block">Вид</label>
            <button
              onClick={() => setTypeOpen(!typeOpen)}
              className="w-full h-10 px-3 pr-8 rounded-lg bg-white border border-[#e5e5e5] text-sm text-[#333] text-left flex items-center justify-between"
            >
              {selectedType}
              <ChevronDown
                className={`w-4 h-4 text-[#999] transition-transform ${typeOpen ? "rotate-180" : ""}`}
              />
            </button>
            {typeOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e5e5e5] overflow-hidden z-20">
                {tumorTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedType(t);
                      setTypeOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left text-[#333] hover:bg-[#00c9a7]/10 hover:text-[#00c9a7]"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex-1 max-w-[220px]">
            <label className="text-xs text-[#888] mb-1 block">
              Локализация
            </label>
            <button
              onClick={() => setLocOpen(!locOpen)}
              className="w-full h-10 px-3 pr-8 rounded-lg bg-white border border-[#e5e5e5] text-sm text-[#333] text-left flex items-center justify-between"
            >
              {selectedLocalization}
              <ChevronDown
                className={`w-4 h-4 text-[#999] transition-transform ${locOpen ? "rotate-180" : ""}`}
              />
            </button>
            {locOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e5e5e5] overflow-hidden z-20">
                {localizationTypes.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setSelectedLocalization(l);
                      setLocOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left text-[#333] hover:bg-[#00c9a7]/10 hover:text-[#00c9a7]"
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {filteredMarkers.map((marker) => (
            <div
              key={marker.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#e5e5e5] hover:border-[#00c9a7]/50 transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-[#333]">
                  {marker.name}
                </div>
                <div className="text-xs text-[#00c9a7] font-semibold mt-0.5">
                  {marker.price.toLocaleString("ru-RU")} ₽
                </div>
              </div>
              <Link
                to="/estimate"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00c9a7] text-white text-xs hover:bg-[#00b899] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Добавить
              </Link>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
