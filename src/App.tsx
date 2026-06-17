"use client";

import { useState, useEffect } from "react";
import OrbisLanding from "./components/LoginPage/OrbisLanding";
import LoginPanel from "./components/LoginPage/LoginPanel";
import Loader from "./components/LoginPage/Loader/Loader";
import { AppShell } from "./components/DashBoard/AppShell";

// Pages
import DashboardPage    from "./pages/DashboardPage";
import NotebooksPage    from "./pages/NotebooksPage";
import DocumentsPage    from "./pages/DocumentsPage";
import ChatPage         from "./pages/ChatPage";
import QuizPage         from "./pages/QuizPage";
import FlashcardsPage   from "./pages/FlashcardsPage";
import CommunityPage    from "./pages/CommunityPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage      from "./pages/ProfilePage";
import AdminPage        from "./pages/AdminPage";
import NotFoundPage     from "./pages/NotFoundPage";
import SharedDocumentPage from "./pages/SharedDocumentPage";

// 🌟 DÒNG THÊM MỚI: Import trang Privacy Policy (Hãy chỉnh lại đường dẫn file nếu bạn lưu chỗ khác nhé)
import PrivacyPolicy    from "./components/LoginPage/Loader/PrivacyPolicy"; 

const TAB_PATHS = [
  "/dashboard",
  "/notebooks",
  "/documents",
  "/chat",
  "/quiz",
  "/flashcards",
  "/community",
  "/notifications",
  "/profile",
  "/admin"
];

export default function App() {
  const [isLoggedIn,     setIsLoggedIn]     = useState<boolean>(false);
  const [isLoading,      setIsLoading]      = useState<boolean>(true);
  const [showLoginPanel, setShowLoginPanel] = useState<boolean>(false);
  const [userEmail,      setUserEmail]      = useState<string>("");
  const [activeTab,      setActiveTab]      = useState<number>(0);
  const [is404,          setIs404]          = useState<boolean>(false);
  const [shareToken,     setShareToken]     = useState<string | null>(null);

  // Sync state with URL (Routing)
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      
      // Check for share link route first
      if (path.startsWith("/share/documents/")) {
        const token = path.split("/share/documents/")[1];
        if (token) {
          setShareToken(token);
          setShowLoginPanel(false);
          setIs404(false);
          setIsLoading(false); // Stop loading immediately for public page
          return;
        }
      } else {
        setShareToken(null);
      }

      if (path === "/login") {
        setShowLoginPanel(true);
        setIs404(false);
      } 
      // 🌟 ĐÃ SỬA: Thêm "path === '/privacy-policy'" vào đây để cấu trúc router chấp nhận đường dẫn này hợp lệ
      else if (path === "/" || path === "" || path === "/privacy-policy") {
        setShowLoginPanel(false);
        setIs404(false);
      } else {
        const idx = TAB_PATHS.indexOf(path);
        if (idx !== -1) {
          setActiveTab(idx);
          setIs404(false);
        } else {
          setIs404(true);
        }
      }
    };

    handleLocation();
    window.addEventListener("popstate", handleLocation);
    return () => window.removeEventListener("popstate", handleLocation);
  }, []);

  const handleTabChange = (id: number) => {
    setActiveTab(id);
    setIs404(false);
    const path = TAB_PATHS[id] || "/dashboard";
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
  };

  const navigateToLogin = () => {
    setShowLoginPanel(true);
    setIs404(false);
    window.history.pushState({}, "", "/login");
  };

  const navigateToLanding = () => {
    setShowLoginPanel(false);
    setIs404(false);
    window.history.pushState({}, "", "/");
  };

  // 1. Kiểm tra trạng thái đăng nhập cũ khi F5 ứng dụng
  useEffect(() => {
    const savedState = localStorage.getItem("isLoggedIn");
    const savedEmail = localStorage.getItem("userEmail");

    if (savedState === "true") {
      setIsLoggedIn(true);
      if (savedEmail) setUserEmail(savedEmail);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  // 2. Hàm xử lý sau khi login thành công
  const handleLoginSuccess = (emailFromForm?: string) => {
    setIsLoading(true);
    const finalEmail = emailFromForm || "anhkhoa@fpt.edu.vn";
    setUserEmail(finalEmail);
    localStorage.setItem("userEmail", finalEmail);

    setTimeout(() => {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      setIsLoading(false);
      setShowLoginPanel(false);
      window.history.pushState({}, "", "/dashboard");
    }, 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
    setActiveTab(0);
    window.history.pushState({}, "", "/");
  };

  // Render đúng page theo activeTab
  const renderPage = () => {
    switch (activeTab) {
      case 0:  return <DashboardPage onNavigate={handleTabChange} />;
      case 1:  return <NotebooksPage onNavigate={handleTabChange} />;
      case 2:  return <DocumentsPage />;
      case 3:  return <ChatPage />;
      case 4:  return <QuizPage />;
      case 5:  return <FlashcardsPage />;
      case 6:  return <CommunityPage />;
      case 7:  return <NotificationsPage />;
      case 8:  return <ProfilePage onLogout={handleLogout} />;
      case 9:  return <AdminPage />;
      default: return <DashboardPage onNavigate={handleTabChange} />;
    }
  };

  // ── Loader screen ──
  if (isLoading) return <Loader />;

  // ── 404 Not Found screen ──
  if (is404) {
    return (
      <NotFoundPage 
        onNavigateHome={() => {
          setIs404(false);
          window.history.pushState({}, "", "/");
          window.location.href = "/";
        }} 
      />
    );
  }

  // ── Public Shared Document screen ──
  if (shareToken) {
    return <SharedDocumentPage shareToken={shareToken} />;
  }

  // ── 🌟 THÊM MỚI: Trang Privacy Policy dành riêng cho trường hợp ĐÃ ĐĂNG NHẬP ──
  // (Nếu họ đang ở trong hệ thống mà gõ /privacy-policy thì hiện thẳng giao diện này ra)
  if (isLoggedIn && window.location.pathname === "/privacy-policy") {
    return (
      <PrivacyPolicy 
        onBackClick={() => {
          window.history.pushState({}, "", "/dashboard");
          window.dispatchEvent(new Event("popstate")); // Ép hệ thống định tuyến cập nhật lại tab dashboard
        }} 
      />
    );
  }

  // ── Main App (đã đăng nhập các trang thông thường) ──
  if (isLoggedIn) {
    return (
      <AppShell activeTab={activeTab} setActiveTab={handleTabChange}>
        {renderPage()}
      </AppShell>
    );
  }

  // ── Landing / Login screen (Gồm cả trạng thái /privacy-policy khi chưa đăng nhập) ──
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
          <OrbisLanding onLoginClick={navigateToLogin} />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center relative animate-fade-in">
          <LoginPanel onLoginSuccess={(token, user) => handleLoginSuccess(user.email)} onClose={navigateToLanding} />
        </div>
      )}
    </div>
  );
}