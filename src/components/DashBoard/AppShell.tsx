"use client";

import { motion } from "framer-motion";
import {
  Home,
  BookMarked,
  FileText,
  Bot,
  GraduationCap,
  BookOpen,
  Users,
  Bell,
  User,
  Search,
  Plus,
  Flame,
  Shield,
} from "lucide-react";
import type { ReactNode } from "react";
import mascot from "../../assets/mascot.png";

// Toàn bộ navigation items — khớp với switch(activeTab) trong App.tsx
const nav = [
  { id: 0,  label: "Dashboard",   icon: Home },
  { id: 1,  label: "Notebooks",   icon: BookMarked },
  { id: 2,  label: "Tài liệu",    icon: FileText },
  { id: 3,  label: "Hỏi AI",      icon: Bot },
  { id: 4,  label: "Quiz",        icon: GraduationCap },
  { id: 5,  label: "Flashcards",  icon: BookOpen },
  { id: 6,  label: "Cộng đồng",   icon: Users },
  { id: 7,  label: "Thông báo",   icon: Bell },
  { id: 8,  label: "Hồ sơ",       icon: User },
  { id: 9,  label: "Admin",       icon: Shield },
] as const;

interface AppShellProps {
  children: ReactNode;
  activeTab?: number;
  setActiveTab?: (id: number) => void;
}

export function AppShell({ children, activeTab, setActiveTab }: AppShellProps) {
  return (
    <div className="min-h-screen flex bg-background text-foreground antialiased selection:bg-primary/20 app-shell-font">

      {/* ── 1. SIDEBAR CỐ ĐỊNH PHÍA BÊN TRÁI ── */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col sticky top-0 h-screen select-none border-r" style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-cream)', borderColor: 'rgba(255,255,255,0.05)' }}>
        {/* Header Thương hiệu */}
        <div className="px-6 py-6 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="size-10 rounded-2xl bg-primary grid place-items-center text-primary-foreground font-bold text-lg shadow-sm shadow-primary/20">
            S
          </div>
          <div>
            <div className="text-base font-semibold leading-tight tracking-tight text-white">Mind Space</div>
            <div className="text-xs opacity-70 font-medium text-[var(--color-cream)]">Learning Hub</div>
          </div>
        </div>

        {/* Hệ thống Menu chuyển đổi Tab động */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {nav.map((item) => {
            const active = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group outline-none"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  size={18}
                  className={`relative z-10 transition-colors duration-200 ${
                    active ? "text-primary" : "text-[var(--color-cream)] opacity-60 group-hover:opacity-100"
                  }`}
                />
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    active ? "font-semibold text-white" : "text-[var(--color-cream)] opacity-60 group-hover:opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Khối Widget Mascot Robot hỗ trợ nhanh */}
        <div className="m-3 p-4 rounded-2xl relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <img
            src={mascot}
            alt="Mascot"
            className="absolute -right-3 -bottom-3 w-20 opacity-40 pointer-events-none select-none drop-shadow-md"
            loading="lazy"
          />
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-wider text-primary font-bold">
              Trợ lý AI
            </div>
            <div className="mt-1 text-xs font-medium pr-12 leading-relaxed opacity-70 text-[var(--color-cream)]">
              Sẵn sàng giúp bạn ôn tập bài học.
            </div>
            <button
              onClick={() => setActiveTab(3)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline outline-none"
            >
              Bắt đầu chat →
            </button>
          </div>
        </div>
      </aside>

      {/* ── 2. KHU VỰC HIỂN THỊ NỘI DUNG CHÍNH BÊN PHẢI ── */}
      <div className="flex-1 min-w-0 flex flex-col bg-background/50">

        {/* Top Header Thanh tìm kiếm & Profile */}
        <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
          <div className="flex items-center gap-3 px-6 lg:px-8 h-16">

            {/* Hộp Tìm kiếm Toàn năng */}
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Tìm tài liệu, quiz, flashcard..."
                className="w-full pl-10 pr-3 h-10 rounded-full bg-muted/40 border border-transparent focus:border-primary/30 focus:bg-card outline-none text-sm transition-all"
              />
            </div>

            {/* Khối Chỉ số Góc Phải */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 px-3 h-9 rounded-full bg-orange-500/10 text-orange-500 text-sm font-bold border border-orange-500/20">
                <Flame size={14} fill="currentColor" /> 7 ngày
              </div>

              <button
                onClick={() => setActiveTab(2)}
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm shadow-primary/10"
              >
                <Plus size={16} strokeWidth={2.5} /> Tải lên
              </button>

              <button
                onClick={() => setActiveTab(8)}
                className="size-9 rounded-full bg-ink text-white grid place-items-center text-sm font-bold shadow-sm hover:scale-105 transition-transform outline-none"
              >
                AK
              </button>
            </div>
          </div>
        </header>

        {/* Nơi nạp động các View trang con */}
        <main className="flex-1 px-6 lg:px-8 py-6 min-w-0 overflow-y-auto">
          {children}
        </main>

        {/* Navigation Bar Dưới cùng dành riêng cho Thiết bị di động (Mobile) */}
        <nav className="lg:hidden sticky bottom-0 z-30 bg-card border-t border-border flex justify-around py-2 select-none">
          {nav.slice(0, 5).map((item) => {
            const active = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg outline-none transition-colors ${
                  active ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}