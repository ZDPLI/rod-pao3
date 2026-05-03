import { db } from "./connection";
import { categories, services, contents, settings, users } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Seed demo admin user
  db.insert(users).values({
    unionId: "demo-admin",
    name: "Администратор",
    email: "admin@rod.ru",
    role: "admin",
  }).run();
  console.log("Demo admin user created");

  // Seed categories
  const catData = [
    { name: "ПАИ без ИГХ — основные", slug: "bez-igh-osnovnye", description: "Прижизненные патолого-анатомические исследования основных органов без применения ИГХ", icon: "Microscope", sortOrder: 1 },
    { name: "ПАИ без ИГХ — специальные", slug: "bez-igh-specialnye", description: "Прижизненные патолого-анатомические исследования специальных органов и тканей без применения ИГХ", icon: "Microscope", sortOrder: 2 },
    { name: "ПАИ без ИГХ — дополнительные", slug: "bez-igh-dopolnitelnye", description: "Дополнительные патолого-анатомические исследования, биопсии и пересмотры без ИГХ", icon: "Microscope", sortOrder: 3 },
    { name: "ПАИ с применением ИГХ", slug: "s-igh", description: "Прижизненные патолого-анатомические исследования с иммуногистохимическими методами", icon: "FlaskConical", sortOrder: 4 },
    { name: "Цитологическая лаборатория", slug: "tsitologiya", description: "Консультативные препараты цитологической лаборатории", icon: "Search", sortOrder: 5 },
  ];

  for (const cat of catData) {
    db.insert(categories).values(cat).run();
  }
  console.log("Categories seeded.");

  // Seed services — цены из Приложения №2 к Договору
  const svcData = [
    { categoryId: 1, name: "ПАИ удаленной матки с придатками", slug: "matka-pridatki", shortDescription: "Операционный материал тканей удаленной матки с придатками", description: "Патолого-анатомическое исследование операционного материала тканей удаленной матки с придатками (без ИГХ).", price: "4 700 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 1 },
    { categoryId: 1, name: "ПАИ кишки с опухолью", slug: "kishka-opuhol", shortDescription: "Биопсийный (операционный) материал брюшины", description: "Патолого-анатомическое исследование биопсийного (операционного) материала брюшины (кишка с опухолью) (без ИГХ).", price: "4 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 2 },
    { categoryId: 1, name: "ПАИ желудка", slug: "zheludok", shortDescription: "Операционный материал желудка", description: "Патолого-анатомическое исследование операционного материала желудка (без ИГХ).", price: "4 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 3 },
    { categoryId: 1, name: "ПАИ яичника", slug: "yaichnik", shortDescription: "Биопсийный (операционный) материал яичника", description: "Патолого-анатомическое исследование биопсийного (операционного) материала яичника (без ИГХ).", price: "4 300 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 4 },
    { categoryId: 1, name: "ПАИ молочной железы (без ИГХ)", slug: "molochnaya-zheleza", shortDescription: "Операционный материал молочной железы", description: "Патолого-анатомическое исследование операционного материала молочной железы (без ИГХ).", price: "5 000 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 5 },
    { categoryId: 1, name: "ПАИ щитовидной железы", slug: "shchitovidnaya", shortDescription: "Биопсийный материал ткани щитовидной железы", description: "Патолого-анатомическое исследование биопсийного материала ткани щитовидной железы (без ИГХ).", price: "7 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 6 },
    { categoryId: 1, name: "ПАИ суставной сумки / капсулы сустава", slug: "sustav", shortDescription: "Биопсийный материал суставной сумки или капсулы", description: "Патолого-анатомическое исследование биопсийного материала суставной сумки или капсулы сустава (без ИГХ).", price: "7 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 7 },
    { categoryId: 1, name: "ПАИ ТУР простаты", slug: "tur-prostaty", shortDescription: "Трансуретральная резекция простаты", description: "Патолого-анатомическое исследование биопсийного (операционного) материала ТУР простаты (без ИГХ).", price: "7 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 8 },
    { categoryId: 2, name: "ПАИ кожи", slug: "kozha", shortDescription: "Биопсийный (операционный) материал кожи", description: "Патолого-анатомическое исследование биопсийного (операционного) материала кожи (без ИГХ).", price: "2 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 1 },
    { categoryId: 2, name: "ПАИ шейки матки", slug: "sheika-matki", shortDescription: "Биопсийный (операционный) материал шейки матки", description: "Патолого-анатомическое исследование биопсийного (операционного) материала шейки матки (без ИГХ).", price: "2 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 2 },
    { categoryId: 2, name: "ПАИ биопсии почки", slug: "pochka", shortDescription: "Биопсия (операционный материал) почки", description: "Патолого-анатомическое исследование биопсии почки (операционного материала почки) (без ИГХ).", price: "2 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 3 },
    { categoryId: 2, name: "ПАИ тканей полости рта", slug: "polost-rta", shortDescription: "Биопсийный материал тканей полости рта", description: "Патолого-анатомическое исследование биопсийного материала тканей полости рта (без ИГХ).", price: "2 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 4 },
    { categoryId: 2, name: "ПАИ лимфоузла (без ИГХ)", slug: "limfouzel-bez-igh", shortDescription: "Биопсийный материал лимфоузла", description: "Патолого-анатомическое исследование биопсийного материала лимфоузла (без ИГХ).", price: "2 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 5 },
    { categoryId: 2, name: "ПАИ предстательной железы (операционный, без ИГХ)", slug: "predstatelnaya-bez-igh", shortDescription: "Операционный материал предстательной железы", description: "Патолого-анатомическое исследование операционного материала предстательной железы (без ИГХ).", price: "3 800 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 6 },
    { categoryId: 2, name: "ПАИ яичника, семенного канала и придатков", slug: "yaichnik-semennoy-kanal", shortDescription: "Биопсийный материал яичника, семенного канала и придатков", description: "Патолого-анатомическое исследование биопсийного материала яичника, семенного канала и придатков (без ИГХ).", price: "3 800 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 7 },
    { categoryId: 2, name: "ПАИ мочевого пузыря (биопсия)", slug: "mochevoy-puzir-biopsiya", shortDescription: "Биопсийный материал мочевого пузыря", description: "Патолого-анатомическое исследование биопсийного материала мочевого пузыря (без ИГХ).", price: "4 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 8 },
    { categoryId: 2, name: "ПАИ печени", slug: "pechen", shortDescription: "Биопсийный материал печени", description: "Патолого-анатомическое исследование биопсийного материала печени (без ИГХ).", price: "4 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 9 },
    { categoryId: 2, name: "ПАИ желчного пузыря", slug: "zhelchnyy-puzir", shortDescription: "Операционный материал желчного пузыря", description: "Патолого-анатомическое исследование операционного материала желчного пузыря (без ИГХ).", price: "2 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 10 },
    { categoryId: 2, name: "ПАИ удаленной кишки с опухолью", slug: "udalennaya-kishka-opuhol", shortDescription: "Операционный материал удаленной кишки с опухолью", description: "Патолого-анатомическое исследование операционного материала удаленной кишки с опухолью (без ИГХ).", price: "4 700 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 11 },
    { categoryId: 3, name: "ПАИ удаленного новообразования кишки (полип)", slug: "kishka-polip", shortDescription: "Биопсийный (операционный) материал удаленной опухоли кишки (полип)", description: "Патолого-анатомическое исследование биопсийного (операционного) материала удаленной опухоли кишки (полип) (без ИГХ).", price: "2 800 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 1 },
    { categoryId: 3, name: "ПАИ новообразования женских половых органов (соскобы)", slug: "soskobi", shortDescription: "Биопсийный (операционный) материал удаленного новообразования женских половых органов (соскобы)", description: "Патолого-анатомическое исследование биопсийного (операционного) материала удаленного новообразования женских половых органов (соскобы) (без ИГХ).", price: "2 800 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 2 },
    { categoryId: 3, name: "ПАИ толстоигольной биопсии простаты (6 флаконов)", slug: "biopsiya-prostaty-6", shortDescription: "Толстоигольная биопсия простаты (6 флаконов)", description: "Патолого-анатомическое исследование биопсийного (операционного) материала — толстоигольная биопсия простаты (6 флаконов) (без ИГХ).", price: "3 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновые блоки, направление", sortOrder: 3 },
    { categoryId: 3, name: "ПАИ толстоигольной биопсии простаты (8–14 флаконов)", slug: "biopsiya-prostaty-8-14", shortDescription: "Толстоигольная биопсия простаты (8–14 флаконов)", description: "Патолого-анатомическое исследование биопсийного (операционного) материала — толстоигольная биопсия простаты (8–14 флаконов) (без ИГХ).", price: "5 300 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновые блоки, направление", sortOrder: 4 },
    { categoryId: 3, name: "ПАИ ТУР мочевого пузыря (до 2-х стекол)", slug: "tur-mochevoy", shortDescription: "ТУР мочевого пузыря (до 2-х стекол)", description: "Патолого-анатомическое исследование биопсийного (операционного) материала — ТУР мочевого пузыря (до 2-х стекол) (без ИГХ).", price: "2 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 5 },
    { categoryId: 3, name: "ПАИ мочевого пузыря", slug: "mochevoy-puzir", shortDescription: "Биопсийный (операционный) материал мочевого пузыря", description: "Патолого-анатомическое исследование биопсийного (операционного) материала мочевого пузыря (без ИГХ).", price: "2 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 6 },
    { categoryId: 3, name: "ПАИ костной ткани", slug: "kostnaya-tkan", shortDescription: "Биопсийный материал костной ткани", description: "Патолого-анатомическое исследование биопсийного материала костной ткани (без ИГХ).", price: "2 500 руб.", duration: "5-7 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 7 },
    { categoryId: 3, name: "ПАИ (дополнительно 1 стекло)", slug: "dop-steklo", shortDescription: "Дополнительно 1 стекло к исследованию", description: "Патолого-анатомическое исследование биопсийного материала (дополнительно 1 стекло).", price: "500 руб.", duration: "3-5 рабочих дней", requirements: "Ранее проведенное исследование", sortOrder: 8 },
    { categoryId: 3, name: "Пересмотр результатов исследования (до 5 стекол)", slug: "peresmotr-5-stekol", shortDescription: "Пересмотр результатов исследования до 5 стекол", description: "Пересмотр результатов исследования до 5 стекол.", price: "2 000 руб.", duration: "3-5 рабочих дней", requirements: "Стекла, направление", sortOrder: 9 },
    { categoryId: 4, name: "ПАИ молочной железы (с ИГХ)", slug: "molochnaya-igh", shortDescription: "Операционный материал молочной железы с ИГХ", description: "Патолого-анатомическое исследование операционного материала молочной железы (с ИГХ).", price: "8 000 руб.", duration: "7-10 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 1 },
    { categoryId: 4, name: "ПАИ лимфоузла (с ИГХ)", slug: "limfouzel-igh", shortDescription: "Операционный материал лимфоузла с ИГХ", description: "Патолого-анатомическое исследование операционного материала лимфоузла (с ИГХ).", price: "18 000 руб.", duration: "7-10 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 2 },
    { categoryId: 4, name: "ПАИ предстательной железы (1 стекло, с ИГХ)", slug: "predstatelnaya-igh", shortDescription: "Операционный материал предстательной железы (1 стекло) с ИГХ", description: "Патолого-анатомическое исследование операционного материала предстательной железы (1 стекло, с ИГХ).", price: "4 000 руб.", duration: "7-10 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 3 },
    { categoryId: 4, name: "ПАИ матки (с ИГХ)", slug: "matka-igh", shortDescription: "Операционный материал матки с ИГХ", description: "Патолого-анатомическое исследование операционного материала матки (с ИГХ).", price: "5 000 руб.", duration: "7-10 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 4 },
    { categoryId: 4, name: "ПАИ яичника (с ИГХ)", slug: "yaichnik-igh", shortDescription: "Операционный материал яичника с ИГХ", description: "Патолого-анатомическое исследование операционного материала яичника (с ИГХ).", price: "5 000 руб.", duration: "7-10 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 5 },
    { categoryId: 4, name: "Иммуногистохимическое исследование (1 маркер)", slug: "marker-1", shortDescription: "ИГХ 1 маркер", description: "Иммуногистохимическое исследование (1 маркер).", price: "2 500 руб.", duration: "5-7 рабочих дней", requirements: "Стекла, направление", sortOrder: 6 },
    { categoryId: 4, name: "ПАИ опухоли при невыявленном первичном очаге (с ИГХ)", slug: "neyavnyy-pervichnyy-ochag", shortDescription: "Опухоль при невыявленном первичном очаге (с ИГХ)", description: "Патолого-анатомическое исследование операционного материала опухоли при невыявленном первичном очаге (с ИГХ).", price: "17 500 руб.", duration: "10-15 рабочих дней", requirements: "Формалиновый блок, направление", sortOrder: 7 },
    { categoryId: 5, name: "Консультативные препараты (цитология)", slug: "konsultativnye-preparaty", shortDescription: "Консультативные препараты цитологической лаборатории", description: "Консультативные препараты цитологической лаборатории.", price: "700 руб.", duration: "2-3 рабочих дня", requirements: "Препараты, направление", sortOrder: 1 },
  ];

  for (const svc of svcData) {
    db.insert(services).values(svc).run();
  }
  console.log("Services seeded.");

  // Seed settings
  const settingData = [
    { key: "orgName", value: "ГБУЗ \"РОД\"" },
    { key: "orgFullName", value: "ГБУЗ \"Республиканский онкологический диспансер\"" },
    { key: "address", value: "РСО-Алания, г. Владикавказ, ул. Титова, д. 1" },
    { key: "phone", value: "+7 (8672) 55-55-55" },
    { key: "email", value: "info@rod-ru.ru" },
    { key: "workHours", value: "Пн-Пт: 8:00-17:00, Сб: 9:00-14:00" },
    { key: "latitude", value: "43.0367" },
    { key: "longitude", value: "44.6678" },
  ];

  for (const s of settingData) {
    db.insert(settings).values(s).run();
  }
  console.log("Settings seeded.");

  // Seed contents
  db.insert(contents).values({
    key: "about",
    title: "О патологоанатомическом отделении",
    body: "Патологоанатомическое отделение ГБУЗ «Республиканский онкологический диспансер» является ведущим учреждением Северной Осетии.",
  }).run();

  db.insert(contents).values({
    key: "contacts",
    title: "Контактная информация",
    body: "Адрес: РСО-Алания, г. Владикавказ, ул. Титова, д. 1\nТелефон: +7 (8672) 55-55-55",
  }).run();

  console.log("Contents seeded.");
  console.log("Done.");
  process.exit(0);
}

seed();
