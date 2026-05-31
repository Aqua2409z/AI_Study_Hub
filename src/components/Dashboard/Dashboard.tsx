import "./Dashboard.css";
import AIAssistant from "./AIAssistant";
import Documents from "./Documents";
// 🎯 Import component AIChat
import { AIChat } from "./AIChat/Aichat";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from "recharts";
import {
  Home, FileText, Bot, GraduationCap, Settings, LogOut,
  Bell, Gem, Coins, BookOpen, HardDrive, MessageSquare, Clock,
  Flame, Award, Heart, BookMarked, Library, ChevronRight, Trophy,
  Plus, Search, TrendingUp, TrendingDown,
} from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
}

const robotMind = new URL('../../assets/robot-mind.png', import.meta.url).href;
const robotFocus = new URL('../../assets/robot-focus.png', import.meta.url).href;

/* ==========================================================================
   ✨ CONFIG ANIMATION VARIANTS FOR LAYOUT SHELL
   ========================================================================== */
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const sidebarVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 70, damping: 18 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 17 },
  },
};

/* ---------- SIDEBAR ---------- */
const navItems = [
  { icon: Home, label: "Home" },
  { icon: FileText, label: "Documents" },
  { icon: Bot, label: "AI Chat" },
  { icon: GraduationCap, label: "Courses" },
];

function Sidebar({ active, setActive, onLogout }: { active: number; setActive: (i: number) => void; onLogout: () => void }) {
  return (
    <motion.div className="dh-sidebar" variants={sidebarVariants as any}>
      <div className="dh-logo">AI</div>
      <nav className="dh-nav">
        {navItems.map((it, i) => {
          const Icon = it.icon;
          return (
            <motion.button
              key={it.label}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(i)}
              className={`dh-nav-btn ${active === i ? "active" : ""}`}
              aria-label={it.label}
            >
              
              <Icon size={20} />
            </motion.button>
            
          );
        })}
      </nav>

      <motion.button whileHover={{ scale: 1.1 }} className="dh-nav-btn" aria-label="Settings">
        <Settings size={20} />
      </motion.button>


    </motion.div>
  );
}

