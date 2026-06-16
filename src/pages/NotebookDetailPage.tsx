import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, FileText, Bot, BookOpen, GraduationCap, Plus, Edit2, X } from "lucide-react";
import { documents, quizzes, decks } from "../lib/mock-data";
import { notebookService, NotebookDTO } from "../services/notebookService";
import { Notify } from "notiflix";

interface NotebookDetailPageProps {
  notebook: NotebookDTO;
  onBack: () => void;
  onNavigate: (tab: number) => void;
}

export default function NotebookDetailPage({ notebook: initialNotebook, onBack, onNavigate }: NotebookDetailPageProps) {
  const nbDocs = documents.slice(0, 4);
  const [notebook, setNotebook] = useState<NotebookDTO>(initialNotebook);
  
  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(notebook.title);
  const [editSubjectId, setEditSubjectId] = useState(notebook.subjectId.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    if (!editTitle.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await notebookService.updateNotebook(notebook.id, Number(editSubjectId), editTitle);
      if (res.success) {
        setNotebook(res.data);
        setIsEditModalOpen(false);
        Notify.success("Cập nhật Notebook thành công");
      }
    } catch (e: any) {
      Notify.failure(e.message || "Lỗi cập nhật Notebook");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} /> Tất cả notebooks
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card p-6 lg:p-8 gradient-hero"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-md bg-card border border-border font-medium">
            {notebook.subjectCode}
          </span>
          <span className="text-xs text-muted-foreground">Cập nhật {new Date(notebook.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{notebook.title}</h1>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit2 size={18} />
          </button>
        </div>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Workspace cá nhân để tổng hợp tài liệu, đặt câu hỏi AI và luyện tập trước kỳ thi.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate(3)}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            <Bot size={16} /> Hỏi AI trong notebook
          </button>
          <button
            onClick={() => onNavigate(2)}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-card border border-border text-sm font-medium hover:bg-muted"
          >
            <Plus size={16} /> Thêm tài liệu
          </button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="surface-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <FileText size={18} className="text-primary" /> Tài liệu ({notebook.documentCount})
            </h2>
            <button onClick={() => onNavigate(2)} className="text-sm text-primary">
              Tất cả →
            </button>
          </div>
          <ul className="divide-y divide-border">
            {nbDocs.map((d) => (
              <li key={d.id} className="py-3 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-muted grid place-items-center text-xs font-bold uppercase text-muted-foreground">
                  {d.type}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium hover:text-primary truncate cursor-pointer">{d.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {d.size} · {d.uploaded}
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-md bg-success/15 text-success font-medium">
                  Sẵn sàng
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="surface-card p-5">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
              <GraduationCap size={18} className="text-primary" /> Quiz
            </h3>
            <ul className="space-y-2">
              {quizzes.slice(0, 2).map((q) => (
                <li key={q.id}>
                  <button
                    onClick={() => onNavigate(4)}
                    className="w-full text-left block p-3 rounded-lg bg-muted/50 hover:bg-muted"
                  >
                    <div className="text-sm font-medium">{q.title}</div>
                    <div className="text-xs text-muted-foreground">{q.questions} câu · {q.level}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card p-5">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
              <BookOpen size={18} style={{ color: "var(--color-coral)" }} /> Flashcards
            </h3>
            <ul className="space-y-2">
              {decks.slice(0, 2).map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => onNavigate(5)}
                    className="w-full text-left block p-3 rounded-lg bg-muted/50 hover:bg-muted"
                  >
                    <div className="text-sm font-medium">{d.title}</div>
                    <div className="text-xs text-muted-foreground">{d.mastered}/{d.cards} thẻ</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Sửa Notebook */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface-card w-full max-w-md rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold">Chỉnh sửa Notebook</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề Notebook</label>
                <input 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Nhập tên..."
                  className="w-full h-10 px-3 rounded-xl bg-card border border-border outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Môn học</label>
                <select 
                  value={editSubjectId}
                  onChange={(e) => setEditSubjectId(e.target.value)}
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
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 h-10 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                Hủy
              </button>
              <button 
                onClick={handleUpdate}
                disabled={isSubmitting || !editTitle.trim()}
                className="px-6 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
