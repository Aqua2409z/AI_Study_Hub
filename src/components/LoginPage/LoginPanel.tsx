import { useState } from "react";
import { Mail, Lock, User, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
interface LoginPanelProps {
  onLoginSuccess: () => void;
}

export default function LoginPanel({ onLoginSuccess }: LoginPanelProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("ENTER HUB CLICKED");

    setLoading(true);

    setTimeout(() => {
      console.log("CALL onLoginSuccess");

      setLoading(false);

      onLoginSuccess();
    }, 1200);
  };
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResetMessage(`Password reset link sent to ${email}.`);
      setTimeout(() => {
        setMode("login");
        setResetMessage("");
        setEmail("");
      }, 4000);
    }, 1500);
  };

  // Forgot Password Mode
  if (mode === "forgot") {
    return (
      <div className="w-full">
        <div className="liquid-glass rounded-[28px] p-8 sm:p-10">
          <button onClick={() => { setMode("login"); setEmail(""); setResetMessage(""); }} className="flex items-center gap-2 text-cream/60 hover:text-neon mb-6">
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
              <p className="text-sm">{resetMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="liquid-glass rounded-[16px] flex items-center px-4 py-3 gap-3">
                <Mail size={18} className="text-cream/60" />
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-transparent outline-none w-full" />
              </div>

              <button type="submit" disabled={loading || !email} className="w-full py-4 rounded-2xl bg-neon text-space font-grotesk uppercase tracking-wider hover:brightness-110 transition disabled:opacity-50">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Login / Signup Mode
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
          {mode === "signup" && <Field Icon={User} type="text" placeholder="Full name" value={fullName} onChange={setFullName} />}
          <Field Icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} />
          <Field Icon={Lock} type="password" placeholder="Password" value={password} onChange={setPassword} />

          <button type="submit" disabled={loading} className="group w-full mt-2 rounded-[18px] bg-neon text-space font-grotesk uppercase text-[15px] tracking-wider py-4 flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_40px_rgba(111,255,0,0.35)] disabled:opacity-80">
            {loading ? "Loading..." : mode === "login" ? "Enter the hub" : "Launch account"}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {mode === "login" && (
          <p className="mt-4 text-center">
            <button onClick={() => setMode("forgot")} className="text-cream/60 hover:text-neon transition text-sm">
              Forgot password?
            </button>
          </p>
        )}

        <p className="mt-6 text-center text-[12px] font-mono uppercase text-cream/70">
          {mode === "login" ? "New explorer? " : "Already orbiting? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setFullName(""); setEmail(""); setPassword(""); }} className="text-neon hover:underline">
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

function Field({ Icon, type, placeholder, value, onChange }: FieldProps) {
  return (
    <div className="liquid-glass rounded-[16px] flex items-center px-4 py-3 gap-3">
      <Icon size={18} className="text-cream/60" />
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required className="bg-transparent outline-none w-full font-mono text-[14px] placeholder:text-cream/40 text-cream" />
    </div>
  );
}