import { useState, useEffect } from "react";
import { Mail, Lock, User, Sparkles, ArrowRight, ArrowLeft, Check, X, Eye, EyeOff } from "lucide-react";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../LoginPage/LoginPanel.css';

interface LoginPanelProps {
  onLoginSuccess: () => void;
}

export default function LoginPanel({ onLoginSuccess }: LoginPanelProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // <-- Thêm state nhập lại mật khẩu
  const [resetMessage, setResetMessage] = useState("");

  // --- HÀM KIỂM TRA ĐỘ MẠNH MẬT KHẨU ---
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "", color: "bg-transparent", textClass: "" };

    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score, label: "Quá yếu ❌", color: "bg-red-500", textClass: "text-red-400" };
    if (score === 2) return { score, label: "Trung bình ⚠️", color: "bg-yellow-500", textClass: "text-yellow-400" };
    if (score === 3) return { score, label: "Mạnh   ✨", color: "bg-blue-500", textClass: "text-blue-400" };
    return { score, label: "Cực kỳ an toàn 💪", color: "bg-emerald-500", textClass: "text-emerald-400" };
  };

  const strength = getPasswordStrength(password);

  useEffect(() => {
    Notify.init({
      width: '300px',
      position: 'right-top',
      distance: '15px',
      opacity: 1,
      borderRadius: '20px',
      timeout: 3000,
      cssAnimationStyle: 'fade',
      fontFamily: 'monospace',
      maxVisibleNotifications: 3,
      success: { background: '#10B981', textColor: '#fff' },
      failure: { background: '#EF4444', textColor: '#fff' }
    } as any);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith("@gmail.com")) {
      Notify.failure("Email phải có định dạng @gmail.com");
      return;
    }

    if (mode === "signup") {
      // Chặn nếu mật khẩu quá yếu (Score dưới 2)
      if (strength.score < 2) {
        Notify.failure("Mật khẩu của bạn quá yếu! Vui lòng làm theo gợi ý.");
        return;
      }
      // Kiểm tra mật khẩu nhập lại trùng khớp
      if (password !== confirmPassword) {
        Notify.failure("Mật khẩu nhập lại không trùng khớp!");
        return;
      }
    }

    if (mode === "login" && password.length < 6) {
      Notify.failure("Mật khẩu phải từ 6 ký tự trở lên");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      Notify.success(mode === "login" ? "Đăng nhập thành công!" : "Đăng ký tài khoản thành công!");
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    }, 1200);
  };

  const handleOAuthLogin = (provider: "google" | "github") => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Notify.success(`Kết nối ${provider} thành công!`);
      onLoginSuccess();
    }, 1200);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith("@gmail.com")) {
      Notify.failure("Email không hợp lệ!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResetMessage(`Password reset link sent to ${email}.`);
      Notify.success("Đã gửi link đặt lại mật khẩu!");
      setTimeout(() => {
        setMode("login");
        setResetMessage("");
        setEmail("");
      }, 4000);
    }, 1500);
  };

  if (mode === "forgot") {
    return (
      <div className="w-full">
        <div className="liquid-glass rounded-[28px] p-8 sm:p-10">
          <button
            type="button"
            onClick={() => { setMode("login"); setEmail(""); setResetMessage(""); }}
            className="flex items-center gap-2 text-cream/60 hover:text-neon mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Login
          </button>

          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-neon" />
            <span className="font-grotesk text-[13px] uppercase tracking-[0.2em]">AI Study Hub</span>
          </div>

          <h1 className="font-grotesk uppercase text-4xl leading-none mb-1">Reset Password</h1>
          <p className="font-condiment text-neon text-2xl mb-8">Get back in</p>

          {resetMessage ? (
            <div className="bg-green-500/20 border border-green-400/30 p-4 rounded-2xl mb-6">
              <p className="text-sm text-green-300">{resetMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-2">
              <div className="liquid-glass rounded-[16px] flex items-center px-4 py-3 gap-3">
                <Mail size={18} className="text-cream/60" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-transparent outline-none w-full font-mono text-[14px] text-cream placeholder:text-cream/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-4 rounded-2xl bg-neon text-space font-grotesk uppercase tracking-wider hover:brightness-110 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="liquid-glass rounded-[28px] p-8 sm:p-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-neon" />
          <span className="font-grotesk text-[13px] uppercase tracking-[0.2em] text-cream/80">AI Study Hub</span>
        </div>

        <h1 className="font-grotesk uppercase text-[36px] sm:text-[44px] leading-[1] mb-1">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>

        <p className="font-condiment text-neon text-[28px] -rotate-1 mb-6 mix-blend-exclusion">
          {mode === "login" ? "study smarter" : "join the orbit"}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <Field Icon={User} type="text" placeholder="Full name" value={fullName} onChange={setFullName} />
          )}
          <Field Icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} />

          <Field Icon={Lock} type="password" placeholder="Password" value={password} onChange={setPassword} />

          {/* --- UI THANH ĐO ĐỘ MẠNH YẾU MẬT KHẨU KHI SIGNUP --- */}
          {/* --- UI THANH ĐO ĐỘ MẠNH YẾU MẬT KHẨU KHI SIGNUP --- */}
          {mode === "signup" && password && (
            <div className="space-y-1.5 px-1 animate-fadeIn"> {/* Giảm từ space-y-2 */}
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-cream/60">Độ bảo mật:</span>
                <span className={`font-bold ${strength.textClass}`}>{strength.label}</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-cream/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`}></div>
                <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`}></div>
                <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`}></div>
                <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 4 ? strength.color : 'bg-transparent'}`}></div>
              </div>

              {/* Giảm khoảng cách giữa các dòng check xuống cực nhỏ (space-y-0) */}
              <div className="pt-0.5 text-[11px] font-mono text-cream/40 space-y-0.5">
                <div className="flex items-center gap-1">
                  {password.length >= 6 ? <Check size={12} className="text-emerald-400" /> : <X size={12} className="text-red-400" />}
                  <span>Tối thiểu 6 ký tự</span>
                </div>
                <div className="flex items-center gap-1">
                  {(/[a-z]/.test(password) && /[A-Z]/.test(password)) ? <Check size={12} className="text-emerald-400" /> : <X size={12} className="text-red-400" />}
                  <span>Chứa chữ HOA và chữ thường</span>
                </div>
                <div className="flex items-center gap-1">
                  {/\d/.test(password) ? <Check size={12} className="text-emerald-400" /> : <X size={12} className="text-red-400" />}
                  <span>Chứa ít nhất 1 chữ số</span>
                </div>
              </div>
            </div>
          )}

          {/* --- Ô NHẬP LẠI MẬT KHẨU KHI SIGNUP --- */}
          {mode === "signup" && (
            <div className="animate-fadeIn">
              <Field
                Icon={Lock}
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
              {confirmPassword && (
                <div className="pt-1.5 px-1 text-[11px] font-mono flex items-center gap-1">
                  {password === confirmPassword ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400/80">Mật khẩu trùng khớp</span>
                    </>
                  ) : (
                    <>
                      <X size={12} className="text-red-400" />
                      <span className="text-red-400/80">Mật khẩu chưa khớp</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group w-full mt-2 rounded-[18px] bg-neon text-space font-grotesk uppercase text-[15px] tracking-wider py-4 flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_40px_rgba(111,255,0,0.35)] disabled:opacity-80"
          >
            {loading ? "Loading..." : mode === "login" ? "Enter the hub" : "Launch account"}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {mode === "login" && (
          <p className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-cream/60 hover:text-neon transition text-sm"
            >
              Forgot password?
            </button>
          </p>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="h-[1px] bg-cream/10 flex-1"></div>
          <span className="text-[11px] font-mono uppercase text-cream/40 tracking-wider">
            Or continue with
          </span>
          <div className="h-[1px] bg-cream/10 flex-1"></div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleOAuthLogin("google")}
            className="liquid-glass flex items-center justify-center gap-2 py-3 rounded-[16px] hover:bg-cream/5 text-cream/80 hover:text-cream transition disabled:opacity-50 text-sm font-mono uppercase"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Google
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleOAuthLogin("github")}
            className="liquid-glass flex items-center justify-center gap-2 py-3 rounded-[16px] hover:bg-cream/5 text-cream/80 hover:text-cream transition disabled:opacity-50 text-sm font-mono uppercase"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-[12px] font-mono uppercase text-cream/70">
          {mode === "login" ? "New explorer? " : "Already orbiting? "}
          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setFullName(""); setEmail(""); setPassword(""); setConfirmPassword(""); }}
            className="text-neon hover:underline"
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

interface FieldProps {
  Icon: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}

// --- THAY ĐỔI COMPONENT FIELD HỖ TRỢ NÚT ẨN/HIỆN MẮT ---
function Field({ Icon, type, placeholder, value, onChange }: FieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="liquid-glass rounded-[16px] flex items-center px-4 py-3 gap-3 relative">
      <Icon size={18} className="text-cream/60" />
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="bg-transparent outline-none w-full font-mono text-[14px] placeholder:text-cream/40 text-cream pr-10"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 text-cream/40 hover:text-neon transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}