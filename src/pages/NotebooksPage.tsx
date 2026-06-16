import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, Plus, Search, Filter, Trash2, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import NotebookDetailPage from "./NotebookDetailPage";
import { notebookService, NotebookDTO } from "../services/notebookService";
import { Notify } from "notiflix";

const subjects = ["Tất cả", "SWP391", "SWT301", "SWR302", "PRN221", "PRJ301"];

interface NotebooksPageProps {
  onNavigate?: (tab: number) => void;
}

export default function NotebooksPage({ onNavigate }: NotebooksPageProps) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("Tất cả");
  const [activeNotebook, setActiveNotebook] = useState<NotebookDTO | null>(null);
  const [notebooksList, setNotebooksList] = useState<NotebookDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubjectId, setNewSubjectId] = useState("12"); // Default to SWR302
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadNotebooks();
  }, []);

  const loadNotebooks = async () => {
    setIsLoading(true);
    try {
      const res = await notebookService.getNotebooks();
      if (res.success) setNotebooksList(res.data.items);
    } catch (e: any) {
      Notify.failure(e.message || "Lỗi tải Notebook");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(
    () =>
      notebooksList.filter(
        (n) =>
          (subject === "Tất cả" || n.subjectCode === subject) &&
          n.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, subject, notebooksList],
  );

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await notebookService.createNotebook(Number(newSubjectId), newTitle);
      if (res.success) {
        setNotebooksList([res.data, ...notebooksList]);
        setIsModalOpen(false);
        setNewTitle("");
        Notify.success("Tạo Notebook thành công");
      }
    } catch (e: any) {
      Notify.failure(e.message || "Lỗi tạo Notebook");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc muốn xóa Notebook này? Toàn bộ tài liệu bên trong sẽ bị mất.")) return;
    try {
      const res = await notebookService.deleteNotebook(id);
      if (res.success) {
        setNotebooksList(prev => prev.filter(n => n.id !== id));
        Notify.success("Đã xóa Notebook");
      }
    } catch (e: any) {
      Notify.failure(e.message || "Lỗi xóa Notebook");
    }
  };

  if (activeNotebook) {
    return (
      <NotebookDetailPage
        notebook={activeNotebook}
        onBack={() => setActiveNotebook(null)}
        onNavigate={onNavigate ?? (() => {})}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notebooks</h1>
          <p className="text-muted-foreground mt-1">Sổ tay học tập, phân nhóm theo môn học.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 self-start md:self-auto"
        >
          <Plus size={16} /> Notebook mới
        </button>
      </div>

      <div className="surface-card p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm notebook..."
            className="w-full pl-10 pr-3 h-10 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hidden">
          <Filter size={14} className="text-muted-foreground shrink-0" />
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`px-3 h-9 rounded-full text-xs font-medium shrink-0 transition-colors ${
                subject === s ? "bg-ink text-cream" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-muted-foreground"><div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />Đang tải dữ liệu...</div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-muted-foreground">Không tìm thấy notebook nào.</div>
          ) : (
            filtered.map((nb, i) => (
              <motion.div
                key={nb.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
              >
                <div
                  onClick={() => setActiveNotebook(nb)}
                  className="block surface-card p-5 transition-shadow h-full cursor-pointer hover:shadow-md hover:border-primary/30 relative group"
                >
                  <button 
                    onClick={(e) => handleDelete(nb.id, e)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="size-12 rounded-2xl grid place-items-center"
                      style={{
                        background: `oklch(0.55 0.14 ${nb.color || "200"} / 0.15)`,
                        color: `oklch(0.45 0.14 ${nb.color || "200"})`,
                      }}
                    >
                      <BookMarked size={20} />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-md bg-muted font-medium">{nb.subjectCode}</span>
                  </div>
                  <div className="font-display text-lg font-semibold leading-snug">{nb.title}</div>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-center">
                    <div className="bg-muted/50 rounded-lg py-2">
                      <div className="text-sm font-bold">{nb.documentCount}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Tài liệu</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">Cập nhật: {new Date(nb.createdAt).toLocaleDateString()}</div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal Tạo Notebook */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface-card w-full max-w-md rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold">Tạo Notebook mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề Notebook</label>
                <input 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Nhập tên..."
                  className="w-full h-10 px-3 rounded-xl bg-card border border-border outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Môn học</label>
                <select 
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-card border border-border outline-none focus:border-primary text-sm"
                >
                  <option value="12">SWR302</option>
                  <option value="5">PRN221</option>
                  <option value="1">SWP391</option>
                  <option value="2">SWT301</option>
                  <option value="3">PRJ301</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="px-4 h-10 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                Hủy
              </button>
              <button 
                onClick={handleCreate}
                disabled={isSubmitting || !newTitle.trim()}
                className="px-6 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                {isSubmitting ? "Đang tạo..." : "Tạo Notebook"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
