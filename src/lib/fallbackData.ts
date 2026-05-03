export const fallbackCategories = [
  { id: 2, name: "Гистологические исследования", slug: "gistologiya", description: "Микроскопическое исследование тканей для диагностики заболеваний", icon: "Microscope", sortOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: "Цитологические исследования", slug: "tsitologiya", description: "Исследование отдельных клеток для выявления патологий", icon: "Search", sortOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: "Морфологическая диагностика", slug: "morfologicheskaya-diagnostika", description: "Комплексная диагностика на основе морфологических исследований", icon: "Stethoscope", sortOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, name: "Иммуногистохимические исследования", slug: "immunogistokhimiya", description: "Выявление специфических антигенов в тканях", icon: "FlaskConical", sortOrder: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

export const fallbackServices = [
  { id: 4, categoryId: 2, name: "Гистологическое исследование биоптата", slug: "gistologiya-bioptat", shortDescription: "Исследование образцов тканей, полученных при биопсии", description: "Микроскопическое исследование тканей, полученных при биопсии, операции. Включает окраску гематоксилином-эозином и при необходимости специальные окраски.", price: "от 1 500 руб.", duration: "3-5 рабочих дней", requirements: "Направление от лечащего врача, материал в 10% формалине", isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, categoryId: 2, name: "Экспресс-гистологическое исследование", slug: "ekspress-gistologiya", shortDescription: "Быстрое гистологическое исследование во время операции", description: "Внутриоперационное гистологическое исследование методом замораживания. Результат готов в течение 15-20 минут.", price: "от 3 000 руб.", duration: "15-20 минут", requirements: "Предварительная договорённость, материал свежий", isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, categoryId: 2, name: "Специальные гистохимические окраски", slug: "gistokhimicheskie-okraski", shortDescription: "Дополнительные окраски для уточнения диагноза", description: "Применение специальных методик окрашивания (PAS, трихромные окраски, сильверимпрегнация и др.) для выявления специфических структур и веществ в тканях.", price: "от 800 руб.", duration: "1-2 рабочих дня", requirements: "Направление от лечащего врача", isActive: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, categoryId: 3, name: "Цитологическое исследование мазка", slug: "tsitologiya-mazok", shortDescription: "Исследование клеточного состава мазка", description: "Микроскопическое исследование мазков с различных поверхностей и органов (шейка матки, бронхи, щитовидная железа и др.) для выявления атипичных клеток.", price: "от 900 руб.", duration: "2-3 рабочих дня", requirements: "Направление от лечащего врача", isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, categoryId: 3, name: "Тонкоигольная аспирационная биопсия (ТАБ)", slug: "tonkoigolnaya-biopsiya", shortDescription: "Пункционная биопсия под контролем УЗИ", description: "Получение материала для цитологического исследования путём пункции образования тонкой иглой под контролем ультразвукового исследования.", price: "от 2 000 руб.", duration: "2-3 рабочих дня", requirements: "Направление от лечащего врача, УЗИ заключение", isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: 11, categoryId: 5, name: "Комплексная морфологическая диагностика опухоли", slug: "kompleksnaya-diagnostika-ukholi", shortDescription: "Полная диагностика новообразований", description: "Комплексное исследование опухоли, включающее гистологическое, цитологическое и иммуногистохимическое исследования.", price: "от 5 000 руб.", duration: "7-10 рабочих дней", requirements: "Направление от онколога, биоптат или операционный материал", isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 12, categoryId: 5, name: "Морфологическая верификация диагноза", slug: "verifikatsiya-diagnosta", shortDescription: "Подтверждение или уточнение клинического диагноза", description: "Пересмотр морфологических препаратов, полученных в других учреждениях, с целью верификации или уточнения диагноза (second opinion).", price: "от 3 500 руб.", duration: "5-7 рабочих дней", requirements: "Стёкла с препаратами, заключение другого учреждения", isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: 13, categoryId: 6, name: "Иммуногистохимическое исследование (ИГХ)", slug: "immunogistokhimiya-ikh", shortDescription: "Выявление маркеров в тканях", description: "Иммуногистохимическое исследование с использованием панелей антител для уточнения гистогенеза опухоли, определения прогностических и предиктивных маркеров.", price: "от 2 500 руб.", duration: "3-5 рабочих дней", requirements: "Направление от онколога, гистологические препараты", isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
];

export const fallbackSettings: Record<string, string> = {
  orgName: "ГБУЗ \"РОД\"",
  orgFullName: "ГБУЗ \"Республиканский онкологический диспансер\"",
  address: "РСО-Алания, г. Владикавказ, ул. Титова, д. 1",
  phone: "+7 (8672) 55-55-55",
  email: "info@rod-ru.ru",
  workHours: "Пн-Пт: 8:00-17:00, Сб: 9:00-14:00",
  latitude: "43.0367",
  longitude: "44.6678",
};
