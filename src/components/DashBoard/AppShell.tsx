"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  Calendar,
  Shield
} from "lucide-react";
import type { ReactNode } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

const nav = [
  { id: 0, label: "Dashboard", icon: Home },
  { id: 1, label: "Notebooks", icon: BookMarked },
  { id: 2, label: "Tài liệu", icon: FileText },
  { id: 3, label: "Hỏi AI", icon: Bot },
  { id: 4, label: "Quiz", icon: GraduationCap },
  { id: 5, label: "Flashcards", icon: BookOpen },
  { id: 6, label: "Cộng đồng", icon: Users },
  { id: 7, label: "Thông báo", icon: Bell },
  { id: 8, label: "Hồ sơ", icon: User },
  { id: 9, label: "Admin", icon: Shield },
] as const;

interface AppShellProps {
  children: ReactNode;
  activeTab?: number;
  setActiveTab?: (id: number) => void;
}

export function AppShell({ children, activeTab, setActiveTab }: AppShellProps) {
  const [isSplineReady, setIsSplineReady] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayInitials, setDisplayInitials] = useState("AK");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // State quản lý xem ngọn lửa có được phép chuyển động hay không
  const [isFlameAnimated, setIsFlameAnimated] = useState(true);

  const juneDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const attended = dayNum >= 9 && dayNum <= 15;
    return { day: dayNum, attended };
  });

  const syncProfileData = () => {
    if (typeof window !== "undefined") {
      const savedAvatar = localStorage.getItem("userAvatarUrl");
      const savedName = localStorage.getItem("userFullName");
      if (savedAvatar) setAvatarUrl(savedAvatar);
      if (savedName) {
        const words = savedName.trim().split(" ");
        const initials = words.length >= 2
          ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
          : words[0].slice(0, 2).toUpperCase();
        setDisplayInitials(initials);
      }
    }
  };

  useEffect(() => {
    syncProfileData();
    const handleProfileUpdate = () => syncProfileData();
    window.addEventListener("profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("profile-updated", handleProfileUpdate);
  }, []);

  return (
    <div className="min-h-screen flex bg-background text-foreground antialiased selection:bg-primary/20 app-shell-font">

      {/* ── 1. SIDEBAR CỐ ĐỊNH PHÍA BÊN TRÁI ── */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col sticky top-0 h-screen select-none border-r" style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-cream)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="px-6 py-6 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
         <div className="size-10 rounded-2xl overflow-hidden shadow-sm shadow-primary/20 bg-neutral-800 flex items-center justify-center shrink-0">
            <img
              src="./public/images/MindSpace1.png" // Thay đường dẫn ảnh của bạn vào đây (Ví dụ: để trong thư mục public)
        
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-base font-semibold leading-tight tracking-tight text-white">AI Study</div>
            <div className="text-xs opacity-70 font-medium text-[var(--color-cream)]">Learning Hub</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {nav.map((item) => {
            const active = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className="w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group outline-none cursor-pointer"
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
                  className="relative z-10 transition-colors duration-200"
                  style={{
                    color: active ? "var(--color-primary)" : "rgba(245,242,234,0.6)"
                  }}
                />
                <span
                  className={`relative z-10 transition-colors duration-200 ${active ? "font-semibold text-white" : "text-[var(--color-cream)] opacity-60 group-hover:opacity-100"
                    }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="m-3 p-4 rounded-2xl relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 pointer-events-none select-none z-0">
            {!isSplineReady && (
              <div className="w-full h-full flex items-center justify-center opacity-30">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="relative z-10 pointer-events-auto">
            <div className="text-[10px] uppercase tracking-wider text-primary font-bold">
              Trợ lý AI
            </div>
            <div className="mt-1 text-xs font-medium pr-12 leading-relaxed opacity-70 text-[var(--color-cream)]">
              Sẵn sàng giúp bạn ôn tập bài học.
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab(3)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline outline-none cursor-pointer"
            >
              Bắt đầu chat →
            </button>
          </div>
        </div>
      </aside>

      {/* ── 2. KHU VỰC HIỂN THỊ NỘI DUNG CHÍNH BÊN PHẢI ── */}
      <div className="flex-1 min-w-0 flex flex-col bg-background/50">

        <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
          <div className="flex items-center gap-3 px-6 lg:px-8 h-16 justify-between">

            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Tìm tài liệu, quiz, flashcard..."
                className="w-full pl-10 pr-3 h-10 rounded-full bg-muted/40 border border-transparent focus:border-primary/30 focus:bg-card outline-none text-sm transition-all text-foreground"
              />
            </div>

            <div className="flex items-center gap-3 relative">

              {/* 🎯 NÚT STREAK 7 NGÀY - ẤN LẦN ĐẦU SẼ TẮT HIỆU ỨNG ĐỘNG MÃI MÃI */}
              <button
                onClick={() => {
                  setIsCalendarOpen(!isCalendarOpen);
                  if (isFlameAnimated) setIsFlameAnimated(false);
                }}
                className="hidden md:flex items-center gap-2 px-3 h-9 rounded-full bg-orange-500/10 text-orange-500 text-sm font-bold border border-orange-500/20 hover:bg-orange-500/20 active:scale-95 transition-all outline-none cursor-pointer"
              >
                <motion.div
                  animate={
                    !isFlameAnimated
                      ? {
                        scaleY: 1,
                        scaleX: 1,
                        y: 0,
                        filter: "drop-shadow(0 0 2px #f97316)"
                      }
                      : {
                        scaleY: [1, 1.18, 0.92, 1.12, 1],
                        scaleX: [1, 0.92, 1.06, 0.94, 1],
                        y: [0, -2, 0.5, -1, 0],
                        filter: [
                          "drop-shadow(0 0 1px #f97316)",
                          "drop-shadow(0 0 5px #ea580c)",
                          "drop-shadow(0 0 1px #f97316)"
                        ]
                      }
                  }
                  transition={
                    !isFlameAnimated
                      ? { duration: 0.2, ease: "easeOut" }
                      : {
                        duration: 0.65,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut"
                      }
                  }
                  className="inline-flex origin-bottom"
                >
                  <Flame size={14} fill="currentColor" />
                </motion.div>
                <span>7 ngày</span>
              </button>

              {/* BẢNG LỊCH ĐIỂM DANH POPUP CHUẨN ĐẸP LỒNG GHÉP THEO DESIGN SYSTEM */}
              <AnimatePresence>
                {isCalendarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="surface-card absolute right-24 top-12 w-80 p-4 z-50 pointer-events-auto bg-card"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-border mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Calendar size={14} className="text-primary" />
                        <span>Tháng 6, 2026</span>
                      </div>
                      <button
                        onClick={() => setIsCalendarOpen(false)}
                        className="size-6 rounded-md hover:bg-muted grid place-items-center text-muted-foreground cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground mb-1">
                      <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {juneDays.map((item) => (
                        <div
                          key={item.day}
                          className={`h-8 rounded-lg flex flex-col items-center justify-center relative font-medium text-xs transition-all ${item.attended
                            ? "bg-primary text-primary-foreground font-bold shadow-sm"
                            : "bg-muted/40 text-muted-foreground hover:bg-muted"
                            }`}
                        >
                          <span>{item.day}</span>
                          {item.attended && (
                            <span className="absolute bottom-1 size-1 rounded-full bg-white animate-pulse" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                      <span>Hôm nay: Ngày 15</span>
                      <span className="text-primary font-bold">Giữ vững phong độ! </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setActiveTab && setActiveTab(2)}
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm shadow-primary/10 cursor-pointer"
              >
                <Plus size={16} strokeWidth={2.5} /> Tải lên
              </button>

              <button
                onClick={() => setActiveTab && setActiveTab(8)}
                className="size-9 rounded-full bg-ink text-white grid place-items-center text-sm font-bold shadow-sm hover:scale-105 transition-transform outline-none overflow-hidden border border-border/10 cursor-pointer"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                  displayInitials
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 lg:px-8 pt-6 pb-20 min-w-0 overflow-y-auto custom-scrollbar">
          {children}
        </main>

        <nav className="lg:hidden sticky bottom-0 z-30 bg-card border-t border-border flex justify-around py-2 select-none">
          {nav.slice(0, 5).map((item) => {
            const active = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg outline-none transition-colors cursor-pointer ${active ? "text-primary font-semibold" : "text-muted-foreground"
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