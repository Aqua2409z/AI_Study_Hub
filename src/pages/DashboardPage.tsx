"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import {
  BookMarked,
  FileText,
  Bot,
  HardDrive,
  GraduationCap,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Flame,
  Trophy,
  X,
  Medal,
  Crown
} from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";
import { notebooks, notifications, leaderboard, decks } from "../lib/mock-data";

const Spline = lazy(() => import("@splinetool/react-spline"));

interface DashboardPageProps {
  onNavigate: (tab: number) => void;
}

const stats = [
  { label: "Notebook", value: 5, icon: BookMarked, tint: "165" },
  { label: "Tài liệu", value: 42, icon: FileText, tint: "200" },
  { label: "Lượt hỏi AI", value: 128, icon: Bot, tint: "35" },
  { label: "Dung lượng", value: "1.2 GB", icon: HardDrive, tint: "75" },
];

const weekActivity = [
  { d: "T2", v: 12 },
  { d: "T3", v: 18 },
  { d: "T4", v: 9 },
  { d: "T5", v: 24 },
  { d: "T6", v: 16 },
  { d: "T7", v: 28 },
  { d: "CN", v: 21 },
];

// Giả lập dữ liệu mở rộng cho 3 mục đóng góp bên trong Hộp thoại Popup công thần
const mockContributions = {
  weekly: [
    { rank: 1, name: "Lê Trần Anh Khoa", points: 2450, avatar: "AK", desc: "Mới upload 5 đề cương mạch ESP32" },
    { rank: 2, name: "Ngô Nhựt Minh", points: 2100, avatar: "NM", desc: "Đóng góp 3 bộ câu hỏi test JSTL" },
    { rank: 3, name: "Trần Bích Trâm", points: 1850, avatar: "BT", desc: "Hoàn thiện 40 thẻ ôn tập Scrum" },
  ],
  monthly: [
    { rank: 1, name: "Ngô Nhựt Minh", points: 9800, avatar: "NM", desc: "Chiến thần chia sẻ lab Java Web tháng này" },
    { rank: 2, name: "Lê Trần Anh Khoa", points: 8400, avatar: "AK", desc: "Tích cực hỗ trợ giải đáp bài học bằng AI" },
    { rank: 3, name: "Trần Bích Trâm", points: 7200, avatar: "BT", desc: "Đóng góp kho sơ đồ Use Case chất lượng cao" },
  ],
  allTime: [
    { rank: 1, name: "Trần Bích Trâm", points: 45200, avatar: "BT", desc: "Huyền thoại đóng góp tài liệu thư viện trường" },
    { rank: 2, name: "Ngô Nhựt Minh", points: 41800, avatar: "NM", desc: "Đại công thần tối ưu hóa học liệu thông minh" },
    { rank: 3, name: "Lê Trần Anh Khoa", points: 39500, avatar: "AK", desc: "Top 3 thủ khoa tích điểm danh tiếng hệ thống" },
  ]
};

