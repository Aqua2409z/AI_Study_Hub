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

// Tab ID map (khớp với nav[] trong AppShell.tsx)
// 0  Dashboard
// 1  Notebooks
// 2  Tài liệu
// 3  Hỏi AI
// 4  Quiz
// 5  Flashcards
// 6  Cộng đồng
// 7  Thông báo
// 8  Hồ sơ
// 9  Admin

export default function App() {
  const [isLoggedIn,     setIsLoggedIn]     = useState<boolean>(false);
  const [isLoading,      setIsLoading]      = useState<boolean>(true);
  const [showLoginPanel, setShowLoginPanel] = useState<boolean>(false);
  const [userEmail,      setUserEmail]      = useState<string>("");
  const [activeTab,      setActiveTab]      = useState<number>(0);

  // 1. Kiểm tra trạng thái đăng nhập cũ khi F5 ứng dụng
  useEffect(() => {
    const savedState = localStorage.getItem("isLoggedIn");
    const savedEmail = localStorage.getItem("userEmail");

    if (savedState === "true") {
      setIsLoggedIn(true);
      if (savedEmail) setUserEmail(savedEmail);

      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
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
    }, 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
    setActiveTab(0);
  };

  // Render đúng page theo activeTab
  const renderPage = () => {
    switch (activeTab) {
      case 0:  return <DashboardPage onNavigate={setActiveTab} />;
      case 1:  return <NotebooksPage onNavigate={setActiveTab} />;
      case 2:  return <DocumentsPage />;
      case 3:  return <ChatPage />;
      case 4:  return <QuizPage />;
      case 5:  return <FlashcardsPage />;
      case 6:  return <CommunityPage />;
      case 7:  return <NotificationsPage />;
      case 8:  return <ProfilePage onLogout={handleLogout} />;
      case 9:  return <AdminPage />;
      default: return <DashboardPage onNavigate={setActiveTab} />;
    }
  };

  // ── Loader screen ──
  if (isLoading) return <Loader />;

  // ── Main App (đã đăng nhập) ──
  if (isLoggedIn) {
    return (
      <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderPage()}
      </AppShell>
    );
  }

  // ── Landing / Login screen ──
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
            className="absolute top-6 left-6 text-xs uppercase tracking-widest text-neon border border-neon/30 px-4 py-2 hover:bg-neon hover:text-space transition-all duration-300 rounded-lg"
          >
            ← Back to journey
          </button>
          <LoginPanel onLoginSuccess={(token, user) => handleLoginSuccess(user.email)} />
        </div>
      )}
    </div>
  );
}