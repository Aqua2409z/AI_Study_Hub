import { useState, useEffect } from "react";
import OrbisLanding from "./components/LoginPage/OrbisLanding";
import LoginPanel from "./components/LoginPage/LoginPanel";
import Dashboard from "./components/Dashboard/Dashboard"; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("isLoggedIn");
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    console.log("✅ Login thành công - Chuyển sang Dashboard");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log("🚪 Đã logout");
    setIsLoggedIn(false);
  };

  // KIỂM TRA ĐIỀU KIỆN: Nếu đã đăng nhập thành công, hiển thị giao diện Dashboard luôn
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // Nếu chưa đăng nhập, hiển thị cụm form Login 65/35 ban đầu
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-space">
      {/* BÊN TRÁI - OrbisLanding */}
      <div className="w-[65%] min-w-[65%] max-w-[65%] h-full overflow-y-auto hide-scrollbar relative flex-shrink-0">
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
        <OrbisLanding />
      </div>

      {/* BÊN PHẢI - LoginPanel */}
      <div className="w-[35%] min-w-[35%] max-w-[35%] h-full border-l border-white/10 overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#010828] via-[#0a1440] to-[#1a0f3f] relative flex-shrink-0">
        <div className="relative z-10 w-full max-w-sm sm:max-w-md px-6 py-8">
          <LoginPanel onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  );
}