/* ---------- HEADER WITH DROPDOWNS ---------- */
function Header({ onLogout }: { onLogout: () => void }) {
  const [showNoti, setShowNoti] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  // Giả lập danh sách thông báo
  const [notifications, setNotifications] = useState([
    { id: 1, text: "🤖 AI vừa tóm tắt xong tài liệu 'Calculus II'", time: "5 phút trước", unread: true },
    { id: 2, text: "🔥 Bạn vừa duy trì được Chuỗi học tập 5 ngày!", time: "2 giờ trước", unread: true },
    { id: 3, text: "🏆 Jack Nicklson vừa vượt qua bạn trên Leaderboard", time: "1 ngày trước", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <motion.header className="dh-header" variants={headerVariants as any} style={{ position: "relative" }}>
      <h1 className="dh-title">
        Dashboard
        <small>Welcome back, Mia — let's keep learning ✨</small>
      </h1>

      <div className="dh-header-right">
        <div className="dh-pill">
          <span className="dh-pill-item" style={{ color: "#0ea5e9" }}><Gem size={16} /> 144</span>
          <span className="dh-pill-item" style={{ color: "#f59e0b" }}><Coins size={16} /> 2,321</span>
        </div>

        {/* --- NÚT NOTIFICATION --- */}
        <div style={{ position: "relative" }}>
          <button
            className="dh-bell"
            aria-label="Notifications"
            onClick={() => {
              setShowNoti(!showNoti);
              setShowAvatarMenu(false);
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="dh-noti-badge">{unreadCount}</span>}
          </button>

          {/* BOX THÔNG BÁO GIẢ LẬP */}
          {showNoti && (
            <div className="dh-dropdown dh-noti-dropdown">
              <div className="dh-dropdown-header">
                <h3>Thông báo mới</h3>
                {unreadCount > 0 && <button onClick={markAllAsRead}>Đọc tất cả</button>}
              </div>
              <div className="dh-dropdown-list">
                {notifications.length === 0 ? (
                  <div className="dh-dropdown-empty">Không có thông báo nào</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`dh-noti-item ${n.unread ? "unread" : ""}`}>
                      <p className="dh-noti-text">{n.text}</p>
                      <span className="dh-noti-time">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- NÚT AVATAR M --- */}
        <div style={{ position: "relative" }}>
          <div
            className="dh-avatar"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowAvatarMenu(!showAvatarMenu);
              setShowNoti(false);
            }}
          >
            M
          </div>

          {/* MENU DROPDOWN AVATAR */}
          {showAvatarMenu && (
            <div className="dh-dropdown dh-avatar-dropdown">
              <div className="dh-user-info">
                <strong>Mia Dang</strong>
                <span>mia.dang@student.edu</span>
              </div>
              <hr />
              <button className="dh-logout-btn" onClick={onLogout}>
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}

/* ---------- STAT CARDS ---------- */
const statCards = [
  { label: "Tổng tài liệu", value: "128", icon: FileText, bg: "bg-blue" },
  { label: "Số môn học", value: "12", icon: BookOpen, bg: "bg-purple" },
  { label: "Dung lượng", value: "8.4GB", icon: HardDrive, bg: "bg-pink" },
  { label: "Lượt hỏi AI", value: "2,341", icon: MessageSquare, bg: "bg-yellow" },
  { label: "Tài liệu gần đây", value: "14", icon: Clock, bg: "bg-mint" },
];

function DashboardCards() {
  return (
    <motion.div
      className="dh-stats"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {statCards.map((c) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.label}
            whileHover={{ y: -6 }}
            className={`dh-stat ${c.bg}`}
          >
            <div className="dh-stat-icon"><Icon size={18} /></div>
            <div className="dh-stat-label">{c.label}</div>
            <div className="dh-stat-value">{c.value}</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* ---------- ROBOT CARD ---------- */
interface RobotProps {
  tag: string; name: string; desc: string; image: string; bg: string;
  gems: number; coins: number; floatDelay?: number;
}
function RobotCard({ tag, name, desc, image, bg, gems, coins, floatDelay = 0 }: RobotProps) {
  return (
    <div className={`dh-robot ${bg}`}>
      <div className="dh-robot-badges">
        <span className="dh-chip" style={{ color: "#0ea5e9" }}><Gem size={12} /> +{gems}</span>
        <span className="dh-chip" style={{ color: "#f59e0b" }}><Coins size={12} /> +{coins}</span>
      </div>
      <div className="dh-robot-fire"><Flame size={16} color="#f97316" /></div>
      <div className="dh-robot-body">
        <motion.img
          src={image}
          alt={name}
          className="dh-robot-img"
          loading="lazy"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
        />
        <div className="dh-robot-text">
          <div className="dh-robot-tag">{tag}</div>
          <h3 className="dh-robot-name">{name}</h3>
          <p className="dh-robot-desc">{desc}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- STUDY PROGRESS ---------- */
const chartData = [
  { m: "Sep", v: 22 }, { m: "Sep", v: 28 }, { m: "Oct", v: 24 }, { m: "Oct", v: 30 },
  { m: "Nov", v: 36 }, { m: "Nov", v: 32 }, { m: "Dec", v: 42 }, { m: "Dec", v: 48 },
  { m: "Jan", v: 52 }, { m: "Jan", v: 58 }, { m: "Feb", v: 62 }, { m: "Feb", v: 70 },
];

function StudyProgress() {
  return (
    <motion.div
      className="dh-panel"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ background: "linear-gradient(180deg,#f5faff 0%, #fff 100%)" }}
    >
      <div className="dh-chart-head">
        <div>
          <h3 className="dh-panel-title" style={{ marginBottom: 8 }}>Study Success</h3>
          <div className="dh-chart-meta">
            <span className="pct">78%</span>
            <span className="delta"><TrendingUp size={10} style={{ marginRight: 2 }} />+2.3%</span>
          </div>
        </div>
        <button className="dh-learnmore">Learn more</button>
      </div>
      <div style={{ height: 150 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} barCategoryGap={4}>
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Bar dataKey="v" radius={[6, 6, 6, 6]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={i >= chartData.length - 3 ? "#1e3a5f" : "#cbd5e1"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

/* ---------- AI USAGE / BADGES ---------- */
const badges = [
  { label: "Book Explorer", icon: BookMarked, bg: "var(--pink)", color: "#be185d" },
  { label: "Heart of Reader", icon: Heart, bg: "var(--blue)", color: "#0369a1" },
  { label: "Rainbow Reader", icon: Award, bg: "var(--coral)", color: "#c2410c" },
  { label: "Reading Passion", icon: Library, bg: "var(--mint)", color: "#15803d" },
];

const challenges = [
  { title: "Deep Focus", sub: "Extra challenge", icon: GraduationCap, bg: "bg-blue", reward: 250, gems: 0 },
  { title: "Day 10/32", sub: "Daily challenge", icon: Trophy, bg: "bg-yellow", reward: 200, gems: 5 },
  { title: "Java Master", sub: "Course challenge", icon: Flame, bg: "bg-coral", reward: 320, gems: 0 },
];

function AIUsagePanel() {
  return (
    <motion.div
      className="dh-panel"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="dh-panel-head">
        <h3 className="dh-panel-title">Badges <span className="dh-count">8</span></h3>
        <span className="dh-link">View all <ChevronRight size={14} /></span>
      </div>
      <div className="dh-badges-row" style={{ marginBottom: 24 }}>
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <motion.div key={b.label} whileHover={{ y: -4 }} className="dh-badge">
              <div className="dh-badge-circle" style={{ background: b.bg, color: b.color }}>
                <Icon size={22} />
              </div>
              <span>{b.label}</span>
            </motion.div>
          );
        })}
      </div>
      <div className="dh-panel-head">
        <h3 className="dh-panel-title">Challenges <span className="dh-count">12</span></h3>
        <span className="dh-link">View all <ChevronRight size={14} /></span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {challenges.map((c) => {
          const Icon = c.icon;
          return (
            <motion.div key={c.title} whileHover={{ x: 4 }} className={`dh-challenge ${c.bg}`}>
              <div className="dh-challenge-icon"><Icon size={20} /></div>
              <div className="dh-challenge-body">
                <div className="dh-challenge-title">{c.title}</div>
                <div className="dh-challenge-sub">{c.sub}</div>
              </div>
              <div className="dh-challenge-rewards">
                {c.gems > 0 && <span className="dh-chip" style={{ color: "#0ea5e9" }}><Gem size={11} /> +{c.gems}</span>}
                <span className="dh-chip" style={{ color: "#f59e0b" }}><Coins size={11} /> +{c.reward}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ---------- RECENT DOCUMENTS ---------- */
const categories = [
  { label: "Ethics", emoji: "🛡️", bg: "bg-coral" },
  { label: "Technology", emoji: "⚙️", bg: "bg-purple" },
  { label: "History", emoji: "🌍", bg: "bg-mint" },
  { label: "Science", emoji: "🔬", bg: "bg-blue" },
];

const docs = [
  { title: "Neural Networks — Lecture 04.pdf", sub: "Deep Learning", color: "#0369a1", bg: "var(--blue)" },
  { title: "World History Notes Chapter 12.pdf", sub: "History", color: "#15803d", bg: "var(--mint)" },
  { title: "Ethics in AI — Research Paper.pdf", sub: "Philosophy", color: "#c2410c", bg: "var(--coral)" },
  { title: "Calculus II Final Cheatsheet.pdf", sub: "Mathematics", color: "#be185d", bg: "var(--pink)" },
];

function RecentDocuments() {
  return (
    <motion.div
      className="dh-panel"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="dh-panel-head">
        <h3 className="dh-panel-title">Select Category <span className="dh-count">34</span></h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="dh-icon-btn"><Plus size={16} /></button>
          <button className="dh-icon-btn"><Search size={16} /></button>
        </div>
      </div>
      <div className="dh-cats">
        {categories.map((c) => (
          <motion.div key={c.label} whileHover={{ y: -3 }} className={`dh-cat ${c.bg}`}>
            <span className="dh-cat-emoji">{c.emoji}</span>
            <span>{c.label}</span>
          </motion.div>
        ))}
      </div>
      <h3 className="dh-panel-title" style={{ marginBottom: 10 }}>Recent Documents</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {docs.map((d) => (
          <div key={d.title} className="dh-doc">
            <div className="dh-doc-icon" style={{ background: d.bg, color: d.color }}>
              <FileText size={20} />
            </div>
            <div className="dh-doc-body">
              <div className="dh-doc-title">{d.title}</div>
              <div className="dh-doc-sub">
                <span>{d.sub}</span> · <span>2h ago</span>
                <span className="dh-doc-ai-badge">AI Summarized</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------- LEADERBOARD ---------- */
const top3 = [
  { name: "Jack Nicklson", score: "48,105", color: "#0ea5e9", initial: "J" },
  { name: "Brody Bellson", score: "65,322", color: "#16a34a", initial: "B" },
  { name: "Timoty Bell", score: "21,780", color: "#ef4444", initial: "T" },
];

const rest = [
  { rank: 4, name: "Brody Bennet", pts: "19,231", trend: "up" as const },
  { rank: 5, name: "Anna Doe", pts: "15,322", trend: "down" as const },
  { rank: 6, name: "Sam Kim", pts: "15,101", trend: "up" as const },
  { rank: 7, name: "Lia Park", pts: "13,899", trend: "down" as const },
  { rank: 8, name: "Theo Vance", pts: "12,456", trend: "down" as const },
];

function Leaderboard() {
  return (
    <motion.div
      className="dh-leader-panel"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="dh-leader-rays" />
      <h2 className="dh-leader-title">Leaderboard</h2>
      <div className="dh-podium">
        <div className="dh-podium-col">
          <div className="dh-podium-avatar" style={{ borderColor: top3[0].color, background: "#d9ecff" }}>{top3[0].initial}</div>
          <div className="dh-podium-name">{top3[0].name}</div>
          <div className="dh-podium-score" style={{ borderColor: top3[0].color, color: top3[0].color }}><Gem size={10} />{top3[0].score}</div>
          <div className="dh-podium-block silver">#2</div>
        </div>
        <div className="dh-podium-col">
          <div className="dh-podium-avatar" style={{ borderColor: top3[1].color, background: "#ddf9d8", width: 64, height: 64 }}>{top3[1].initial}</div>
          <div className="dh-podium-name">{top3[1].name}</div>
          <div className="dh-podium-score" style={{ borderColor: top3[1].color, color: top3[1].color }}><Gem size={10} />{top3[1].score}</div>
          <div className="dh-podium-block gold">#1</div>
        </div>
        <div className="dh-podium-col">
          <div className="dh-podium-avatar" style={{ borderColor: top3[2].color, background: "#ffddf2" }}>{top3[2].initial}</div>
          <div className="dh-podium-name">{top3[2].name}</div>
          <div className="dh-podium-score" style={{ borderColor: top3[2].color, color: top3[2].color }}><Gem size={10} />{top3[2].score}</div>
          <div className="dh-podium-block bronze">#3</div>
        </div>
      </div>
      <div className="dh-leader-list">
        {rest.map((r) => (
          <div key={r.rank} className="dh-leader-row">
            <span className="dh-leader-rank">#{r.rank}</span>
            <div className="dh-leader-avatar">{r.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div className="dh-leader-name">{r.name}</div>
              <span className="dh-leader-pts"><Gem size={10} color="#0ea5e9" />{r.pts}</span>
            </div>
            <span className={`dh-leader-trend ${r.trend}`}>
              {r.trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------- HOME CONTENT ---------- */
// 🎯 Đã fix: Thêm nhận tham số onLogout từ component cha truyền xuống
function HomeContent({ onLogout }: { onLogout: () => void }) {
  return (
    <>
      {/* 🎯 Đã fix: Truyền hàm onLogout vào Header */}
      <Header onLogout={onLogout} />
      <DashboardCards />

      <div style={{ height: 24 }} />

      <div className="dh-grid">
        <div className="dh-col-left">
          <motion.div
            className="dh-robots"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <RobotCard
              tag="Mind Unlocked"
              name="Mind Explorer"
              desc="A deep dive into thoughts, emotions and AI-assisted learning."
              image={robotMind}
              bg="bg-yellow"
              gems={5}
              coins={145}
            />
            <RobotCard
              tag="Focus Boost"
              name="Deep Focus AI"
              desc="Personalized concentration coaching for long study sessions."
              image={robotFocus}
              bg="bg-blue"
              gems={0}
              coins={0}
              floatDelay={0.6}
            />
          </motion.div>

          <div className="dh-two-col">
            <StudyProgress />
            <AIUsagePanel />
          </div>

          <RecentDocuments />
        </div>

        <div className="dh-col-right">
          <Leaderboard />
        </div>
      </div>
    </>
  );
}

/* ---------- MAIN DASHBOARD ---------- */
export default function Dashboard({ onLogout }: DashboardProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="dh-root">
      <motion.div
        className="dh-shell"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <Sidebar active={active} setActive={setActive} onLogout={onLogout} />

        <main className="dh-main">
          {/* 🎯 Đã fix: Truyền tiếp hàm onLogout vào HomeContent */}
          {active === 0 && <HomeContent onLogout={onLogout} />}
          {active === 1 && <Documents />}

          {active === 2 && (
            <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
              <AIChat />
            </div>
          )}

          {active === 3 && <div style={{ padding: "32px", textAlign: "center" }}><h2>Courses Coming Soon</h2></div>}
        </main>
      </motion.div>

      {active !== 2 && <AIAssistant />}
    </div>
  );
}