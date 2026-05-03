interface SchemaMarkupProps {
  type: "home" | "services" | "admin";
}

export default function SchemaMarkup({ type }: SchemaMarkupProps) {
  const baseUrl = "https://f5nwmfdsxvy3w.kimi.page";

  // Organization + LocalBusiness schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalOrganization",
        "@id": `${baseUrl}/#organization`,
        name: 'ГБУЗ "РОД" ПАО',
        alternateName: 'ГБУЗ "Республиканский онкологический диспансер"',
        description:
          "Патологоанатомическое отделение государственного бюджетного учреждения здравоохранения. Полный спектр патологоанатомических услуг: гистология, цитология, иммуногистохимические исследования (ИГХ).",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
        },
        image: {
          "@type": "ImageObject",
          url: `${baseUrl}/og-image.jpg`,
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "RU",
          addressRegion: "Республика Северная Осетия-Алания",
          addressLocality: "Владикавказ",
          streetAddress: "ул. Титова, д. 1",
          postalCode: "362000",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "43.0367",
          longitude: "44.6678",
        },
        telephone: "+78672555555",
        email: "info@rod-ru.ru",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ],
            opens: "08:00",
            closes: "17:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "09:00",
            closes: "14:00",
          },
        ],
        medicalSpecialty: {
          "@type": "MedicalSpecialty",
          name: "Pathology",
        },
        areaServed: {
          "@type": "City",
          name: "Владикавказ",
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: "Республика Северная Осетия-Алания",
          },
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Патологоанатомические услуги",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: "Гистологические исследования",
                procedureType: "Гистология",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: "Цитологические исследования",
                procedureType: "Цитология",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: "Комплексная морфологическая диагностика опухоли",
                procedureType: "Онкодиагностика",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: "Иммуногистохимическое исследование",
                procedureType: "Иммуногистохимия",
              },
            },
          ],
        },
        priceRange: "$$",
        paymentAccepted: "Наличные, банковские карты",
        currenciesAccepted: "RUB",
        isAccessibleForFree: false,
        publicAccess: true,
      },
    ],
  };

  // BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement:
      type === "home"
        ? [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: baseUrl,
            },
          ]
        : type === "services"
          ? [
              {
                "@type": "ListItem",
                position: 1,
                name: "Главная",
                item: baseUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Услуги на карте",
                item: `${baseUrl}/services`,
              },
            ]
          : [],
  };

  // FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Какие услуги оказывает патологоанатомическое отделение ГБУЗ РОД?",
        acceptedAnswer: {
          "@type": "Answer",
          text: 'Патологоанатомическое отделение ГБУЗ "РОД" оказывает полный спектр диагностических услуг: гистологические и цитологические исследования, морфологическую диагностику опухолей, иммуногистохимические исследования (ИГХ).',
        },
      },
      {
        "@type": "Question",
        name: "Как добраться до ГБУЗ РОД во Владикавказе?",
        acceptedAnswer: {
          "@type": "Answer",
          text: 'ГБУЗ "РОД" расположен по адресу: Республика Северная Осетия-Алания, г. Владикавказ, ул. Титова, д. 1. Координаты для навигатора: 43.0367, 44.6678. На нашем сайте вы можете построить маршрут через Яндекс.Карты.',
        },
      },
      {
        "@type": "Question",
        name: "Что такое экспресс-гистологическое исследование?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Экспресс-гистологическое исследование — это внутриоперационное исследование тканей методом замораживания. Результат готов в течение 15-20 минут, что позволяет хирургу скорректировать объём оперативного вмешательства непосредственно во время операции.",
        },
      },
      {
        "@type": "Question",
        name: "Как записаться на исследование в ГБУЗ РОД?",
        acceptedAnswer: {
          "@type": "Answer",
          text: 'Записаться на исследование можно по телефону +7 (8672) 55-55-55 в рабочие часы: понедельник-пятница с 8:00 до 17:00, суббота с 9:00 до 14:00. Предварительное направление от лечащего врача обязательно для большинства исследований.',
        },
      },
      {
        "@type": "Question",
        name: "Сколько стоит гистологическое исследование биоптата?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Стоимость гистологического исследования биоптата начинается от 1 500 рублей. Срок выполнения — 3-5 рабочих дней. Для уточнения цен на другие исследования рекомендуем связаться с приёмной по телефону.",
        },
      },
    ],
  };

  // Speakable schema
  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".hero-title", ".hero-description", ".faq-question"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
    </>
  );
}
