import { motion } from "framer-motion";
import { ArrowLeft, FileText, Bot, BookOpen, GraduationCap, Plus } from "lucide-react";
import { notebooks, documents, quizzes, decks } from "../lib/mock-data";
import type { Notebook } from "../lib/mock-data";

interface NotebookDetailPageProps {
  notebook: Notebook;
  onBack: () => void;
  onNavigate: (tab: number) => void;
}

export default function NotebookDetailPage({ notebook, onBack, onNavigate }: NotebookDetailPageProps) {
  const nbDocs = documents.slice(0, 4);

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
            {notebook.subject}
          </span>
          <span className="text-xs text-muted-foreground">Cập nhật {notebook.updated}</span>
        </div>
        <h1 className="text-3xl font-bold">{notebook.title}</h1>
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
              <FileText size={18} className="text-primary" /> Tài liệu ({notebook.docs})
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
    </div>
  );
}
