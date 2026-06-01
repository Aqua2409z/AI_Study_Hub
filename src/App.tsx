import { useState, useEffect } from "react";
import OrbisLanding from "./components/LoginPage/OrbisLanding";
import LoginPanel from "./components/LoginPage/LoginPanel";
import Loader from "./components/LoginPage/Loader/Loader";
import Dashboard from "./components/Dashboard/Dashboard";

export default function App() {
  // KHỞI TẠO TỪ LOCALSTORAGE: Đọc trạng thái cũ ngay khi vừa ấn F5
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedState = localStorage.getItem("isLoggedIn");
    return savedState === "true"; // Sửa lỗi logic: So sánh với "true" để giữ trạng thái
  });

  // Trạng thái hiệu ứng chuyển cảnh khi click Đăng nhập
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Đồng bộ trạng thái đăng nhập vào bộ nhớ trình duyệt
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("isLoggedIn");
    }
  }, [isLoggedIn]);

  // Hàm này được gọi khi LoginPanel xác thực thành công
  const handleLoginSuccess = () => {
    setIsLoading(true); // Bật màn hình đen Loader loading lên

    setTimeout(() => {
      setIsLoggedIn(true); // Ghi nhận đăng nhập thành công
      setIsLoading(false); // Tắt hiệu ứng tải
    }, 2500); // Khớp với thời gian chạy animation của Loader
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Đăng xuất tự động xóa sạch localStorage qua useEffect
  };

  // ƯU TIÊN 1: Nếu đang chạy hiệu ứng chuyển cảnh
  if (isLoading) {
    return <Loader />;
  }

  // ƯU TIÊN 2: Nếu bấm F5 mà đã đăng nhập từ trước -> Giữ nguyên Dashboard
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // ƯU TIÊN 3: Nếu bấm F5 khi chưa đăng nhập -> Giữ nguyên cụm Login ban đầu
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-space">
      {/* BÊN TRÁI - Giao diện nền Orbis */}
      <div className="w-[65%] min-w-[65%] max-w-[65%] h-full overflow-y-auto hide-scrollbar relative flex-shrink-0">
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
        <OrbisLanding />
      </div>

      {/* BÊN PHẢI - Khung Form Đăng nhập của bạn */}
      <div className="w-[35%] min-w-[35%] max-w-[35%] h-full border-l border-white/10 overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#010828] via-[#0a1440] to-[#1a0f3f] relative flex-shrink-0">
        <div className="relative z-10 w-full max-w-sm sm:max-w-md px-6 py-8">
          <LoginPanel onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>  
  );
}