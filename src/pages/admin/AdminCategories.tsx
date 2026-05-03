import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { trpc } from "@/providers/trpc";
import { Plus, Pencil, Trash2, X, Check, FolderTree } from "lucide-react";

export default function AdminCategories() {
  const utils = trpc.useUtils();
  const { data: categories, isLoading } = trpc.category.list.useQuery();

  const createMutation = trpc.category.create.useMutation({
    onSuccess: () => { utils.category.list.invalidate(); setShowForm(false); resetForm(); },
  });
  const updateMutation = trpc.category.update.useMutation({
    onSuccess: () => { utils.category.list.invalidate(); setEditingId(null); resetForm(); },
  });
  const deleteMutation = trpc.category.delete.useMutation({
    onSuccess: () => utils.category.list.invalidate(),
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", icon: "Activity", sortOrder: 0 });

  const resetForm = () => setForm({ name: "", slug: "", description: "", icon: "Activity", sortOrder: 0 });

  const startEdit = (cat: NonNullable<typeof categories>[0]) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "", icon: cat.icon ?? "Activity", sortOrder: cat.sortOrder });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editingId ? updateMutation.mutate({ id: editingId, ...form }) : createMutation.mutate(form);
  };

  const handleDelete = (id: number) => { if (confirm("Удалить категорию?")) deleteMutation.mutate({ id }); };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-[#00bfa5]" />
            <h2 className="text-lg font-semibold text-[#212121]">Категории услуг</h2>
          </div>
          <button onClick={() => { setEditingId(null); resetForm(); setShowForm(!showForm); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-gradient-accent text-white text-xs font-semibold hover:shadow-md transition-shadow">
            <Plus className="w-4 h-4" />Добавить
          </button>
        </div>

        {showForm && (
          <div className="rounded-lg bg-white border border-[#e5e5e5] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#212121]">{editingId ? "Редактировать" : "Новая категория"}</h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-[#888] hover:text-[#212121]"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
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
              <div className="col-span-2">
                <label className="text-xs text-[#888] block mb-1">Описание</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none resize-none" rows={2} />
              </div>
              <div>
                <label className="text-xs text-[#888] block mb-1">Иконка</label>
                <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none">
                  {["Activity","Microscope","Search","FileText","Stethoscope","FlaskConical"].map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#888] block mb-1">Порядок</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none" />
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
                <th className="text-left px-4 py-3 text-xs font-medium text-[#888]">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#888]">Описание</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-[#888]">Статус</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#888]">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#888]">Загрузка...</td></tr>
              ) : categories?.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#888]">Нет категорий</td></tr>
              ) : (
                categories?.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm text-[#212121]">{cat.name}</div>
                      <div className="text-xs text-[#888]">#{cat.sortOrder}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#888]">{cat.slug}</td>
                    <td className="px-4 py-3 text-sm text-[#888] max-w-[200px] truncate">{cat.description}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${cat.isActive ? "bg-[#00bfa5]/10 text-[#00bfa5]" : "bg-red-100 text-red-500"}`}>
                        {cat.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {cat.isActive ? "Активна" : "Выключена"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(cat)} className="p-1.5 rounded-md text-[#888] hover:text-[#00bfa5] hover:bg-[#f0fafa] transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-md text-[#888] hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
