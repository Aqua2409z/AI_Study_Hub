"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  FileText,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  UserCheck,
  UserMinus,
  Award,
  SlidersHorizontal,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import { userService, UserDTO } from "../services/userService";
import { feedbackService, FeedbackDTO } from "../services/feedbackService"; // 🎯 Tích hợp phân hệ API Feedback mới

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

const queue = [
  { id: "p1", kind: "Tài liệu", title: "SWP391 — Đề thi giữ kỳ", author: "Minh Anh", status: "pending" },
  { id: "p2", kind: "Quiz", title: "Bộ 50 câu Testing", author: "Quang Hà", status: "pending" },
  { id: "p3", kind: "Flashcards", title: "OOP Concepts Deck", author: "Tuấn Kiệt", status: "approved" },
  { id: "p4", kind: "Tài liệu", title: "Java Web Lab 4", author: "Hà Linh", status: "rejected" },
];

const statusStyles: Record<string, { Icon: typeof CheckCircle2; text: string; cls: string }> = {
  pending: { Icon: Clock, text: "Chờ duyệt", cls: "bg-warning/20 text-warning-foreground" },
  approved: { Icon: CheckCircle2, text: "Đã duyệt", cls: "bg-success/15 text-success" },
  rejected: { Icon: XCircle, text: "Từ chối", cls: "bg-destructive/15 text-destructive" },
};

const feedbackStatusBadge: Record<string, string> = {
  OPEN: "bg-red-500/15 text-red-500",
  IN_PROGRESS: "bg-warning/20 text-warning-foreground",
  RESOLVED: "bg-success/15 text-success",
  CLOSED: "bg-muted text-muted-foreground",
};

