"use client";

import { motion } from "framer-motion";
import { Upload, FileText, Search, Download, MoreVertical, Tag } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { documents } from "../lib/mock-data";

// 🎯 BẢNG MÀU CHUẨN THƯƠNG HIỆU CHO TỪNG LOẠI FILE (HỖ TRỢ CẢ DARK MODE)
const typeStyles: Record<string, { activeBtn: string; badge: string }> = {
  all: {
    activeBtn: "bg-ink text-cream shadow-sm",
    badge: "bg-muted text-muted-foreground border-transparent",
  },
  pdf: {
    activeBtn: "bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-600",
    badge: "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400",
  },
  docx: {
    activeBtn: "bg-blue-500 text-white shadow-md shadow-blue-500/20 hover:bg-blue-600",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400",
  },
  pptx: {
    activeBtn: "bg-orange-500 text-white shadow-md shadow-orange-500/20 hover:bg-orange-600",
    badge: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400",
  },
  txt: {
    activeBtn: "bg-slate-600 text-white shadow-md shadow-slate-600/20 hover:bg-slate-700 dark:bg-slate-500",
    badge: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400",
  },
};

export default function DocumentsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
      documents.filter(
        (d) =>
          (type === "all" || d.type === type) &&
          (d.title.toLowerCase().includes(query.toLowerCase()) ||
            d.subject.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, type],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tài liệu</h1>
        <p className="text-muted-foreground mt-1">Tải lên, sắp xếp và tìm kiếm tài liệu học tập.</p>
      </div>

      {/* Uploader */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
        }}
        onClick={() => inputRef.current?.click()}
        className={`surface-card border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
          drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <input ref={inputRef} type="file" multiple className="hidden" />
        <div className="size-14 mx-auto mb-3 rounded-2xl bg-primary/10 text-primary grid place-items-center">
          <Upload size={24} />
        </div>
        <div className="font-display text-lg font-semibold">Kéo & thả tài liệu vào đây</div>
        <div className="text-sm text-muted-foreground mt-1">
          PDF, DOCX, PPTX, TXT · tối đa 50MB / file
        </div>
      </motion.div>

      {/* Filter Toolbar */}
      <div className="surface-card p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên, môn hoặc tag..."
            className="w-full pl-10 pr-3 h-10 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none text-sm transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          {["all", "pdf", "docx", "pptx", "txt"].map((t) => {
            const isActive = type === t;
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 h-9 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 outline-none ${
                  isActive 
                    ? typeStyles[t]?.activeBtn 
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {t === "all" ? "Tất cả" : t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table List */}
      <div className="surface-card overflow-hidden border border-border/40 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider border-b border-border/50">
            <tr>
              <th className="text-left px-5 py-3.5">Tài liệu</th>
              <th className="text-left px-5 py-3.5 hidden md:table-cell">Môn</th>
              <th className="text-left px-5 py-3.5 hidden lg:table-cell">Tags</th>
              <th className="text-left px-5 py-3.5 hidden sm:table-cell">Dung lượng</th>
              <th className="text-left px-5 py-3.5 hidden lg:table-cell">Tải</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((d, i) => (
              <motion.tr
                key={d.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {/* 🤖 ĐỔI MÀU BADGE FILE THEO ĐÚNG ĐỊNH DẠNG THỰC TẾ */}
                    <div className={`size-9 rounded-xl grid place-items-center text-[10px] font-extrabold uppercase border transition-colors duration-300 ${
                      typeStyles[d.type.toLowerCase()]?.badge || "bg-muted text-muted-foreground border-transparent"
                    }`}>
                      {d.type}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate group-hover:text-primary cursor-pointer transition-colors">{d.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{d.uploaded}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-muted/80 border border-border/30 font-medium text-muted-foreground">{d.subject}</span>
                </td>
                <td className="px-5 py-3 hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {d.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-md bg-accent text-accent-foreground font-medium border border-border/10">
                        <Tag size={9} /> {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3 hidden sm:table-cell text-muted-foreground font-medium">{d.size}</td>
                <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground font-medium">{d.downloads}</td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button className="size-8 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors outline-none">
                      <Download size={14} />
                    </button>
                    <button className="size-8 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors outline-none">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground animate-fade-in">
            <FileText size={36} className="mx-auto mb-3 opacity-30 text-primary" />
            <div className="font-medium">Không có tài liệu khớp tìm kiếm</div>
            <div className="text-xs opacity-70 mt-0.5">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</div>
          </div>
        )}
      </div>
    </div>
  );
}