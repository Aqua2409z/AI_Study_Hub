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
  Shield,
  LayoutDashboard,
  MessageSquare,
  AlertTriangle,
  UserCheck,
  ArrowLeft,
  Globe,
  Menu,
  Moon,
  Sun,
  Award
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Spline = lazy(() => import("@splinetool/react-spline"));

const nav = [
  { path: "/dashboard", labelKey: "appShell.nav.dashboard", icon: Home },
  { path: "/notebooks", labelKey: "appShell.nav.notebooks", icon: BookMarked },
  { path: "/documents", labelKey: "appShell.nav.documents", icon: FileText },
  { path: "/chat", labelKey: "appShell.nav.askAI", icon: Bot },
  { path: "/quiz", labelKey: "appShell.nav.quiz", icon: GraduationCap },
  { path: "/flashcards", labelKey: "appShell.nav.flashcards", icon: BookOpen },
  { path: "/community", labelKey: "appShell.nav.community", icon: Users },
  { path: "/notifications", labelKey: "appShell.nav.notifications", icon: Bell },
  { path: "/profile", labelKey: "appShell.nav.profile", icon: User },
  { path: "/admin", labelKey: "appShell.nav.admin", icon: Shield },
] as const;

const adminNav = [
  { id: "overview", labelKey: "appShell.adminNav.overview", icon: LayoutDashboard },
  { id: "users", labelKey: "appShell.adminNav.users", icon: Users },
  { id: "feedbacks", labelKey: "appShell.adminNav.feedbacks", icon: MessageSquare },
  { id: "logs", labelKey: "appShell.adminNav.logs", icon: FileText },
  { id: "academic", labelKey: "appShell.adminNav.academic", icon: GraduationCap },
  { id: "roles", labelKey: "appShell.adminNav.roles", icon: UserCheck },
  { id: "reports", labelKey: "appShell.adminNav.reports", icon: AlertTriangle },
  { id: "marketplace", labelKey: "appShell.adminNav.marketplace", icon: BookMarked },
  { id: "badges", labelKey: "appShell.adminNav.badges", icon: Award },
  { id: "system-configs", labelKey: "appShell.adminNav.systemConfigs", icon: Shield },
];

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  const [isSplineReady, setIsSplineReady] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayInitials, setDisplayInitials] = useState("AK");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFlameAnimated, setIsFlameAnimated] = useState(true);

  // Mobile Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => {
      const nextTheme = !prev;
      localStorage.setItem("theme", nextTheme ? "dark" : "light");
      return nextTheme;
    });
  };

  const { t, i18n } = useTranslation();

  const activeAdminTab = location.pathname.startsWith('/admin/') 
    ? location.pathname.split('/')[2] 
    : "overview";

  const handleAdminTabClick = (id: string) => {
    navigate(`/admin/${id}`);
    setIsMobileMenuOpen(false); // Close mobile drawer when navigating
  };

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

      {/* ── 1. SIDEBAR CỐ ĐỊNH PHÍA BÊN TRÁI & MOBILE DRAWER ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 shrink-0 flex-col bg-[var(--color-ink)] text-[var(--color-cream)] border-r border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0 flex ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-6 py-6 flex items-center gap-3 border-b border-white/5 relative">
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden text-white/50 hover:text-white"
          >
            <X size={20} />
          </button>
          <div className="size-10 rounded-2xl overflow-hidden shadow-sm shadow-primary/20 bg-neutral-800 flex items-center justify-center shrink-0">
            <img
              src="./public/images/MindSpace1.png"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-base font-semibold leading-tight tracking-tight text-white">AI Study</div>
            <div className="text-xs opacity-70 font-medium text-[var(--color-cream)]">Learning Hub</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {isAdminPath ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-white/20 transition-all outline-none cursor-pointer"
              >
                <ArrowLeft size={18} /> {t("appShell.backToDashboard")}
              </button>
              <div className="h-px bg-white/10 my-3 mx-2" />
              {adminNav.map((item) => {
                const active = activeAdminTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleAdminTabClick(item.id)}
                    className="w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group outline-none cursor-pointer"
                  >
                    {active && (
                      <motion.span
                        layoutId="admin-nav-pill"
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
                      {t(item.labelKey)}
                    </span>
                  </button>
                );
              })}
            </>
          ) : (
            nav.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
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
                    {t(item.labelKey)}
                  </span>
                </button>
              );
            })
          )}
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
              {t("appShell.aiAssistant")}
            </div>
            <div className="mt-1 text-xs font-medium pr-12 leading-relaxed opacity-70 text-[var(--color-cream)]">
              {t("appShell.readyToHelp")}
            </div>
            <button
              onClick={() => navigate("/chat")}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline outline-none cursor-pointer"
            >
              {t("appShell.startChat")}
            </button>
          </div>
        </div>
      </aside>

      {/* ── 2. KHU VỰC HIỂN THỊ NỘI DUNG CHÍNH BÊN PHẢI ── */}
      <div className="flex-1 min-w-0 flex flex-col bg-background/50">

        <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
          <div className="flex items-center gap-3 px-6 lg:px-8 h-16 justify-between">

            <div className="flex-1 min-w-[120px] max-w-xl relative flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden mr-3 p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 relative">

              {/* DARK MODE TOGGLE */}
              <button
                onClick={toggleDarkMode}
                className="hidden md:flex items-center justify-center size-9 rounded-full bg-muted/50 text-foreground text-sm font-bold border border-border/50 hover:bg-muted active:scale-95 transition-all outline-none cursor-pointer"
              >
                {isDarkMode ? <Moon size={15} className="text-primary" /> : <Sun size={15} className="text-orange-500" />}
              </button>

              {/* LANGUAGE SWITCHER */}
              <button
                onClick={() => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}
                className="hidden md:flex items-center gap-1.5 px-3 h-9 rounded-full bg-muted/50 text-foreground text-sm font-bold border border-border/50 hover:bg-muted active:scale-95 transition-all outline-none cursor-pointer"
              >
                <Globe size={14} className="text-primary" />
                <span>{i18n.language === 'vi' ? 'EN' : 'VI'}</span>
              </button>

              {/* 🎯 NÚT STREAK 7 NGÀY */}
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
                <span>{t("appShell.streak")}</span>
              </button>

              <AnimatePresence>
                {isCalendarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="surface-card absolute -right-12 sm:right-24 top-12 w-[calc(100vw-3rem)] sm:w-80 p-4 z-50 pointer-events-auto bg-card"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-border mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Calendar size={14} className="text-primary" />
                        <span>{t("appShell.month")}</span>
                      </div>
                      <button
                        onClick={() => setIsCalendarOpen(false)}
                        className="size-6 rounded-md hover:bg-muted grid place-items-center text-muted-foreground cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground mb-1">
                      <div>{t("appShell.days.mon")}</div><div>{t("appShell.days.tue")}</div><div>{t("appShell.days.wed")}</div><div>{t("appShell.days.thu")}</div><div>{t("appShell.days.fri")}</div><div>{t("appShell.days.sat")}</div><div>{t("appShell.days.sun")}</div>
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
                      <span>{t("appShell.today")}</span>
                      <span className="text-primary font-bold">{t("appShell.keepItUp")}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => navigate("/documents")}
                className="inline-flex items-center justify-center gap-1.5 px-0 sm:px-4 w-9 sm:w-auto h-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm shadow-primary/10 cursor-pointer"
              >
                <Plus size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">{t("appShell.upload")}</span>
              </button>

              <button
                onClick={() => navigate("/profile")}
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}