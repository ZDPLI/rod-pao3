import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import {
  estimateData,
  calculateDiscount,
  type ResearchItem,
} from "@/lib/estimateData";
import {
  Calculator,
  ChevronDown,
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

interface CartItem {
  research: ResearchItem;
  quantity: number;
}

export default function EstimatePage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const selectedCat = estimateData.find((c) => c.id === selectedCategory);

  const addToCart = (research: ResearchItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.research.id === research.id);
      if (existing) {
        return prev.map((i) =>
          i.research.id === research.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { research, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.research.id === id
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.research.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, i) => sum + i.research.price * i.quantity,
    0
  );
  const discount = calculateDiscount(subtotal);
  const discountAmount = discount ? (subtotal * discount.percent) / 100 : 0;
  const total = subtotal - discountAmount;

  const turquoisePanel = (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-4">
        <Calculator className="w-6 h-6 text-white" />
        <h2 className="text-lg font-bold text-white">
          Рассчитать смету на исследование
        </h2>
      </div>

      <div>
        <label className="text-white/80 text-sm mb-2 block">
          Вид исследования
        </label>
        <div className="relative">
          <button
            onClick={() => setCatDropdownOpen(!catDropdownOpen)}
            className="w-full h-11 px-4 pr-10 rounded-lg bg-white text-[#333] text-sm text-left flex items-center justify-between"
          >
            {selectedCat?.name || "Выберите вид исследования"}
            <ChevronDown
              className={`w-4 h-4 text-[#999] transition-transform ${
                catDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {catDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-20">
              {estimateData.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCatDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-sm text-left text-[#333] hover:bg-[#00c9a7]/10 hover:text-[#00c9a7]"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="bg-white/20 rounded-lg p-4 space-y-2">
          <h3 className="text-white text-sm font-medium flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Корзина ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h3>
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.research.id}
                className="flex items-center justify-between text-xs text-white/90"
              >
                <span className="truncate flex-1 mr-2">
                  {item.research.name}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item.research.id, -1)}
                    className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.research.id, 1)}
                    className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.research.id)}
                    className="ml-1 text-white/60 hover:text-white"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/20 pt-2 mt-2 space-y-1">
            <div className="flex justify-between text-xs text-white/80">
              <span>Подытог:</span>
              <span>{subtotal.toLocaleString("ru-RU")} ₽</span>
            </div>
            {discount && (
              <div className="flex justify-between text-xs text-white">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {discount.label}
                </span>
                <span>-{discountAmount.toLocaleString("ru-RU")} ₽</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-white border-t border-white/30 pt-1 mt-1">
              <span>ИТОГО:</span>
              <span>{total.toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>
          <Link
            to="/logistics"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white text-[#00c9a7] text-sm font-semibold mt-2 hover:bg-white/90"
          >
            Оформить доставку
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <MainLayout turquoiseContent={turquoisePanel} cartCount={cart.reduce((s, i) => s + i.quantity, 0)}>
      <div className="p-6">
        {selectedCategory ? (
          <div>
            <h3 className="text-lg font-semibold text-[#333] mb-1">
              {selectedCat?.name}
            </h3>
            <p className="text-sm text-[#888] mb-4">
              Выберите конкретные исследования и укажите количество
            </p>

            <div className="space-y-2">
              {selectedCat?.items.map((item) => {
                const cartItem = cart.find(
                  (c) => c.research.id === item.id
                );
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#e5e5e5] hover:border-[#00c9a7]/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="text-sm text-[#333] font-medium">
                        {item.name}
                      </div>
                      <div className="text-xs text-[#00c9a7] font-semibold mt-0.5">
                        {item.price.toLocaleString("ru-RU")} ₽
                      </div>
                    </div>

                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full bg-[#f0f0f0] flex items-center justify-center hover:bg-[#00c9a7]/20 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-[#333]" />
                        </button>
                        <span className="text-sm font-semibold text-[#333] w-6 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-[#f0f0f0] flex items-center justify-center hover:bg-[#00c9a7]/20 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-[#333]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00c9a7] text-white text-sm hover:bg-[#00b899] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Добавить
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center mt-20">
            <Calculator className="w-16 h-16 text-[#ccc] mb-4" />
            <h3 className="text-xl font-semibold text-[#333] mb-2">
              Калькулятор стоимости
            </h3>
            <p className="text-sm text-[#888] max-w-md mb-6">
              Выберите вид исследования в левой панели, чтобы увидеть
              список доступных маркеров и исследований с ценами.
            </p>
            <div className="grid grid-cols-2 gap-3 text-left">
              {estimateData.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="p-3 bg-white rounded-lg border border-[#e5e5e5] text-sm text-[#333] hover:border-[#00c9a7] hover:text-[#00c9a7] transition-colors text-left"
                >
                  {cat.name}
                  <span className="block text-xs text-[#888] mt-1">
                    {cat.items.length} исследований
                  </span>
                </button>
              ))}
            </div>

            {/* Discount info */}
            <div className="mt-8 p-4 bg-white rounded-lg border border-[#e5e5e5] max-w-md w-full">
              <h4 className="text-sm font-semibold text-[#333] mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#00c9a7]" />
                Прогрессивные скидки
              </h4>
              <div className="space-y-2">
                {[
                  { t: 5000, p: 5 },
                  { t: 15000, p: 10 },
                  { t: 30000, p: 15 },
                  { t: 50000, p: 20 },
                ].map((d) => (
                  <div
                    key={d.t}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-[#666]">
                      При заказе от {d.t.toLocaleString("ru-RU")} ₽
                    </span>
                    <span className="text-[#00c9a7] font-semibold">
                      -{d.p}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
