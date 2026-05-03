import { useNavigate } from "react-router";
import MicroscopeShader from "@/components/MicroscopeShader";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SchemaMarkup from "@/components/SchemaMarkup";
import FAQSection from "@/components/FAQSection";
import { fallbackCategories, fallbackSettings } from "@/lib/fallbackData";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  Activity,
  Microscope,
  Search,
  FileText,
  Stethoscope,
  FlaskConical,
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Mail,
  ChevronRight,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Activity: <Activity className="w-8 h-8" />,
  Microscope: <Microscope className="w-8 h-8" />,
  Search: <Search className="w-8 h-8" />,
  FileText: <FileText className="w-8 h-8" />,
  Stethoscope: <Stethoscope className="w-8 h-8" />,
  FlaskConical: <FlaskConical className="w-8 h-8" />,
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: apiCategories } = trpc.category.list.useQuery();
  const { data: apiSettings } = trpc.settings.list.useQuery();

  const categories = apiCategories ?? fallbackCategories;
  const settingsList =
    apiSettings ??
    Object.entries(fallbackSettings).map(([key, value]) => ({
      key,
      value,
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

  const settings = Object.fromEntries(
    settingsList.map((s) => [s.key, s.value ?? ""])
  );

  const address = settings.address || fallbackSettings.address;
  const phone = settings.phone || fallbackSettings.phone;
  const workHours = settings.workHours || fallbackSettings.workHours;
  const email = settings.email || fallbackSettings.email;
  const orgFullName = settings.orgFullName || fallbackSettings.orgFullName;

  return (
    <div className="min-h-screen bg-white" role="document" itemScope itemType="https://schema.org/WebPage">
      <SchemaMarkup type="home" />
      <Header
        phone={phone}
        workHours={workHours}
        address={address}
        isAdmin={user?.role === "admin"}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" role="banner" aria-label="Главный баннер">
        <div className="absolute inset-0">
          <MicroscopeShader />
        </div>

        <article className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#00bfa5]/30 text-[#00bfa5] text-xs font-medium mb-6 shadow-sm">
            <MapPin className="w-3 h-3" />
            {address}
          </div>

          <h1 className="hero-title text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4 drop-shadow-lg" itemProp="headline">
            Патологоанатомическое
            <br />
            <span className="text-[#00ffd0]">отделение ГБУЗ &quot;РОД&quot;</span>
          </h1>

          <p className="hero-description text-base md:text-lg text-white/80 mb-8 max-w-xl mx-auto leading-relaxed drop-shadow" itemProp="description">
            Полный спектр патологоанатомических услуг:
            гистологические и цитологические исследования,
            иммуногистохимические исследования (ИГХ).
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/services")}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-accent text-white text-sm font-semibold hover:shadow-lg transition-all"
            >
              Просмотреть услуги на карте
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("contacts")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white text-sm hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Контактная информация
            </button>
          </div>
        </article>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs">Листайте вниз</span>
          <div className="w-5 h-8 rounded-full border border-white/40 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-[#00bfa5] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-[#00bfa5] uppercase tracking-widest">
            Услуги
          </span>
          <h2 className="text-3xl font-bold text-[#212121] mt-2 mb-4">
            {categories.length} направлений исследований
          </h2>
          <p className="text-sm text-[#888] max-w-lg mx-auto">
            Современное оборудование и высококвалифицированные специалисты
            обеспечивают точность и оперативность каждого исследования.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate("/services")}
              className="group text-left p-5 rounded-xl bg-white border border-[#e5e5e5] hover:border-[#00bfa5]/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-[#f0fafa] flex items-center justify-center text-[#00bfa5] group-hover:bg-[#00bfa5]/10 transition-colors">
                  {iconMap[cat.icon ?? ""] ?? (
                    <Activity className="w-8 h-8" />
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-[#ccc] group-hover:text-[#00bfa5] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
              <h3 className="text-sm font-semibold text-[#212121] mb-1 group-hover:text-[#00bfa5] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-[#888] leading-relaxed">
                {cat.description}
              </p>
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/services")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] hover:border-[#00bfa5] hover:text-[#00bfa5] transition-all"
          >
            Все услуги на карте
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ===== CONTACTS SECTION ===== */}
      <section id="contacts" className="py-20 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#00bfa5] uppercase tracking-widest">
              Контакты
            </span>
            <h2 className="text-3xl font-bold text-[#212121] mt-2 mb-4">
              Как нас найти
            </h2>
            <p className="text-sm text-[#888] max-w-lg mx-auto">
              Мы находимся в центре Владикавказа. Приём заявок на
              исследования в рабочие часы.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white border border-[#e5e5e5]">
              <div className="w-10 h-10 rounded-lg bg-[#f0fafa] flex items-center justify-center text-[#00bfa5] mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-[#212121] mb-1">Адрес</h4>
              <p className="text-xs text-[#888] leading-relaxed">{address}</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#e5e5e5]">
              <div className="w-10 h-10 rounded-lg bg-[#f0fafa] flex items-center justify-center text-[#00bfa5] mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-[#212121] mb-1">Телефон</h4>
              <p className="text-xs text-[#888]">{phone}</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#e5e5e5]">
              <div className="w-10 h-10 rounded-lg bg-[#f0fafa] flex items-center justify-center text-[#00bfa5] mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-[#212121] mb-1">Режим работы</h4>
              <p className="text-xs text-[#888]">{workHours}</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#e5e5e5]">
              <div className="w-10 h-10 rounded-lg bg-[#f0fafa] flex items-center justify-center text-[#00bfa5] mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-[#212121] mb-1">Email</h4>
              <p className="text-xs text-[#888]">{email}</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-xl bg-white border border-[#e5e5e5]">
              <div className="text-left">
                <h4 className="text-sm font-medium text-[#212121] mb-1">
                  Посмотреть расположение на карте
                </h4>
                <p className="text-xs text-[#888]">
                  Точное местоположение с возможностью проложить маршрут
                </p>
              </div>
              <button
                onClick={() => navigate("/services")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-accent text-white text-sm font-semibold hover:shadow-lg transition-all whitespace-nowrap"
              >
                Открыть карту
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== E-E-A-T SECTION ===== */}
      <section className="py-20 bg-[#f5f5f5]" role="region" aria-label="О клинике">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#00bfa5] uppercase tracking-widest">
              О клинике
            </span>
            <h2 className="text-3xl font-bold text-[#212121] mt-2 mb-4">
              Почему выбирают ГБУЗ &quot;РОД&quot;
            </h2>
            <p className="text-sm text-[#888] max-w-2xl mx-auto">
              Патологоанатомическое отделение ГБУЗ &quot;Республиканский онкологический диспансер" — ведущее учреждение Северной Осетии по диагностическим исследованиям.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="p-6 rounded-xl bg-white border border-[#e5e5e5]">
              <h3 className="text-lg font-semibold text-[#212121] mb-3">Экспертиза и опыт</h3>
              <p className="text-sm text-[#666] leading-relaxed mb-3">
                Высококвалифицированные патологоанатомы с многолетним опытом работы в области морфологической диагностики. Специалисты отделения регулярно повышают квалификацию и участвуют в всероссийских конференциях.
              </p>
              <ul className="text-xs text-[#888] space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-[#00bfa5] mt-0.5">✓</span>
                  <span>Квалифицированные врачи-патологоанатомы</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00bfa5] mt-0.5">✓</span>
                  <span>Сертифицированная лаборатория</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00bfa5] mt-0.5">✓</span>
                  <span>Постоянное профессиональное развитие</span>
                </li>
              </ul>
            </article>

            <article className="p-6 rounded-xl bg-white border border-[#e5e5e5]">
              <h3 className="text-lg font-semibold text-[#212121] mb-3">Современное оборудование</h3>
              <p className="text-sm text-[#666] leading-relaxed mb-3">
                Отделение оснащено современным микроскопическим оборудованием, автоматическими процессорами тканей, системами cryostat для экспресс-диагностики и платформами для иммуногистохимических исследований.
              </p>
              <ul className="text-xs text-[#888] space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-[#00bfa5] mt-0.5">✓</span>
                  <span>Автоматизированная обработка образцов</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00bfa5] mt-0.5">✓</span>
                  <span>Cryostat для экспресс-гистологии</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00bfa5] mt-0.5">✓</span>
                  <span>Иммуногистохимические анализаторы</span>
                </li>
              </ul>
            </article>

            <article className="p-6 rounded-xl bg-white border border-[#e5e5e5]">
              <h3 className="text-lg font-semibold text-[#212121] mb-3">Полный спектр услуг</h3>
              <p className="text-sm text-[#666] leading-relaxed mb-3">
                Полный спектр диагностических исследований в одном учреждении — от классической гистологии до иммуногистохимических исследований (ИГХ).
              </p>
              <ul className="text-xs text-[#888] space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-[#00bfa5] mt-0.5">✓</span>
                  <span>6 направлений исследований</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00bfa5] mt-0.5">✓</span>
                  <span>14+ специализированных услуг</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00bfa5] mt-0.5">✓</span>
                  <span>От результатов за 15 минут до 14 дней</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <FAQSection />

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#212121] mb-4">
          Нужно патологоанатомическое исследование?
        </h2>
        <p className="text-sm text-[#888] max-w-lg mx-auto mb-8">
          Перейдите к полному каталогу услуг с интерактивной картой.
          Выберите категорию и ознакомьтесь с подробной информацией.
        </p>
        <button
          onClick={() => navigate("/services")}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-accent text-white text-base font-bold hover:shadow-xl transition-all hover:scale-105"
        >
          Перейти к услугам
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      <Footer
        address={address}
        phone={phone}
        workHours={workHours}
        email={email}
        orgFullName={orgFullName}
      />
    </div>
  );
}
