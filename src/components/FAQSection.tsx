import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Какие услуги оказывает патологоанатомическое отделение ГБУЗ РОД?",
    answer:
      'Патологоанатомическое отделение ГБУЗ "РОД" оказывает полный спектр диагностических услуг: гистологические и цитологические исследования, морфологическую диагностику опухолей, иммуногистохимические исследования (ИГХ).',
  },
  {
    question: "Как добраться до ГБУЗ РОД во Владикавказе?",
    answer:
      'ГБУЗ "РОД" расположен по адресу: Республика Северная Осетия-Алания, г. Владикавказ, ул. Титова, д. 1. Координаты для навигатора: 43.0367, 44.6678. На нашем сайте вы можете построить маршрут через Яндекс.Карты.',
  },
  {
    question: "Что такое экспресс-гистологическое исследование?",
    answer:
      "Экспресс-гистологическое исследование — это внутриоперационное исследование тканей методом замораживания. Результат готов в течение 15-20 минут, что позволяет хирургу скорректировать объём оперативного вмешательства непосредственно во время операции.",
  },
  {
    question: "Как записаться на исследование в ГБУЗ РОД?",
    answer:
      'Записаться на исследование можно по телефону +7 (8672) 55-55-55 в рабочие часы: понедельник-пятница с 8:00 до 17:00, суббота с 9:00 до 14:00. Предварительное направление от лечащего врача обязательно для большинства исследований.',
  },
  {
    question: "Сколько стоит гистологическое исследование биоптата?",
    answer:
      "Стоимость гистологического исследования биоптата начинается от 1 500 рублей. Срок выполнения — 3-5 рабочих дней. Для уточнения цен на другие исследования рекомендуем связаться с приёмной по телефону.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-20 px-6 max-w-3xl mx-auto"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="text-center mb-12">
        <span className="text-xs font-mono text-[#00bfa5] uppercase tracking-widest">
          FAQ
        </span>
        <h2 className="text-3xl font-bold text-[#212121] mt-2 mb-4">
          Часто задаваемые вопросы
        </h2>
        <p className="text-sm text-[#888]">
          Ответы на популярные вопросы о патологоанатомических услугах
        </p>
      </div>

      <div className="space-y-3">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg bg-white border border-[#e5e5e5] overflow-hidden"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left p-4 flex items-center justify-between hover:bg-[#fafafa] transition-colors"
            >
              <span
                className="text-sm font-medium text-[#212121] faq-question"
                itemProp="name"
              >
                {faq.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#ccc] flex-shrink-0 ml-3 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <div
                className="px-4 pb-4 border-t border-[#e5e5e5] pt-3"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p className="text-sm text-[#666] leading-relaxed" itemProp="text">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
