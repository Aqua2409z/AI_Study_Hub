"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Users, FileText, Bot, AlertTriangle, CheckCircle2, Clock,
  XCircle, Search, UserCheck, UserMinus, Award, MessageSquare, ExternalLink
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import { userService, UserDTO } from "../services/userService";
import { feedbackService, FeedbackDTO } from "../services/feedbackService";
import { activityLogService, ActivityLogDTO } from "../services/activityLogService";
import { analyticsService, AiUsageDTO } from "../services/analyticsService";
import { MOCK_USERS } from "../lib/admin-mock-data";
import AdminAcademicTab from "./AdminAcademicTab";
import AdminRolesTab from "./AdminRolesTab";
import AdminReportsTab from "./AdminReportsTab";
import AdminMarketplaceTab from "./AdminMarketplaceTab";
import AdminBadgesTab from "./AdminBadgesTab";
import AdminSystemConfigTab from "./AdminSystemConfigTab";

// ─── CONFIGURATION CONSTANTS ────────────────────────────────────────────────
const SUB_TABS = [
  { id: "overview", label: "Tổng quan" },
  { id: "users", label: "Thành viên" },
  { id: "feedbacks", label: "Góp ý & Lỗi" },
  { id: "logs", label: "Nhật ký" },
  { id: "academic", label: "Học thuật" },
  { id: "roles", label: "Phân quyền" },
  { id: "reports", label: "Báo cáo vi phạm" },
  { id: "marketplace", label: "Chợ Nội Dung" },
  { id: "badges", label: "Huy hiệu" },
  { id: "system-configs", label: "Cấu hình HT" },
];

const stats = [
  { label: "Người dùng", value: "2,481", icon: Users, color: "165", trend: "+12%" },
  { label: "Tài liệu", value: "18,302", icon: FileText, color: "200", trend: "+8%" },
  { label: "Lượt hỏi AI", value: "94,521", icon: Bot, color: "35", trend: "+24%" },
  { label: "Báo cáo mới", value: "12", icon: AlertTriangle, color: "0", trend: "+3" },
];

const trend = [
  { d: "T2", v: 1240 }, { d: "T3", v: 1380 }, { d: "T4", v: 1520 },
  { d: "T5", v: 1410 }, { d: "T6", v: 1680 }, { d: "T7", v: 2010 }, { d: "CN", v: 1820 },
];

const feedbackStatusBadge: Record<string, string> = {
  OPEN: "bg-red-500/15 text-red-500",
  IN_PROGRESS: "bg-warning/20 text-warning-foreground",
  RESOLVED: "bg-success/15 text-success",
  CLOSED: "bg-muted text-muted-foreground",
};

