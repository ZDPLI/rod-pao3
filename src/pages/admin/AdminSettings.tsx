import AdminLayout from "./AdminLayout";
import { trpc } from "@/providers/trpc";
import { Settings, Save, MapPin, Phone, Clock, Building2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSettings() {
  const utils = trpc.useUtils();
  const { data: settingsList, isLoading } = trpc.settings.list.useQuery();
  const updateMutation = trpc.settings.update.useMutation({
    onSuccess: () => { utils.settings.list.invalidate(); setSaved(true); setTimeout(() => setSaved(false), 2000); },
  });

  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settingsList) {
      const map: Record<string, string> = {};
      settingsList.forEach((s) => { map[s.key] = s.value ?? ""; });
      setForm(map);
    }
  }, [settingsList]);

  const handleChange = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const handleSave = (key: string) => updateMutation.mutate({ key, value: form[key] ?? "" });
  const handleSaveAll = () => Object.entries(form).forEach(([key, value]) => updateMutation.mutate({ key, value }));

  const settingGroups = [
    { title: "Организация", icon: Building2, keys: ["orgName", "orgFullName"] },
    { title: "Контакты", icon: Phone, keys: ["phone", "email"] },
    { title: "Адрес и координаты", icon: MapPin, keys: ["address", "latitude", "longitude"] },
    { title: "Режим работы", icon: Clock, keys: ["workHours"] },
  ];

  const labels: Record<string, string> = {
    orgName: "Краткое название", orgFullName: "Полное название",
    phone: "Телефон", email: "Email",
    address: "Адрес", latitude: "Широта", longitude: "Долгота",
    workHours: "Часы работы",
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#00bfa5]" />
            <h2 className="text-lg font-semibold text-[#212121]">Настройки</h2>
          </div>
          <button onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-accent text-white text-xs font-semibold hover:shadow-md transition-shadow">
            <Save className="w-4 h-4" />{saved ? "Сохранено!" : "Сохранить все"}
          </button>
        </div>

        {isLoading ? (
          <div className="text-sm text-[#888]">Загрузка...</div>
        ) : (
          settingGroups.map((group) => (
            <div key={group.title} className="rounded-lg bg-white border border-[#e5e5e5] p-4">
              <div className="flex items-center gap-2 mb-4">
                <group.icon className="w-4 h-4 text-[#00bfa5]" />
                <h3 className="text-sm font-medium text-[#212121]">{group.title}</h3>
              </div>
              <div className="space-y-3">
                {group.keys.map((key) => (
                  <div key={key} className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-[#888] block mb-1">{labels[key] ?? key}</label>
                      <input type={key === "latitude" || key === "longitude" ? "number" : "text"}
                        step={key === "latitude" || key === "longitude" ? "0.0001" : undefined}
                        value={form[key] ?? ""} onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none" />
                    </div>
                    <button onClick={() => handleSave(key)}
                      className="px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-xs text-[#00bfa5] hover:border-[#00bfa5] transition-colors">
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <div className="rounded-lg bg-[#f5f5f5] border border-[#e5e5e5] p-4">
          <p className="text-xs text-[#888]">Настройки отображаются на главной странице сайта. Изменения применяются сразу после сохранения.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