function CountUp({ value }: { value: string | number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = String(value);
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) {
      el.textContent = target;
      return;
    }
    const suffix = target.replace(/[0-9.,\s]/g, "");
    const obj = { v: 0 };
    gsap.to(obj, {
      v: num,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        const formatted = num >= 100 ? Math.round(obj.v).toLocaleString() : obj.v.toFixed(1);
        el.textContent = formatted + suffix;
      },
    });
  }, [value]);
  return <span ref={ref}>0</span>;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [isSplineReady, setIsSplineReady] = useState(false);

  // ── 🛠️ STATE ĐIỀU KHIỂN ĐÓNG MỞ MODAL & CHỌN 1 TRONG 3 MỤC ĐÓNG GÓP ──
  const [isContributorOpen, setIsContributorOpen] = useState(false);
  const [activeContribTab, setActiveContributorTab] = useState<"weekly" | "monthly" | "allTime">("weekly");

  return (
    <div className="space-y-6">
      {/* Hero Banner Chào mừng */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card gradient-hero p-6 lg:p-8 flex flex-col md:flex-row gap-6 items-center overflow-hidden relative min-h-[240px]"
      >
        <div className="flex-1 min-w-0 z-10 relative pointer-events-auto md:pr-[160px] text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Flame size={12} fill="currentColor" /> Chuỗi học 7 ngày liên tiếp
          </div>
          <h1 className="mt-3 text-3xl lg:text-4xl font-bold">
            Chào Khoa, hôm nay học gì nhỉ?
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Bạn còn <strong className="text-foreground font-semibold">3 quiz</strong> chưa hoàn thành và{" "}
            <strong className="text-foreground font-semibold">12 flashcard</strong> cần ôn lại trong tuần này.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate(3)}
              className="inline-flex items-center gap-1.5 px-5 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 shadow-sm transition-all cursor-pointer"
            >
              <Bot size={16} /> Hỏi AI ngay
            </button>
            <button
              onClick={() => onNavigate(1)}
              className="inline-flex items-center gap-1.5 px-5 h-10 rounded-full bg-card border border-border text-sm font-medium hover:bg-muted shadow-sm transition-colors cursor-pointer"
            >
              Mở Notebook <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="absolute inset-y-0 right-0 w-full md:w-[1200px] h-full z-0 pointer-events-auto select-none overflow-hidden">
          {!isSplineReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin opacity-40" />
            </div>
          )}

          <Suspense fallback={null}>
            <Spline
              scene="/robot-companion.splinecode"
              onLoad={(splineApp) => {
                setIsSplineReady(true);
                splineApp.setVariable("RobotSpeed", 9.5);
              }}
            />
          </Suspense>
        </div>
      </motion.section>

      {/* Stat tiles */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="surface-card p-5"
            >
              <div
                className="size-10 rounded-xl grid place-items-center mb-3"
                style={{ background: `oklch(0.55 0.14 ${s.tint} / 0.12)`, color: `oklch(0.45 0.14 ${s.tint})` }}
              >
                <Icon size={18} />
              </div>
              <div className="text-2xl font-bold font-display text-left">
                <CountUp value={s.value} />
              </div>
              <div className="text-sm text-muted-foreground mt-0.5 text-left">{s.label}</div>
            </motion.div>
          );
        })}
      </section>

      {/* Chart + leaderboard */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="surface-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-left">
              <h3 className="font-display text-lg font-semibold">Hoạt động học tuần này</h3>
              <p className="text-xs text-muted-foreground">Số lượt tương tác AI mỗi ngày</p>
            </div>
            <div className="inline-flex items-center gap-1 text-success text-sm font-medium">
              <TrendingUp size={14} /> +24%
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekActivity}>
                <XAxis dataKey="d" axisLine={false} tickLine={false} fontSize={12} stroke="oklch(0.5 0.02 250)" />
                <Tooltip
                  cursor={{ fill: "oklch(0.55 0.14 165 / 0.08)" }}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="v" radius={[8, 8, 0, 0]}>
                  {weekActivity.map((_, i) => (
                    <Cell key={i} fill={i === 5 ? "oklch(0.55 0.14 165)" : "oklch(0.55 0.14 165 / 0.5)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🛠️ KHỐI TOP CONTRIBUTORS: Đã bọc nút click mở bung Modal con 3 mục */}
        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-semibold">Top contributors</h3>
            <button 
              onClick={() => setIsContributorOpen(true)}
              className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Trophy size={14} className="text-coral" /> Chi tiết →
            </button>
          </div>
          <ul className="space-y-3 cursor-pointer" onClick={() => setIsContributorOpen(true)}>
            {leaderboard.map((u) => (
              <li key={u.rank} className="flex items-center gap-3 group transition-all">
                <div
                  className={`size-7 rounded-full grid place-items-center text-xs font-bold ${
                    u.rank === 1 ? "bg-coral text-white" : u.rank === 2 ? "bg-accent" : "bg-muted"
                  }`}
                >
                  {u.rank}
                </div>
                <div className="size-9 rounded-full bg-ink text-cream grid place-items-center text-xs font-semibold group-hover:scale-105 transition-transform">
                  {u.avatar}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.points.toLocaleString()} pts</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Notebooks + notifications */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="surface-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Notebook gần đây</h3>
            <button onClick={() => onNavigate(1)} className="text-sm text-primary font-medium cursor-pointer">
              Xem tất cả →
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {notebooks.slice(0, 4).map((nb, i) => (
              <motion.div
                key={nb.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <div onClick={() => onNavigate(1)} className="block p-4 rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all bg-card cursor-pointer text-left">
                  <div
                    className="size-9 rounded-lg mb-3 grid place-items-center"
                    style={{ background: `oklch(0.55 0.14 ${nb.color} / 0.15)`, color: `oklch(0.45 0.14 ${nb.color})` }}
                  >
                    <BookMarked size={16} />
                  </div>
                  <div className="font-medium truncate">{nb.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {nb.docs} tài liệu · {nb.cards} thẻ · {nb.updated}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Thông báo mới</h3>
            <button onClick={() => onNavigate(7)} className="text-sm text-primary font-medium cursor-pointer">
              Tất cả →
            </button>
          </div>
          <ul className="space-y-3 text-left">
            {notifications.slice(0, 4).map((n) => (
              <li key={n.id} className="flex gap-3">
                <div className={`size-2 mt-2 rounded-full ${n.unread ? "bg-primary" : "bg-border"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm leading-snug">{n.text}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quiz + Flashcards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <GraduationCap size={18} className="text-primary" /> Quiz cần làm
            </h3>
            <button onClick={() => onNavigate(4)} className="text-sm text-primary font-medium cursor-pointer">
              Tất cả →
            </button>
          </div>
          <div className="space-y-2 text-left">
            {notebooks.slice(0, 3).map((nb) => (
              <div key={nb.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <div className="text-sm font-medium">{nb.title}</div>
                  <div className="text-xs text-muted-foreground">{nb.quizzes} quiz · cấp độ Medium</div>
                </div>
                <button
                  onClick={() => onNavigate(4)}
                  className="px-3 h-8 inline-flex items-center rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Làm bài
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <BookOpen size={18} className="text-coral" /> Flashcard mới
            </h3>
            <button onClick={() => onNavigate(5)} className="text-sm text-primary font-medium cursor-pointer">
              Tất cả →
            </button>
          </div>
          <div className="space-y-2 text-left">
            {decks.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <div className="text-sm font-medium">{d.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {d.mastered}/{d.cards} đã thuộc · {d.updated}
                  </div>
                </div>
                <button
                  onClick={() => onNavigate(5)}
                  className="px-3 h-8 inline-flex items-center rounded-lg bg-coral text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Học
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 🏆 POPUP BẢNG VÀNG ĐÓNG GÓP 3 MỤC CHÍNH GIỮA MÀN HÌNH ── */}
      {typeof document !== "undefined" ? createPortal(
        <AnimatePresence>
          {isContributorOpen && (
            <>
              {/* Lớp phủ mờ nền */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsContributorOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-default"
              />

              {/* Thùng chứa Modal */}
              <div className="fixed inset-0 flex items-center justify-center p-4 z-[100] pointer-events-none">
                <motion.div
                  initial={{ scale: 0.96, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.96, opacity: 0, y: 15 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className="pointer-events-auto w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl flex flex-col max-h-[80vh] overflow-hidden text-left"
                >
                  {/* Header Modal */}
                  <div className="p-5 border-b border-border flex items-center justify-between bg-muted/10">
                    <div className="flex items-center gap-2">
                      <Crown className="text-coral size-5 animate-bounce" />
                      <h3 className="text-base font-bold text-foreground">Bảng Vàng Đóng Góp</h3>
                    </div>
                    <button
                      onClick={() => setIsContributorOpen(false)}
                      className="size-8 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Thanh 3 Phân Hệ Mục Đóng Góp Độc Lập — Ép Phẳng Chống Tràn */}
                  <div className="flex p-1 bg-muted rounded-xl mx-5 mt-4 border border-border/50 gap-0.5 shrink-0">
                    {[
                      { id: "weekly", label: "Tuần này" },
                      { id: "monthly", label: "Hằng tháng" },
                      { id: "allTime", label: "Cao nhất" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveContributorTab(tab.id as any)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          activeContribTab === tab.id
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Danh sách các sinh viên vinh danh tương ứng với tab được chọn */}
                  <div className="p-5 overflow-y-auto flex-1 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {mockContributions[activeContribTab].map((u) => (
                      <motion.div
                        key={u.rank}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/60 transition-colors"
                      >
                        {/* Xếp hạng huy chương */}
                        <div className="size-7 shrink-0 rounded-full grid place-items-center text-xs font-bold">
                          {u.rank === 1 ? (
                            <Medal size={20} className="text-amber-500 fill-amber-500/20" />
                          ) : u.rank === 2 ? (
                            <Medal size={20} className="text-slate-400 fill-slate-400/20" />
                          ) : (
                            <Medal size={20} className="text-amber-700 fill-amber-700/20" />
                          )}
                        </div>

                        {/* Avatar viết tắt */}
                        <div className="size-9 shrink-0 rounded-full bg-ink text-cream grid place-items-center text-xs font-bold shadow-inner">
                          {u.avatar}
                        </div>

                        {/* Thông tin chi tiết */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-sm font-bold text-foreground truncate">{u.name}</span>
                            <span className="text-xs font-mono font-black text-primary shrink-0">{u.points.toLocaleString()} pts</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5 font-medium">{u.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer Modal */}
                  <div className="p-4 border-t border-border flex bg-muted/5">
                    <p className="text-[10px] text-muted-foreground font-medium my-auto">Cập nhật realtime từ Vector Thư viện</p>
                    <button
                      onClick={() => setIsContributorOpen(false)}
                      className="px-4 py-2 ml-auto rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm"
                    >
                      Đóng bảng
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      ) : null}
    </div>
  );
}