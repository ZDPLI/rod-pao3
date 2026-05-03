import { Link } from "react-router";
import MainLayout from "@/components/MainLayout";
import { FileText, Check, ArrowLeft, Building2 } from "lucide-react";

export default function ContractPage() {
  const turquoisePanel = (
    <div className="space-y-5">
      <Link
        to="/legal"
        className="flex items-center gap-2 text-white/80 text-sm hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к выбору
      </Link>

      <div className="flex items-center gap-3">
        <Building2 className="w-6 h-6 text-white" />
        <h2 className="text-lg font-bold text-white">
          Заключение договора
        </h2>
      </div>

      <p className="text-white/80 text-sm leading-relaxed">
        Для заключения договора на регулярное обслуживание заполните
        форму справа. Наш менеджер свяжется с вами в течение 1 рабочего
        дня.
      </p>

      <div className="bg-white/20 rounded-lg p-4 space-y-2">
        <h3 className="text-white text-sm font-medium">Преимущества</h3>
        {[
          "Индивидуальные цены",
          "Отсрочка платежа до 30 дней",
          "Персональный менеджер",
          "Электронный документооборот",
          "Приоритетная обработка",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-white/80 text-xs">
            <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <MainLayout turquoiseContent={turquoisePanel}>
      <div className="p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#00c9a7]" />
          Форма заключения договора
        </h3>

        <form className="space-y-4 bg-white p-6 rounded-xl border border-[#e5e5e5]">
          <div>
            <label className="text-sm text-[#666] block mb-1">
              Полное наименование организации *
            </label>
            <input
              type="text"
              placeholder="ООО «Медицинский центр»"
              className="w-full h-10 px-3 rounded-lg border border-[#e5e5e5] text-sm text-[#333] focus:border-[#00c9a7] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[#666] block mb-1">ИНН *</label>
              <input
                type="text"
                placeholder="1234567890"
                className="w-full h-10 px-3 rounded-lg border border-[#e5e5e5] text-sm text-[#333] focus:border-[#00c9a7] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm text-[#666] block mb-1">КПП</label>
              <input
                type="text"
                placeholder="123456789"
                className="w-full h-10 px-3 rounded-lg border border-[#e5e5e5] text-sm text-[#333] focus:border-[#00c9a7] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[#666] block mb-1">
              Контактное лицо *
            </label>
            <input
              type="text"
              placeholder="ФИО"
              className="w-full h-10 px-3 rounded-lg border border-[#e5e5e5] text-sm text-[#333] focus:border-[#00c9a7] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[#666] block mb-1">Телефон *</label>
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                className="w-full h-10 px-3 rounded-lg border border-[#e5e5e5] text-sm text-[#333] focus:border-[#00c9a7] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm text-[#666] block mb-1">Email *</label>
              <input
                type="email"
                placeholder="email@company.ru"
                className="w-full h-10 px-3 rounded-lg border border-[#e5e5e5] text-sm text-[#333] focus:border-[#00c9a7] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[#666] block mb-1">
              Предполагаемый объём исследований
            </label>
            <select className="w-full h-10 px-3 rounded-lg border border-[#e5e5e5] text-sm text-[#333] focus:border-[#00c9a7] focus:outline-none">
              <option>до 50 в месяц</option>
              <option>50-100 в месяц</option>
              <option>100-200 в месяц</option>
              <option>более 200 в месяц</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[#666] block mb-1">
              Дополнительная информация
            </label>
            <textarea
              placeholder="Опишите ваши потребности..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-[#e5e5e5] text-sm text-[#333] focus:border-[#00c9a7] focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input type="checkbox" className="mt-0.5" required />
            <span className="text-xs text-[#666]">
              Я согласен на обработку персональных данных и ознакомлен с{" "}
              <a href="#" className="text-[#00c9a7] hover:underline">
                политикой конфиденциальности
              </a>
            </span>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-gradient-accent text-white font-semibold text-sm hover:shadow-md transition-shadow"
          >
            Отправить заявку на договор
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
