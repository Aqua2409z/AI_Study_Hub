"use client";

import { useState, useEffect } from "react";
import OrbisLanding from "./components/LoginPage/OrbisLanding";
import LoginPanel from "./components/LoginPage/LoginPanel";
import Loader from "./components/LoginPage/Loader/Loader";
import Dashboard from "./components/Dashboard/Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLoginPanel, setShowLoginPanel] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  // 1. Kiểm tra trạng thái đăng nhập cũ khi F5 ứng dụng
  useEffect(() => {
    const savedState = localStorage.getItem("isLoggedIn");
    const savedEmail = localStorage.getItem("userEmail");

    if (savedState === "true") {
      setIsLoggedIn(true);
      if (savedEmail) setUserEmail(savedEmail);

      // Nếu đã đăng nhập sẵn, cho chạy Loader nhẹ 2s rồi vào thẳng Dashboard
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // Nếu chưa đăng nhập, tắt loader ngay để hiển thị OrbisLanding
      setIsLoading(false);
    }
  }, []);

  // 2. Hàm kích hoạt NGAY KHI nhấn nút "Tiến vào Hub ngay" từ màn hình đăng ký thành công
  const handleLoginSuccess = (emailFromForm?: string) => {
    setIsLoading(true); // BẬT LOADER CỦA APP LÊN NGAY LẬP TỨC

    const finalEmail = emailFromForm || "anhkhoa@fpt.edu.vn";
    setUserEmail(finalEmail);
    localStorage.setItem("userEmail", finalEmail);

    // Loader chạy đúng 2.5 giây rồi tự động đá thẳng vào Dashboard xịn
    setTimeout(() => {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      setIsLoading(false);
      setShowLoginPanel(false);
    }, 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
  };

  // ƯU TIÊN 1: Đang trong quá trình chuyển cảnh hoặc check auth -> Chỉ hiển thị Loader bao sân toàn màn hình
  if (isLoading) {
    return <Loader />;
  }

  // ƯU TIÊN 2: Đã login thành công -> Tiến thẳng vào Dashboard
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // LUỒNG HIỂN THỊ BAN ĐẦU KHI CHƯA ĐĂNG NHẬP
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-space relative">
      {!showLoginPanel ? (
        <div
          id="orbis-scroll-wrapper"
          className="w-full h-full overflow-y-auto hide-scrollbar relative"
        >
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>
          <OrbisLanding onLoginClick={() => setShowLoginPanel(true)} />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center relative animate-fade-in">
          <button
            onClick={() => setShowLoginPanel(false)}
            className="absolute top-6 left-6 text-xs uppercase tracking-widest text-neon border border-neon/30 px-4 py-2 hover:bg-neon hover:text-space transition-all duration-300"
          >
            ← Back to journey
          </button>

          {/* Nhận callback từ LoginPanel bắn ra khi click "Tiến vào Hub ngay" */}
          <LoginPanel onLoginSuccess={(token, user) => handleLoginSuccess(user.email)} />
        </div>
      )}
    </div>
  );
}