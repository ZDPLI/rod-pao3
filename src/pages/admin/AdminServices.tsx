import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { trpc } from "@/providers/trpc";
import { Plus, Pencil, Trash2, X, Check, List } from "lucide-react";

export default function AdminServices() {
  const utils = trpc.useUtils();
  const { data: services, isLoading } = trpc.service.list.useQuery();
  const { data: categories } = trpc.category.list.useQuery();

  const createMutation = trpc.service.create.useMutation({
    onSuccess: () => { utils.service.list.invalidate(); setShowForm(false); resetForm(); },
  });
  const updateMutation = trpc.service.update.useMutation({
    onSuccess: () => { utils.service.list.invalidate(); setEditingId(null); resetForm(); },
  });
  const deleteMutation = trpc.service.delete.useMutation({
    onSuccess: () => utils.service.list.invalidate(),
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<number | undefined>(undefined);
  const [form, setForm] = useState({ categoryId: 0, name: "", slug: "", description: "", shortDescription: "", price: "", duration: "", requirements: "", sortOrder: 0 });

  const resetForm = () => setForm({ categoryId: categories?.[0]?.id ?? 0, name: "", slug: "", description: "", shortDescription: "", price: "", duration: "", requirements: "", sortOrder: 0 });

  const startEdit = (svc: NonNullable<typeof services>[0]) => {
    setEditingId(svc.id);
    setForm({ categoryId: svc.categoryId, name: svc.name, slug: svc.slug, description: svc.description ?? "", shortDescription: svc.shortDescription ?? "", price: svc.price ?? "", duration: svc.duration ?? "", requirements: svc.requirements ?? "", sortOrder: svc.sortOrder });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editingId ? updateMutation.mutate({ id: editingId, ...form }) : createMutation.mutate(form);
  };

  const handleDelete = (id: number) => { if (confirm("Удалить услугу?")) deleteMutation.mutate({ id }); };

  const filteredServices = filterCategory ? services?.filter((s) => s.categoryId === filterCategory) : services;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-[#00bfa5]" />
            <h2 className="text-lg font-semibold text-[#212121]">Услуги</h2>
          </div>
          <div className="flex items-center gap-2">
            <select value={filterCategory ?? ""} onChange={(e) => setFilterCategory(e.target.value ? Number(e.target.value) : undefined)}
              className="px-3 py-2 rounded-md bg-white border border-[#e5e5e5] text-xs text-[#212121] focus:border-[#00bfa5] focus:outline-none">
              <option value="">Все категории</option>
              {categories?.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <button onClick={() => { setEditingId(null); resetForm(); setShowForm(!showForm); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-gradient-accent text-white text-xs font-semibold hover:shadow-md transition-shadow">
              <Plus className="w-4 h-4" />Добавить
            </button>
          </div>
        </div>

        {showForm && (
          <div className="rounded-lg bg-white border border-[#e5e5e5] p-4 max-h-[70vh] overflow-y-auto shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#212121]">{editingId ? "Редактировать" : "Новая услуга"}</h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-[#888] hover:text-[#212121]"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#888] block mb-1">Категория *</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none" required>
                  {categories?.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#888] block mb-1">Название *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none" required />
              </div>
              <div>
                <label className="text-xs text-[#888] block mb-1">Slug *</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none" required />
              </div>
              <div>
                <label className="text-xs text-[#888] block mb-1">Цена</label>
                <input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="от 1000 руб. / по запросу" className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none placeholder:text-[#ccc]" />
              </div>
              <div>
                <label className="text-xs text-[#888] block mb-1">Срок</label>
                <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="3-5 рабочих дней" className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none placeholder:text-[#ccc]" />
              </div>
              <div>
                <label className="text-xs text-[#888] block mb-1">Порядок</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-[#888] block mb-1">Краткое описание</label>
                <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-[#888] block mb-1">Полное описание</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none resize-none" rows={3} />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-[#888] block mb-1">Требования</label>
                <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none resize-none" rows={2} />
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="px-4 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-xs text-[#666] hover:text-[#212121]">Отмена</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-gradient-accent text-white text-xs font-semibold hover:shadow-md transition-shadow">
                  {editingId ? "Сохранить" : "Создать"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-lg bg-white border border-[#e5e5e5] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e5e5]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#888]">Название</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#888]">Категория</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#888]">Цена</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-[#888]">Статус</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#888]">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#888]">Загрузка...</td></tr>
              ) : filteredServices?.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#888]">Нет услуг</td></tr>
              ) : (
                filteredServices?.map((svc) => {
                  const cat = categories?.find((c) => c.id === svc.categoryId);
                  return (
                    <tr key={svc.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm text-[#212121]">{svc.name}</div>
                        {svc.shortDescription && <div className="text-xs text-[#888] truncate max-w-[200px]">{svc.shortDescription}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#f0fafa] text-[#00bfa5]">{cat?.name ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#888]">{svc.price ?? "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${svc.isActive ? "bg-[#00bfa5]/10 text-[#00bfa5]" : "bg-red-100 text-red-500"}`}>
                          {svc.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => startEdit(svc)} className="p-1.5 rounded-md text-[#888] hover:text-[#00bfa5] hover:bg-[#f0fafa] transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(svc.id)} className="p-1.5 rounded-md text-[#888] hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
