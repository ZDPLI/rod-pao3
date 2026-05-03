export interface ResearchItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface ResearchCategory {
  id: string;
  name: string;
  items: ResearchItem[];
}

// Данные из Приложения №2 к Договору (ГБУЗ "РОД")
export const estimateData: ResearchCategory[] = [
  {
    id: "bez-igh",
    name: "Без применения ИГХ",
    items: [
      { id: "matka-pridatki", name: "ПАИ операционного материала тканей удаленной матки с придатками", price: 4700, category: "Без применения ИГХ" },
      { id: "kishka-opuhol", name: "ПАИ биопсийного (операционного) материала брюшины (кишка с опухолью)", price: 4500, category: "Без применения ИГХ" },
      { id: "zheludok", name: "ПАИ операционного материала желудка", price: 4500, category: "Без применения ИГХ" },
      { id: "yaichnik", name: "ПАИ биопсийного (операционного) материала яичника", price: 4300, category: "Без применения ИГХ" },
      { id: "kishka-polip", name: "ПАИ биопсийного (операционного) материала удаленной опухоли кишки (полип)", price: 2800, category: "Без применения ИГХ" },
      { id: "kozha", name: "ПАИ биопсийного (операционного) материала кожи", price: 2500, category: "Без применения ИГХ" },
      { id: "sheika-matki", name: "ПАИ биопсийного (операционного) материала шейки матки", price: 2500, category: "Без применения ИГХ" },
      { id: "soskobi", name: "ПАИ биопсийного (операционного) материала удаленного новообразования женских половых органов (соскобы)", price: 2800, category: "Без применения ИГХ" },
      { id: "biopsiya-prostaty-6", name: "ПАИ толстоигольная биопсия простаты (6 флаконов)", price: 3500, category: "Без применения ИГХ" },
      { id: "biopsiya-prostaty-8-14", name: "ПАИ толстоигольная биопсия простаты (8–14 флаконов)", price: 5300, category: "Без применения ИГХ" },
      { id: "tur-prostaty", name: "ПАИ ТУР простаты", price: 7500, category: "Без применения ИГХ" },
      { id: "tur-mochevoy", name: "ПАИ ТУР мочевого пузыря (до 2-х стекол)", price: 2500, category: "Без применения ИГХ" },
      { id: "mochevoy-puzir", name: "ПАИ биопсийного (операционного) материала мочевого пузыря", price: 2500, category: "Без применения ИГХ" },
      { id: "molochnaya-zheleza", name: "ПАИ операционного материала молочной железы", price: 5000, category: "Без применения ИГХ" },
      { id: "pochka", name: "ПАИ биопсии почки (операционного материала почки)", price: 2500, category: "Без применения ИГХ" },
      { id: "polost-rta", name: "ПАИ биопсийного материала тканей полости рта", price: 2500, category: "Без применения ИГХ" },
      { id: "limfouzel-bez-igh", name: "ПАИ биопсийного материала лимфоузла", price: 2500, category: "Без применения ИГХ" },
      { id: "predstatelnaya-bez-igh", name: "ПАИ операционного материала предстательной железы", price: 3800, category: "Без применения ИГХ" },
      { id: "yaichnik-semennoy-kanal", name: "ПАИ биопсийного материала яичника, семенного канала и придатков", price: 3800, category: "Без применения ИГХ" },
      { id: "mochevoy-puzir-biopsiya", name: "ПАИ биопсийного материала мочевого пузыря", price: 4500, category: "Без применения ИГХ" },
      { id: "dop-steklo", name: "ПАИ биопсийного материала (дополнительно 1 стекло)", price: 500, category: "Без применения ИГХ" },
      { id: "peresmotr-5-stekol", name: "Пересмотр результатов исследования до 5 стекол", price: 2000, category: "Без применения ИГХ" },
      { id: "shchitovidnaya", name: "ПАИ биопсийного материала ткани щитовидной железы", price: 7500, category: "Без применения ИГХ" },
      { id: "sustav", name: "ПАИ биопсийного материала суставной сумки или капсулы сустава", price: 7500, category: "Без применения ИГХ" },
      { id: "kostnaya-tkan", name: "ПАИ биопсийного материала костной ткани", price: 2500, category: "Без применения ИГХ" },
      { id: "pechen", name: "ПАИ биопсийного материала печени", price: 4500, category: "Без применения ИГХ" },
      { id: "zhelchnyy-puzir", name: "ПАИ операционного материала желчного пузыря", price: 2500, category: "Без применения ИГХ" },
      { id: "udalennaya-kishka-opuhol", name: "ПАИ операционного материала удаленной кишки с опухолью", price: 4700, category: "Без применения ИГХ" },
    ],
  },
  {
    id: "s-igh",
    name: "С применением ИГХ",
    items: [
      { id: "molochnaya-igh", name: "ПАИ операционного материала молочной железы (с ИГХ)", price: 8000, category: "С применением ИГХ" },
      { id: "limfouzel-igh", name: "ПАИ операционного материала лимфоузла (с ИГХ)", price: 18000, category: "С применением ИГХ" },
      { id: "predstatelnaya-igh", name: "ПАИ операционного материала предстательной железы (1 стекло, с ИГХ)", price: 4000, category: "С применением ИГХ" },
      { id: "matka-igh", name: "ПАИ операционного материала матки (с ИГХ)", price: 5000, category: "С применением ИГХ" },
      { id: "yaichnik-igh", name: "ПАИ операционного материала яичника (с ИГХ)", price: 5000, category: "С применением ИГХ" },
      { id: "marker-1", name: "Иммуногистохимическое исследование (1 маркер)", price: 2500, category: "С применением ИГХ" },
      { id: "neyavnyy-pervichnyy-ochag", name: "ПАИ операционного материала опухоли при невыявленном первичном очаге (с ИГХ)", price: 17500, category: "С применением ИГХ" },
    ],
  },
  {
    id: "tsitologiya",
    name: "Цитологическая лаборатория",
    items: [
      { id: "konsultativnye-preparaty", name: "Консультативные препараты", price: 700, category: "Цитологическая лаборатория" },
    ],
  },
];

// Discount rules
export interface DiscountRule {
  threshold: number;
  percent: number;
  label: string;
}

export const discountRules: DiscountRule[] = [
  { threshold: 50000, percent: 20, label: "Скидка 20% (от 50 000 ₽)" },
  { threshold: 30000, percent: 15, label: "Скидка 15% (от 30 000 ₽)" },
  { threshold: 15000, percent: 10, label: "Скидка 10% (от 15 000 ₽)" },
  { threshold: 5000, percent: 5, label: "Скидка 5% (от 5 000 ₽)" },
];

export function calculateDiscount(subtotal: number): DiscountRule | null {
  for (const rule of discountRules) {
    if (subtotal >= rule.threshold) return rule;
  }
  return null;
}
