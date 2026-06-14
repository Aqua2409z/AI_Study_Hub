"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  MapPin, 
  Award, 
  Flame, 
  BookMarked, 
  FileText, 
  GraduationCap, 
  Settings, 
  LogOut, 
  X, 
  User, 
  Key, 
  GraduationCap as CapIcon,
  CheckCircle2,
  AlertCircle,
  Camera
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const badges = [
  { name: "Người mới", desc: "Hoàn thành onboarding", color: "165" },
  { name: "Chăm chỉ", desc: "Học 7 ngày liên tiếp", color: "35" },
  { name: "Đóng góp", desc: "Upload 10 tài liệu", color: "200" },
  { name: "Quiz Master", desc: "Đạt 100 điểm", color: "75" },
];

const stats = [
  { label: "Notebook", value: 5, icon: BookMarked },
  { label: "Tài liệu", value: 42, icon: FileText },
  { label: "Quiz đã làm", value: 28, icon: GraduationCap },
];

interface ProfilePageProps {
  onLogout?: () => void;
}

export default function ProfilePage({ onLogout }: ProfilePageProps) {
  // ── STATE QUẢN LÝ THÔNG TIN NGƯỜI DÙNG CHÍNH ──
  const [userInfo, setUserInfo] = useState({
    fullName: "Lê Trần Anh Khoa",
    studentId: "SE192585",
    email: "anhkhoa@fpt.edu.vn",
    location: "FPT University HCM",
    avatarInitials: "AK",
    avatarUrl: null as string | null,
    major: "Kỹ thuật Phần mềm (Software Engineering)",
    specialization: "Hệ thống nhúng & IoT",
    currentPassword: "Password123@", // Mật khẩu mẫu hiện tại trong hệ thống
  });

  // States quản lý UI và Form của hộp thoại Cài đặt
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editName, setEditName] = useState(userInfo.fullName);
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(userInfo.avatarUrl);
  
  // 🔒 HỆ THỐNG STATE QUẢN LÝ BẢO MẬT MẬT KHẨU
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState(""); // 🆕 Thêm: Nhập lại mật khẩu mới
  
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // 🛡️ HÀM KIỂM TRA ĐỘ MẠNH/YẾU CỦA MẬT KHẨU THỜI GIAN THỰC
  const checkPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Chưa nhập", color: "bg-border", textColor: "text-muted-foreground", width: "w-0" };
    
    let score = 0;
    if (pass.length >= 6) score++; // Điều kiện tối thiểu
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++; // Có độ dài tốt, chữ hoa và số
    if (/[\W_]/.test(pass)) score++; // Có ký tự đặc biệt

    if (score <= 1) {
      return { score: 1, label: "Yếu ", color: "bg-red-500", textColor: "text-red-500", width: "w-1/3" };
    } else if (score === 2) {
      return { score: 2, label: "Trung bình ", color: "bg-amber-500", textColor: "text-amber-500", width: "w-2/3" };
    } else {
      return { score: 3, label: "Mạnh Thách thức Hacker", color: "bg-green-500", textColor: "text-green-500", width: "w-full" };
    }
  };

  const pwdStrength = checkPasswordStrength(newPasswordInput);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStatusMessage({ type: "error", text: "Dung lượng ảnh đại diện không được vượt quá 5MB!" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm xử lý cập nhật dữ liệu và kiểm duyệt form
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    // ── BIỆN PHÁP KIỂM TRA ĐA TẦNG KHI ĐỔI MẬT KHẨU ──
    if (oldPasswordInput || newPasswordInput || confirmPasswordInput) {
      // Tầng 1: Đảm bảo điền đủ tất cả các ô liên quan
      if (!oldPasswordInput || !newPasswordInput || !confirmPasswordInput) {
        setStatusMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin Mật khẩu hiện tại, Mật khẩu mới và Nhập lại mật khẩu!" });
        return;
      }

      // Tầng 2: Xác minh mật khẩu hiện tại
      if (oldPasswordInput !== userInfo.currentPassword) {
        setStatusMessage({ type: "error", text: "Mật khẩu hiện tại không chính xác!" });
        return;
      }
      
      // Tầng 3: Đối chiếu không cho phép mật khẩu mới trùng mật khẩu cũ
      if (newPasswordInput === userInfo.currentPassword) {
        setStatusMessage({ type: "error", text: "Mật khẩu mới không được phép trùng với mật khẩu hiện tại đang sử dụng!" });
        return;
      }

      // Tầng 4: Kiểm tra trùng khớp giữa 2 lần nhập mật khẩu mới
      if (newPasswordInput !== confirmPasswordInput) {
        setStatusMessage({ type: "error", text: "Hai mật khẩu mới nhập vào không trùng khớp với nhau!" });
        return;
      }

      // Tầng 5: Chặn không cho lưu nếu mật khẩu thuộc diện Quá yếu
      if (pwdStrength.score === 1) {
        setStatusMessage({ type: "error", text: "Hệ thống từ chối lưu mật khẩu Yếu! Vui lòng thêm số, chữ hoa hoặc ký tự đặc biệt." });
        return;
      }
    }

    // Tiến hành lưu thông tin hợp lệ
    setUserInfo(prev => ({
      ...prev,
      fullName: editName,
      avatarUrl: editAvatarUrl,
      currentPassword: newPasswordInput ? newPasswordInput : prev.currentPassword
    }));

    // Reset sạch form nhập mật khẩu
    setOldPasswordInput("");
    setNewPasswordInput("");
    setConfirmPasswordInput("");
    setStatusMessage({ type: "success", text: "Cập nhật hồ sơ thông tin tài khoản thành công!" });
    
    setTimeout(() => setIsSettingsOpen(false), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card gradient-hero p-6 lg:p-8 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
          <div className="size-24 rounded-3xl bg-ink text-cream grid place-items-center text-3xl font-display font-bold shadow-inner overflow-hidden shrink-0 border border-white/10">
            {userInfo.avatarUrl ? (
              <img src={userInfo.avatarUrl} alt={userInfo.fullName} className="w-full h-full object-cover" />
            ) : (
              userInfo.avatarInitials
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{userInfo.fullName}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold tracking-wider">
                PRO
              </span>
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-4 font-medium">
              <span className="inline-flex items-center gap-1">
                <Mail size={13} className="text-primary/70" /> {userInfo.email}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} className="text-coral/70" /> {userInfo.location}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral/10 text-coral text-xs font-semibold border border-coral/10">
                <Flame size={12} fill="currentColor" /> Chuỗi 7 ngày
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 text-warning-foreground text-xs font-semibold border border-warning/10">
                <Award size={12} /> 11,320 reputation
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto shrink-0">
            <button 
              onClick={() => {
                setEditName(userInfo.fullName);
                setEditAvatarUrl(userInfo.avatarUrl);
                setIsSettingsOpen(true);
              }}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-xl bg-card border border-border text-sm font-semibold hover:bg-muted active:scale-[0.98] transition-all cursor-pointer"
            >
              <Settings size={14} /> Cài đặt
            </button>
            <button
              onClick={onLogout}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <LogOut size={14} /> Đăng xuất
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="surface-card p-5 hover:shadow-md transition-shadow"
            >
              <Icon size={18} className="text-primary mb-2" />
              <div className="text-2xl font-bold font-display tracking-tight">{s.value}</div>
              <div className="text-xs font-medium text-muted-foreground mt-0.5">{s.label}</div>
            </motion.div>
          );
        })}
      </section>

      {/* Badges */}
      <section className="surface-card p-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
          <Award className="text-coral" size={18} /> Huy hiệu của bạn
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {badges.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-muted/40 border border-border text-center transition-all duration-200"
            >
              <div
                className="size-14 rounded-2xl mx-auto grid place-items-center mb-2 shadow-sm"
                style={{
                  background: `oklch(0.55 0.14 ${b.color} / 0.15)`,
                  color: `oklch(0.45 0.14 ${b.color})`,
                }}
              >
                <Award size={24} />
              </div>
              <div className="font-semibold text-sm text-foreground">{b.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{b.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ⚙️ PANEL CÀI ĐẶT NÂNG CẤP BẢO MẬT ── */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.9 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 h-screen w-full max-w-md bg-card border-l border-border shadow-2xl p-6 z-50 overflow-y-auto font-sans"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Settings className="text-primary animate-spin-slow" size={20} />
                  <h3 className="text-lg font-bold text-foreground">Cấu hình tài khoản</h3>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="size-8 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <AnimatePresence>
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 font-medium ${
                      statusMessage.type === "success" 
                        ? "bg-green-500/10 text-green-600 border-green-500/20" 
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    }`}
                  >
                    {statusMessage.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    <span>{statusMessage.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSaveSettings} className="mt-5 space-y-6">
                
                {/* 1. THÔNG TIN ĐÀO TẠO FPT */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                    <CapIcon size={12} /> Thông tin đào tạo FPT
                  </div>
                  <div className="rounded-xl bg-muted/50 border border-border/60 p-4 space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-border/40 pb-2">
                      <span className="text-muted-foreground font-medium">Mã số sinh viên:</span>
                      <span className="font-mono font-bold text-foreground">{userInfo.studentId}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-border/40 pb-2">
                      <span className="text-muted-foreground font-medium">Chuyên ngành chính:</span>
                      <span className="font-semibold text-foreground">{userInfo.major}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground font-medium">Chuyên ngành hẹp:</span>
                      <span className="inline-flex items-center gap-1.5 font-bold text-coral bg-coral/5 border border-coral/10 px-2.5 py-1 rounded-lg w-fit mt-1 text-xs">
                        {userInfo.specialization}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. THAY ĐỔI THÔNG TIN CÁ NHÂN */}
                <div className="space-y-4 pt-2 border-t border-border/50">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                    <User size={12} /> Thay đổi thông tin cá nhân
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Ảnh đại diện tài khoản:</label>
                    <div className="flex gap-4 items-center">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="size-20 rounded-2xl bg-ink text-cream text-2xl font-bold grid place-items-center cursor-pointer overflow-hidden relative border border-border/40 shadow-inner group shrink-0"
                      >
                        {editAvatarUrl ? (
                          <img src={editAvatarUrl} alt="Preview" className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" />
                        ) : (
                          userInfo.avatarInitials
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white gap-1 transition-all duration-200">
                          <Camera size={16} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Thay ảnh</span>
                        </div>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      <div className="text-xs text-muted-foreground leading-relaxed font-medium">
                        Bấm vào ô vuông để upload ảnh mới từ thiết bị.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Họ và tên hiển thị:</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 h-10 rounded-xl bg-muted/60 border border-transparent focus:border-primary focus:bg-card outline-none text-sm transition-all font-medium text-foreground"
                      required
                    />
                  </div>
                </div>

                {/* 3. 🆕 HỆ THỐNG ĐỔI MẬT KHẨU AN TOÀN CAO CẤP */}
                <div className="space-y-4 pt-2 border-t border-border/50">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                    <Key size={12} /> Cập nhật mật khẩu bảo mật
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Mật khẩu hiện tại:</label>
                    <input
                      type="password"
                      value={oldPasswordInput}
                      onChange={(e) => setOldPasswordInput(e.target.value)}
                      className="w-full px-3.5 h-10 rounded-xl bg-muted/60 border border-transparent focus:border-primary focus:bg-card outline-none text-sm transition-all font-mono"
                      placeholder="••••••••"
                    />
                  </div>

                  {/* Mật khẩu mới + Thanh đo độ mạnh yếu */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-muted-foreground">Mật khẩu mới:</label>
                      {newPasswordInput && (
                        <span className={`text-[11px] font-bold ${pwdStrength.textColor}`}>
                          Độ mạnh: {pwdStrength.label}
                        </span>
                      )}
                    </div>
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full px-3.5 h-10 rounded-xl bg-muted/60 border border-transparent focus:border-primary focus:bg-card outline-none text-sm transition-all font-mono"
                      placeholder="••••••••"
                    />
                    
                    {/* Thanh thước đo tiến trình màu sắc */}
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1 transition-all">
                      <div className={`h-full ${pwdStrength.color} ${pwdStrength.width} transition-all duration-300`} />
                    </div>
                  </div>

                  {/* Ô xác nhận nhập lại mật khẩu mới */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Nhập lại mật khẩu mới:</label>
                    <input
                      type="password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="w-full px-3.5 h-10 rounded-xl bg-muted/60 border border-transparent focus:border-primary focus:bg-card outline-none text-sm transition-all font-mono"
                      placeholder="••••••••"
                    />
                    {confirmPasswordInput && newPasswordInput !== confirmPasswordInput && (
                      <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5 animate-pulse">
                         Mật khẩu nhập lại không trùng khớp!
                      </p>
                    )}
                    {confirmPasswordInput && newPasswordInput === confirmPasswordInput && (
                      <p className="text-[11px] text-green-500 font-medium flex items-center gap-1 mt-0.5">
                         Mật khẩu nhập lại khớp hoàn toàn.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border/50 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setOldPasswordInput("");
                      setNewPasswordInput("");
                      setConfirmPasswordInput("");
                    }}
                    className="flex-1 h-10 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 active:scale-95 transition-all cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    Lưu thay đổi
                  </button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}