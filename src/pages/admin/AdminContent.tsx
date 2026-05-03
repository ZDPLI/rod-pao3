import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { trpc } from "@/providers/trpc";
import { Plus, Pencil, Trash2, X, Check, FileText } from "lucide-react";

export default function AdminContent() {
  const utils = trpc.useUtils();
  const { data: contents, isLoading } = trpc.content.list.useQuery();

  const createMutation = trpc.content.create.useMutation({
    onSuccess: () => { utils.content.list.invalidate(); setShowForm(false); resetForm(); },
  });
  const updateMutation = trpc.content.update.useMutation({
    onSuccess: () => { utils.content.list.invalidate(); setEditingId(null); resetForm(); },
  });
  const deleteMutation = trpc.content.delete.useMutation({
    onSuccess: () => utils.content.list.invalidate(),
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ key: "", title: "", body: "" });

  const resetForm = () => setForm({ key: "", title: "", body: "" });

  const startEdit = (item: NonNullable<typeof contents>[0]) => {
    setEditingId(item.id);
    setForm({ key: item.key, title: item.title, body: item.body ?? "" });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editingId ? updateMutation.mutate({ id: editingId, ...form }) : createMutation.mutate(form);
  };

  const handleDelete = (id: number) => { if (confirm("Удалить контент?")) deleteMutation.mutate({ id }); };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#00bfa5]" />
            <h2 className="text-lg font-semibold text-[#212121]">Управление контентом</h2>
          </div>
          <button onClick={() => { setEditingId(null); resetForm(); setShowForm(!showForm); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-gradient-accent text-white text-xs font-semibold hover:shadow-md transition-shadow">
            <Plus className="w-4 h-4" />Добавить
          </button>
        </div>

        {showForm && (
          <div className="rounded-lg bg-white border border-[#e5e5e5] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#212121]">{editingId ? "Редактировать" : "Новый контент"}</h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-[#888] hover:text-[#212121]"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#888] block mb-1">Ключ *</label>
                  <input type="text" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none" required />
                </div>
                <div>
                  <label className="text-xs text-[#888] block mb-1">Заголовок *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#888] block mb-1">Содержимое</label>
                <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#212121] focus:border-[#00bfa5] focus:outline-none resize-none" rows={6} />
              </div>
              <div className="flex justify-end gap-2">
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
                <th className="text-left px-4 py-3 text-xs font-medium text-[#888]">Ключ</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#888]">Заголовок</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#888]">Содержимое</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-[#888]">Статус</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#888]">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#888]">Загрузка...</td></tr>
              ) : contents?.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#888]">Нет контента</td></tr>
              ) : (
                contents?.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-[#f0fafa] text-[#00bfa5] font-mono">{item.key}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#212121]">{item.title}</td>
                    <td className="px-4 py-3 text-sm text-[#888] max-w-[300px] truncate">{item.body}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${item.isActive ? "bg-[#00bfa5]/10 text-[#00bfa5]" : "bg-red-100 text-red-500"}`}>
                        {item.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(item)} className="p-1.5 rounded-md text-[#888] hover:text-[#00bfa5] hover:bg-[#f0fafa] transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-md text-[#888] hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