export default function AdminPage() {
  // ── 🎯 STATE CHUYỂN TAB QUẢN TRỊ 3 PHÂN HỆ ──
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "users" | "feedbacks">("overview");

  // States Tab 2: Users
  const [usersList, setUsersList] = useState<UserDTO[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);

  // States Tab 3: Feedbacks Góp ý
  const [feedbacksList, setFeedbacksList] = useState<FeedbackDTO[]>([]);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  // 🔄 ĐỒNG BỘ DATA CHO TAB THÀNH VIÊN
  const loadSystemUsers = async () => {
    if (activeSubTab !== "users") return;
    setIsTableLoading(true);
    try {
      const res = await userService.adminGetUsers({ page: currentPage, size: 7, keyword: searchKeyword, sort: "newest" });
      if (res.success) { setUsersList(res.data.items); setTotalPages(res.data.totalPages); }
    } catch (err) { console.error(err); } finally { setIsTableLoading(false); }
  };

  // 🔄 ĐỒNG BỘ DATA CHO TAB PHẢN HỒI GÓP Ý (ENDPOINT 2 FEEDBACK)
  const loadSystemFeedbacks = async () => {
    if (activeSubTab !== "feedbacks") return;
    setIsFeedbackLoading(true);
    try {
      const res = await feedbackService.adminGetFeedbacks({ page: 0, size: 20 });
      if (res.success) { setFeedbacksList(res.data.items); }
    } catch (err) { console.error(err); } finally { setIsFeedbackLoading(false); }
  };

  useEffect(() => { loadSystemUsers(); }, [activeSubTab, currentPage, searchKeyword]);
  useEffect(() => { loadSystemFeedbacks(); }, [activeSubTab]);

  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    try {
      const res = await userService.adminToggleUserActive(userId, !currentStatus);
      if (res.success) setUsersList(prev => prev.map(u => u.id === userId ? res.data : u));
    } catch (err: any) { alert(err.message || "Lỗi khóa tài khoản"); }
  };

  const handleRoleChange = async (userId: number, newRole: "STUDENT" | "REVIEWER" | "ADMIN") => {
    try {
      const res = await userService.adminUpdateUserRole(userId, newRole);
      if (res.success) setUsersList(prev => prev.map(u => u.id === userId ? res.data : u));
    } catch (err: any) { alert(err.message || "Lỗi quyền"); }
  };

  const handleRewardBadge = async (userId: number) => {
    try {
      const res = await userService.adminAssignBadgeToUser(userId, 2);
      if (res.success) alert("Đã gán huy hiệu danh giá cho thành viên thành công! 🎖️");
    } catch (err) { alert("Không thể gán!"); }
  };

  // 🛠️ THAO TÁC TAB 3: Đổi tiến trình xử lý góp ý (ENDPOINT 3 FEEDBACK)
  const handleFeedbackStatusUpdate = async (id: number, newStatus: any) => {
    try {
      const res = await feedbackService.adminUpdateFeedbackStatus(id, { status: newStatus, adminNote: "Đã rà soát hệ thống" });
      if (res.success) {
        setFeedbacksList(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
      }
    } catch (err) {
      alert("Cập nhật trạng thái feedback thất bại");
    }
  };

  return (
    <div className="space-y-6 app-shell-font">
      {/* Page Title & Sub-tabs Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2">
          <Shield className="text-primary animate-pulse" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        </div>

        {/* ── NÂNG CẤP THANH TAB ĐIỀU HƯỚNG 3 PHÂN HỆ PHỤ ── */}
        <div className="flex p-1 bg-muted rounded-xl border border-border/50 self-start lg:self-auto flex-wrap gap-1">
          <button onClick={() => setActiveSubTab("overview")} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeSubTab === "overview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            Tổng quan
          </button>
          <button onClick={() => setActiveSubTab("users")} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeSubTab === "users" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            Thành viên
          </button>
          <button onClick={() => setActiveSubTab("feedbacks")} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeSubTab === "feedbacks" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            Góp ý & Lỗi
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === "overview" && (
          <motion.div key="overview-tab" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
            {/* Giữ nguyên khối stats và chart tổng quan cũ của ông */}
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
                    <defs><linearGradient id="ai-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.55 0.14 165)" stopOpacity={0.35} /><stop offset="100%" stopColor="oklch(0.55 0.14 165)" stopOpacity={0} /></linearGradient></defs>
                    <XAxis dataKey="d" axisLine={false} tickLine={false} fontSize={12} stroke="oklch(0.5 0.02 250)" />
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="v" stroke="oklch(0.55 0.14 165)" strokeWidth={2.5} fill="url(#ai-grad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          </motion.div>
        )}

        {activeSubTab === "users" && (
          <motion.div key="users-tab" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            {/* Khối quản trị bảng Table Users cũ giữ nguyên vẹn */}
            <div className="surface-card p-4 flex gap-3 bg-card/60 backdrop-blur-md">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
                <input type="text" value={searchKeyword} onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(0); }} placeholder="Tìm kiếm thành viên..." className="w-full pl-10 pr-4 h-10 rounded-xl bg-muted/50 border border-transparent focus:bg-card focus:border-primary/50 outline-none text-sm font-medium text-foreground transition-all" />
              </div>
            </div>
            <div className="surface-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground border-b border-border/50">
                  <tr><th className="text-left px-5 py-3.5">Thành viên FPT</th><th className="text-left px-5 py-3.5">Vai trò</th><th className="text-left px-5 py-3.5">Trạng thái</th><th className="px-5 py-3.5 text-right">Thao tác</th></tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {usersList.map(user => (
                    <tr key={user.id} className="hover:bg-muted/20">
                      <td className="px-5 py-3 flex items-center gap-3"><div className="size-9 rounded-xl bg-ink text-white font-bold text-xs grid place-items-center">{user.fullName.slice(0,2).toUpperCase()}</div><div className="text-left"><div className="font-semibold text-foreground">{user.fullName}</div><div className="text-[11px] text-muted-foreground font-mono">{user.email}</div></div></td>
                      <td className="px-5 py-3 text-left"><select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value as any)} className="bg-muted text-foreground text-xs font-bold rounded-lg px-2 py-1"><option value="STUDENT">STUDENT</option><option value="REVIEWER">REVIEWER</option><option value="ADMIN">ADMIN</option></select></td>
                      <td className="px-5 py-3 text-left"><span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${user.isActive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>{user.isActive ? "Hoạt động" : "Bị khóa"}</span></td>
                      <td className="px-5 py-3 text-right"><div className="inline-flex gap-1.5"><button onClick={() => handleRewardBadge(user.id)} className="size-8 rounded-lg border border-border grid place-items-center hover:text-primary transition-colors cursor-pointer"><Award size={13} /></button><button onClick={() => handleToggleActive(user.id, user.isActive)} className={`size-8 rounded-lg grid place-items-center ${user.isActive ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"} cursor-pointer`}>{user.isActive ? <UserMinus size={13} /> : <UserCheck size={13} />}</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── 🆕 PHÂN HỆ TRANG MỚI: QUẢN LÝ GÓP Ý & BÁO LỖI HỆ THỐNG ── */}
        {activeSubTab === "feedbacks" && (
          <motion.div key="feedbacks-tab" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="surface-card overflow-hidden bg-card">
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
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground font-mono text-xs">Đang nạp cơ sở dữ liệu Feedback...</td>
                  </tr>
                ) : feedbacksList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground font-medium text-xs">Hệ thống ổn định — Chưa có phản hồi lỗi nào từ sinh viên.</td>
                  </tr>
                ) : (
                  feedbacksList.map((f) => (
                    <tr key={f.id} className="hover:bg-muted/10 transition-colors group">
                      {/* Cột 1: Chi tiết lỗi */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-foreground text-sm">{f.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed max-w-md">{f.content}</div>
                        <span className="text-[10px] font-mono text-muted-foreground/60 block mt-1">Mã Ticket: #FB{f.id}</span>
                      </td>

                      {/* Cột 2: Route đường dẫn giao diện */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        {f.screenUrl ? (
                          <a href={f.screenUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary font-bold font-mono hover:underline">
                            {f.screenUrl} <ExternalLink size={11} />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground font-mono">N/A</span>
                        )}
                      </td>

                      {/* Cột 3: Tag Trạng thái */}
                      <td className="px-5 py-4">
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${feedbackStatusBadge[f.status]}`}>
                          {f.status}
                        </span>
                      </td>

                      {/* Cột 4: Dropdown cập nhật nhanh tiến trình */}
                      <td className="px-5 py-4 text-right">
                        <select
                          value={f.status}
                          onChange={(e) => handleFeedbackStatusUpdate(f.id, e.target.value as any)}
                          className="bg-muted text-foreground text-xs font-bold rounded-lg px-2.5 py-1.5 border border-border/60 focus:border-primary/50 outline-none cursor-pointer"
                        >
                          <option value="OPEN">OPEN (Mở mới)</option>
                          <option value="IN_PROGRESS">IN_PROGRESS (Đang sửa)</option>
                          <option value="RESOLVED">RESOLVED (Đã fix)</option>
                          <option value="CLOSED">CLOSED (Đóng đóng)</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}