export default function AdminPage() {
  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "users" | "feedbacks" | "logs" | "academic" | "roles" | "reports" | "marketplace" | "badges" | "system-configs">("overview");

  const [usersList, setUsersList] = useState<UserDTO[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const [feedbacksList, setFeedbacksList] = useState<FeedbackDTO[]>([]);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  const [logsList, setLogsList] = useState<ActivityLogDTO[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [logKeyword, setLogKeyword] = useState("");
  const [logSort, setLogSort] = useState("newest");
  const [logPage, setLogPage] = useState(0);
  const [logTotalPages, setLogTotalPages] = useState(1);

  const [aiUsageList, setAiUsageList] = useState<AiUsageDTO[]>([]);
  const [isAiUsageLoading, setIsAiUsageLoading] = useState(false);

  // ─── DATA LOADERS (API INTEGRATION) ────────────────────────────────────────
  const loadSystemUsers = async () => {
    setIsTableLoading(true);
    setTimeout(() => {
      const filtered = MOCK_USERS.filter(u =>
        u.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        u.email.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setUsersList(filtered);
      setTotalPages(1);
      setIsTableLoading(false);
    }, 500);
  };

  const loadSystemFeedbacks = async () => {
    if (activeSubTab !== "feedbacks") return;
    setIsFeedbackLoading(true);
    try {
      const res = await feedbackService.adminGetFeedbacks({ page: 0, size: 20 });
      if (res.success && res.data) { setFeedbacksList(res.data.items); }
    } catch (err) { console.error(err); } finally { setIsFeedbackLoading(false); }
  };

  const loadActivityLogs = async () => {
    if (activeSubTab !== "logs") return;
    setIsLogsLoading(true);
    try {
      const res = await activityLogService.adminGetActivityLogs({ page: logPage, size: 10, keyword: logKeyword, sort: logSort });
      if (res.success && res.data) {
        setLogsList(res.data.items);
        setLogTotalPages(res.data.totalPages || 1);
      }
    } catch (err) { console.error(err); } finally { setIsLogsLoading(false); }
  };

  const loadAiUsage = async () => {
    if (activeSubTab !== "overview") return;
    setIsAiUsageLoading(true);
    try {
      const res = await analyticsService.adminGetAiUsage();
      if (res.success && res.data) { setAiUsageList(res.data.items); }
    } catch (err) { console.error(err); } finally { setIsAiUsageLoading(false); }
  };

  useEffect(() => { loadSystemUsers(); }, [activeSubTab, currentPage, searchKeyword]);
  useEffect(() => { loadSystemFeedbacks(); }, [activeSubTab]);
  useEffect(() => { loadActivityLogs(); }, [activeSubTab, logPage, logKeyword, logSort]);
  useEffect(() => { loadAiUsage(); }, [activeSubTab]);

  // ─── ACTION HANDLERS ───────────────────────────────────────────────────────
  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    try {
      const res = await userService.adminToggleUserActive(userId, !currentStatus);
      if (res.success && res.data) setUsersList(prev => prev.map(u => u.id === userId ? res.data! : u));
    } catch (err: any) { alert(err.message || "Lỗi khóa tài khoản"); }
  };

  const handleRoleChange = async (userId: number, newRole: "STUDENT" | "REVIEWER" | "ADMIN") => {
    try {
      const res = await userService.adminUpdateUserRole(userId, newRole);
      if (res.success && res.data) setUsersList(prev => prev.map(u => u.id === userId ? res.data! : u));
    } catch (err: any) { alert(err.message || "Lỗi cập nhật quyền hạn"); }
  };

  const handleRewardBadge = async (userId: number) => {
    try {
      const res = await userService.adminAssignBadgeToUser(userId, 2);
      if (res.success) alert("Đã gán huy hiệu danh giá thành công! 🎖️");
    } catch (err: any) { alert(`Không thể gán: ${err.message || "Lỗi không xác định"}`); }
  };

  const handleFeedbackStatusUpdate = async (id: number, newStatus: any) => {
    try {
      const res = await feedbackService.adminUpdateFeedbackStatus(id, { status: newStatus, adminNote: "Đã rà soát hệ thống" });
      if (res.success) setFeedbacksList(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    } catch (err) { alert("Cập nhật trạng thái feedback thất bại"); }
  };

  const renderTabContent = () => {
    switch (activeSubTab) {
      case "overview":
        return <OverviewSection isAiUsageLoading={isAiUsageLoading} aiUsageList={aiUsageList} />;
      case "users":
        return (
          <UsersSection 
            searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} setCurrentPage={setCurrentPage}
            usersList={usersList} handleRoleChange={handleRoleChange} handleRewardBadge={handleRewardBadge} handleToggleActive={handleToggleActive}
          />
        );
      case "feedbacks":
        return <FeedbacksSection isFeedbackLoading={isFeedbackLoading} feedbacksList={feedbacksList} handleFeedbackStatusUpdate={handleFeedbackStatusUpdate} />;
      case "logs":
        return (
          <LogsSection 
            logKeyword={logKeyword} setLogKeyword={setLogKeyword} logSort={logSort} setLogSort={setLogSort}
            isLogsLoading={isLogsLoading} logsList={logsList} logPage={logPage} logTotalPages={logTotalPages} setLogPage={setLogPage}
          />
        );
      case "academic": return <AdminAcademicTab />;
      case "roles": return <AdminRolesTab />;
      case "reports": return <div className="p-6"><AdminReportsTab /></div>;
      case "marketplace": return <div className="p-6"><AdminMarketplaceTab /></div>;
      case "badges": return <div className="p-6"><AdminBadgesTab /></div>;
      case "system-configs": return <div className="p-6"><AdminSystemConfigTab /></div>;
      default: return null;
    }
  };

  return (
    /* 🛠️ CHÌA KHÓA: Injected bẫy loại bỏ thanh cuộn dọc [&::-webkit-scrollbar]:hidden vào wrapper chính dưới đây */
    <div className="space-y-6 app-shell-font w-full max-w-full overflow-y-auto h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* ── HEADER & TAB BAR CONTROLS ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border/40 pb-4 w-full">
        <div className="flex items-center gap-2">
          <Shield className="text-primary animate-pulse" />
          <h1 className="text-1xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        </div>

        <div className="flex p-1 bg-muted rounded-xl border border-border/50 overflow-x-auto max-w-full gap-0.5 scrollbar-hidden self-start xl:self-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-2.5 lg:px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT RENDERING WITH ANIMATION ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── SUB-SECTIONS COMPONENTS ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function OverviewSection({ isAiUsageLoading, aiUsageList }: { isAiUsageLoading: boolean; aiUsageList: AiUsageDTO[] }) {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="surface-card p-5 text-left">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl grid place-items-center" style={{ background: `oklch(0.55 0.14 ${s.color} / 0.12)`, color: `oklch(0.45 0.14 ${s.color})` }}>
                  <Icon size={18} />
                </div>
                <span className="text-xs font-medium text-success">{s.trend}</span>
              </div>
              <div className="mt-3 text-2xl font-bold font-display tracking-tight text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </section>

      <section className="surface-card p-5">
        <div className="mb-4 text-left"><h2 className="font-display text-lg font-semibold text-foreground">Lượt sử dụng AI tuần này</h2></div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="ai-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.55 0.14 165)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="oklch(0.55 0.14 165)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} fontSize={12} stroke="oklch(0.5 0.02 250)" />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="v" stroke="oklch(0.55 0.14 165)" strokeWidth={2.5} fill="url(#ai-grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="surface-card p-5">
        <div className="mb-4 text-left"><h2 className="font-display text-lg font-semibold text-foreground">Chi tiết sử dụng AI của người dùng</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Kỳ (Period)</th>
                <th className="px-4 py-3 text-right">Chat</th>
                <th className="px-4 py-3 text-right">Quiz</th>
                <th className="px-4 py-3 text-right">Flashcard</th>
                <th className="px-4 py-3 text-right">Tokens ước tính</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isAiUsageLoading ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground text-xs font-mono">Đang nạp dữ liệu...</td></tr>
              ) : aiUsageList.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">Chưa có dữ liệu.</td></tr>
              ) : (
                aiUsageList.map((usage, idx) => (
                  <tr key={idx} className="hover:bg-muted/10">
                    <td className="px-4 py-3 font-mono font-bold text-primary">#{usage.userId}</td>
                    <td className="px-4 py-3 font-mono text-xs">{usage.period}</td>
                    <td className="px-4 py-3 text-right">{usage.chatRequests} lượt</td>
                    <td className="px-4 py-3 text-right">{usage.quizGenerations} lượt</td>
                    <td className="px-4 py-3 text-right">{usage.flashcardGenerations} lượt</td>
                    <td className="px-4 py-3 text-right font-mono text-success font-bold">{usage.estimatedTokens.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function UsersSection({ searchKeyword, setSearchKeyword, setCurrentPage, usersList, handleRoleChange, handleRewardBadge, handleToggleActive }: any) {
  return (
    <div className="space-y-4">
      <div className="surface-card p-4 flex gap-3 bg-card/60 backdrop-blur-md">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
          <input type="text" value={searchKeyword} onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(0); }} placeholder="Tìm kiếm thành viên..." className="w-full pl-10 pr-4 h-10 rounded-xl bg-muted/50 border border-transparent focus:bg-card focus:border-primary/50 outline-none text-sm font-medium text-foreground transition-all" />
        </div>
      </div>
      <div className="surface-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground border-b border-border/50">
            <tr>
              <th className="text-left px-5 py-3.5">Thành viên FPT</th>
              <th className="text-left px-5 py-3.5">Vai trò</th>
              <th className="text-left px-5 py-3.5">Trạng thái</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {usersList.map((user: any) => (
              <tr key={user.id} className="hover:bg-muted/20">
                <td className="px-5 py-3 flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-ink text-white font-bold text-xs grid place-items-center">{user.fullName.slice(0, 2).toUpperCase()}</div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">{user.fullName}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{user.email}</div>
                  </div>
                </td>
                <td className="px-5 py-3 text-left">
                  <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value as any)} className="bg-muted text-foreground text-xs font-bold rounded-lg px-2 py-1">
                    <option value="STUDENT">STUDENT</option>
                    <option value="REVIEWER">REVIEWER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-5 py-3 text-left">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${user.isActive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                    {user.isActive ? "Hoạt động" : "Bị khóa"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-1.5">
                    <button onClick={() => handleRewardBadge(user.id)} className="size-8 rounded-lg border border-border grid place-items-center hover:text-primary transition-colors cursor-pointer"><Award size={13} /></button>
                    <button onClick={() => handleToggleActive(user.id, user.isActive)} className={`size-8 rounded-lg grid place-items-center ${user.isActive ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"} cursor-pointer`}>
                      {user.isActive ? <UserMinus size={13} /> : <UserCheck size={13} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeedbacksSection({ isFeedbackLoading, feedbacksList, handleFeedbackStatusUpdate }: any) {
  return (
    <div className="surface-card overflow-hidden bg-card">
      <div className="p-5 flex items-center justify-between border-b border-border bg-card">
        <div className="text-left">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageSquare size={18} className="text-coral" /> Hàng chờ xử lý góp ý hệ thống
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Danh sách các báo cáo lỗi giao diện, trải nghiệm RAG từ sinh viên FPT</p>
        </div>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider border-b border-border/50">
          <tr>
            <th className="px-5 py-3.5">Nội dung báo cáo lỗi</th>
            <th className="px-5 py-3.5 hidden md:table-cell">Màn hình bị lỗi</th>
            <th className="px-5 py-3.5">Trạng thái xử lý</th>
            <th className="px-5 py-3.5 text-right">Cấu hình tiến độ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {isFeedbackLoading ? (
            <tr><td colSpan={4} className="py-12 text-center text-muted-foreground font-mono text-xs">Đang nạp cơ sở dữ liệu Feedback...</td></tr>
          ) : feedbacksList.length === 0 ? (
            <tr><td colSpan={4} className="py-12 text-center text-muted-foreground font-medium text-xs">Hệ thống ổn định — Chưa có phản hồi lỗi nào từ sinh viên.</td></tr>
          ) : (
            feedbacksList.map((f: any) => (
              <tr key={f.id} className="hover:bg-muted/10 transition-colors group">
                <td className="px-5 py-4">
                  <div className="font-semibold text-foreground text-sm">{f.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed max-w-md">{f.content}</div>
                  <span className="text-[10px] font-mono text-muted-foreground/60 block mt-1">Mã Ticket: #FB{f.id}</span>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  {f.screenUrl ? (
                    <a href={f.screenUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary font-bold font-mono hover:underline">
                      {f.screenUrl} <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono">N/A</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[9px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${feedbackStatusBadge[f.status]}`}>
                    {f.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <select value={f.status} onChange={(e) => handleFeedbackStatusUpdate(f.id, e.target.value as any)} className="bg-muted text-foreground text-xs font-bold rounded-lg px-2.5 py-1.5 border border-border/60 focus:border-primary/50 outline-none cursor-pointer">
                    <option value="OPEN">OPEN (Mở mới)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (Đang sửa)</option>
                    <option value="RESOLVED">RESOLVED (Đã fix)</option>
                    <option value="CLOSED">CLOSED (Đóng hẳn)</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function LogsSection({ logKeyword, setLogKeyword, logSort, setLogSort, isLogsLoading, logsList, logPage, logTotalPages, setLogPage }: any) {
  return (
    <div className="space-y-4">
      <div className="surface-card p-4 flex gap-3 bg-card/60 backdrop-blur-md">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
          <input type="text" value={logKeyword} onChange={(e) => { setLogKeyword(e.target.value); setLogPage(0); }} placeholder="Tìm kiếm nhật ký..." className="w-full pl-10 pr-4 h-10 rounded-xl bg-muted/50 border border-transparent focus:bg-card focus:border-primary/50 outline-none text-sm font-medium text-foreground transition-all" />
        </div>
        <select value={logSort} onChange={(e) => { setLogSort(e.target.value); setLogPage(0); }} className="bg-muted text-foreground text-sm font-medium rounded-xl px-4 py-2 border border-border/60 outline-none focus:border-primary/50 cursor-pointer">
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>
      
      <div className="surface-card overflow-hidden bg-card">
        <div className="p-5 flex items-center justify-between border-b border-border bg-card">
          <div className="text-left">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Nhật ký hoạt động (Activity Logs)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Danh sách các thao tác và sự kiện trên hệ thống</p>
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider border-b border-border/50">
            <tr>
              <th className="px-5 py-3.5">Hành động</th>
              <th className="px-5 py-3.5">Mục tiêu</th>
              <th className="px-5 py-3.5">Metadata</th>
              <th className="px-5 py-3.5 text-right">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLogsLoading ? (
              <tr><td colSpan={4} className="py-12 text-center text-muted-foreground font-mono text-xs">Đang nạp dữ liệu...</td></tr>
            ) : logsList.length === 0 ? (
              <tr><td colSpan={4} className="py-12 text-center text-muted-foreground font-medium text-xs">Chưa có hoạt động nào.</td></tr>
            ) : (
              logsList.map((log: any) => (
                <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-foreground text-sm">{log.action}</div>
                    <span className="text-[10px] font-mono text-muted-foreground/60 block mt-1">Actor ID: {log.actorId}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs font-bold font-mono text-primary">{log.targetType}</div>
                    <span className="text-[10px] font-mono text-muted-foreground/60 block mt-1">ID: {log.targetId}</span>
                  </td>
                  <td className="px-5 py-4">
                    <pre className="text-[10px] text-muted-foreground bg-muted p-2 rounded-md max-w-xs overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="p-4 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Trang {logPage + 1} / {logTotalPages}</span>
          <div className="flex gap-2">
            <button disabled={logPage === 0} onClick={() => setLogPage((p: number) => Math.max(0, p - 1))} className="px-4 py-1.5 rounded-lg text-xs font-bold bg-muted text-foreground disabled:opacity-50 transition-all hover:bg-muted/80">Trước</button>
            <button disabled={logPage >= logTotalPages - 1} onClick={() => setLogPage((p: number) => p + 1)} className="px-4 py-1.5 rounded-lg text-xs font-bold bg-muted text-foreground disabled:opacity-50 transition-all hover:bg-muted/80">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}