import { useState } from "react";
import { Link } from "react-router";
import {
  Building2,
  ChevronDown,
  Check,
  ArrowRight,
  FileText,
} from "lucide-react";
import NewHeader from "@/components/NewHeader";

const contractTypes = [
  {
    id: "routine",
    label: "Рутинные исследования",
    items: [
      { id: "r1", name: "Гистология: неопухолевая патология", price: "от 1 500 ₽" },
      { id: "r2", name: "Гистология: онкоматериал с ИГХ (базовая панель)", price: "от 5 000 ₽" },
      { id: "r3", name: "Цитологические исследования мазка", price: "от 900 ₽" },
      { id: "r4", name: "Тонкоигольная аспирационная биопсия (ТАБ)", price: "от 2 000 ₽" },
      { id: "r5", name: "Комплексная морфологическая диагностика опухоли", price: "от 5 000 ₽" },
    ],
  },
  {
    id: "reference",
    label: "Услуги референс-центров",
    items: [
      { id: "ref1", name: "ИГХ диагностика лимфом (расширенная панель)", price: "от 18 000 ₽" },
      { id: "ref2", name: "ИГХ диагностика мягкотканных образований", price: "от 15 000 ₽" },
      { id: "ref3", name: "Иммуногистохимическое исследование (ИГХ)", price: "от 2 500 ₽" },
      { id: "ref4", name: "Флуоресцентная гибридизация in situ (FISH)", price: "по запросу" },
    ],
  },
];

const benefits = [
  "Индивидуальные цены при регулярном сотрудничестве",
  "Отсрочка платежа до 30 дней",
  "Персональный менеджер",
  "Электронный документооборот",
  "Срочная обработка заказов",
];

export default function LegalPage() {
  const [selectedContract, setSelectedContract] = useState("routine");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showContract, setShowContract] = useState(false);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const currentContract = contractTypes.find((c) => c.id === selectedContract);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#fafafa]">
      <NewHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-[42%] min-w-[360px] max-w-[480px] bg-[#00c9a7] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Building2 className="w-4.5 h-4.5 text-white" />
              </div>
              <h2 className="text-[15px] font-semibold text-white/90 tracking-wide uppercase">
                Юридическим лицам
              </h2>
            </div>

            <p className="text-[13px] text-white/70 leading-[1.7]">
              Заключение договора на услуги на регулярной основе. Специальные
              условия для медицинских учреждений, страховых компаний и
              исследовательских организаций.
            </p>

            <div>
              <label className="text-[11px] text-white/60 uppercase tracking-wider mb-2 block">
                Вид исследования
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowContract(!showContract)}
                  className="w-full h-10 px-4 pr-10 rounded-xl bg-white text-[#333] text-[13px] text-left flex items-center justify-between transition-shadow hover:shadow-md"
                >
                  {currentContract?.label || "Выберите тип"}
                  <ChevronDown
                    className={`w-4 h-4 text-[#999] transition-transform duration-200 ${showContract ? "rotate-180" : ""}`}
                  />
                </button>
                {showContract && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden z-20 border border-[#f0f0f0]">
                    {contractTypes.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedContract(c.id); setShowContract(false); }}
                        className={`w-full px-4 py-2.5 text-[13px] text-left transition-colors ${
                          selectedContract === c.id
                            ? "text-[#00c9a7] bg-[#00c9a7]/5 font-medium"
                            : "text-[#333] hover:bg-[#00c9a7]/5 hover:text-[#00c9a7]"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedItems.length > 0 && (
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-white/90 text-[13px] font-medium mb-3">
                  <FileText className="w-4 h-4" />
                  <span>Выбрано: {selectedItems.length}</span>
                </div>
                <Link
                  to="/contract"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-[#00c9a7] text-[13px] font-semibold hover:bg-white/90 transition-all shadow-sm"
                >
                  Заключить договор
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-xl">
            <h3 className="text-[15px] font-semibold text-[#222] mb-1">
              {currentContract?.label}
            </h3>
            <p className="text-[12px] text-[#999] mb-5">
              Выберите исследования для включения в договор
            </p>

            <div className="space-y-2">
              {currentContract?.items.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`group w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-[#00c9a7]/[0.03] border-[#00c9a7]/30"
                        : "bg-white border-[#f0f0f0] hover:border-[#00c9a7]/20"
                    }`}
                  >
                    <div
                      className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                        isSelected
                          ? "bg-[#00c9a7] border-[#00c9a7]"
                          : "border-[#ddd] group-hover:border-[#00c9a7]/40"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-[#333] leading-[1.5]">{item.name}</div>
                      <div className="text-[11px] text-[#00c9a7] font-medium mt-1">
                        {item.price}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 bg-white rounded-2xl p-6 border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <h4 className="text-[13px] font-semibold text-[#222] mb-3">
                Преимущества договора
              </h4>
              <ul className="space-y-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[12px] text-[#555]">
                    <span className="w-4 h-4 rounded-full bg-[#00c9a7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-[#00c9a7]" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
