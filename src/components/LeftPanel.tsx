import { useState } from "react";
import {
  Activity,
  Microscope,
  Search,
  FileText,
  Stethoscope,
  FlaskConical,
  ChevronRight,
  ChevronDown,
  Clock,
  Banknote,
  ClipboardList,
  UserSearch,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { fallbackCategories, fallbackServices } from "@/lib/fallbackData";

const iconMap: Record<string, React.ReactNode> = {
  Activity: <Activity className="w-5 h-5" />,
  Microscope: <Microscope className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Stethoscope: <Stethoscope className="w-5 h-5" />,
  FlaskConical: <FlaskConical className="w-5 h-5" />,
};

export default function LeftPanel() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const { data: apiCategories } = trpc.category.list.useQuery();
  const { data: apiServices } = trpc.service.list.useQuery(
    selectedCategory ? { categoryId: selectedCategory } : undefined
  );

  const categories = apiCategories ?? fallbackCategories;
  const services = apiServices ?? (selectedCategory ? fallbackServices.filter(s => s.categoryId === selectedCategory) : fallbackServices);

  const selectedCat = categories?.find((c) => c.id === selectedCategory);

  return (
    <div className="w-full h-full flex flex-col bg-[#f5f5f5] border-r border-[#e5e5e5]">
      {/* Header section */}
      <div className="p-4 border-b border-[#e5e5e5] bg-white">
        <nav className="flex items-center gap-2 text-xs text-[#888] mb-3">
          <span className="text-[#00bfa5]">Главная</span>
          <ChevronRight className="w-3 h-3" />
          <span>Услуги</span>
          {selectedCat && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#212121]">{selectedCat.name}</span>
            </>
          )}
        </nav>
        <h2 className="text-xl font-bold text-[#212121] tracking-tight">
          Патологоанатомические услуги
        </h2>
        <p className="text-xs text-[#888] mt-1">
          Выберите категорию для просмотра услуг
        </p>
      </div>

      {/* Category tabs */}
      <div className="p-3 border-b border-[#e5e5e5] bg-white">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setExpandedService(null);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              selectedCategory === null
                ? "bg-gradient-accent text-white border-transparent"
                : "bg-white text-[#666] border-[#ddd] hover:border-[#00bfa5] hover:text-[#212121]"
            }`}
          >
            Все
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(
                  selectedCategory === cat.id ? null : cat.id
                );
                setExpandedService(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                selectedCategory === cat.id
                  ? "bg-gradient-accent text-white border-transparent"
                  : "bg-white text-[#666] border-[#ddd] hover:border-[#00bfa5] hover:text-[#212121]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Service count */}
      <div className="px-4 py-2 border-b border-[#e5e5e5] bg-white">
        <span className="text-xs text-[#888]">
          {services?.length ?? 0} услуг
          {selectedCat ? ` в категории «${selectedCat.name}»` : ""}
        </span>
      </div>

      {/* Services list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {!selectedCategory ? (
          /* Show categories as cards */
          <>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="w-full text-left p-3 rounded-lg bg-white border border-[#e5e5e5] hover:border-[#00bfa5]/50 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f0fafa] flex items-center justify-center text-[#00bfa5] group-hover:bg-[#00bfa5]/10 transition-colors">
                    {iconMap[cat.icon ?? ""] ?? <Activity className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[#212121] group-hover:text-[#00bfa5] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#888] truncate">
                      {cat.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#00bfa5] transition-colors" />
                </div>
              </button>
            ))}
          </>
        ) : services && services.length > 0 ? (
          /* Show services as accordions */
          <>
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-lg bg-white border border-[#e5e5e5] overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedService(
                      expandedService === service.id ? null : service.id
                    )
                  }
                  className="w-full text-left p-3 flex items-center justify-between hover:bg-[#fafafa] transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm font-medium text-[#212121]">
                      {service.name}
                    </h3>
                    {service.shortDescription && (
                      <p className="text-xs text-[#888] mt-0.5 truncate">
                        {service.shortDescription}
                      </p>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#ccc] transition-transform flex-shrink-0 ${
                      expandedService === service.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedService === service.id && (
                  <div className="px-3 pb-3 border-t border-[#e5e5e5] pt-3 space-y-3">
                    {service.description && (
                      <p className="text-xs text-[#666] leading-relaxed">
                        {service.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {service.price && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Banknote className="w-3.5 h-3.5 text-[#00bfa5]" />
                          <span className="text-[#666]">{service.price}</span>
                        </div>
                      )}
                      {service.duration && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="w-3.5 h-3.5 text-[#00bfa5]" />
                          <span className="text-[#666]">{service.duration}</span>
                        </div>
                      )}
                    </div>

                    {service.requirements && (
                      <div className="flex items-start gap-1.5 text-xs">
                        <ClipboardList className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                        <span className="text-[#666]">{service.requirements}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-24 h-24 mb-4 text-[#ddd]">
              <UserSearch className="w-full h-full" />
            </div>
            <h3 className="text-sm font-medium text-[#212121] mb-1">
              Нет доступных услуг
            </h3>
            <p className="text-xs text-[#888] text-center">
              В данной категории пока нет услуг
            </p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-4 px-4 py-2 rounded-md bg-gradient-accent text-white text-xs font-semibold hover:shadow-md transition-shadow"
            >
              Показать все категории
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
