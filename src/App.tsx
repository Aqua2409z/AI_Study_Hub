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

  // Sync state with URL (Routing)
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      if (path === "/login") {
        setShowLoginPanel(true);
      } else if (path === "/" || path === "") {
        setShowLoginPanel(false);
      } else {
        const idx = TAB_PATHS.indexOf(path);
        if (idx !== -1) {
          setActiveTab(idx);
        }
      }
    };

    handleLocation();
    window.addEventListener("popstate", handleLocation);
    return () => window.removeEventListener("popstate", handleLocation);
  }, []);

  const handleTabChange = (id: number) => {
    setActiveTab(id);
    const path = TAB_PATHS[id] || "/dashboard";
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
  };

  const navigateToLogin = () => {
    setShowLoginPanel(true);
    window.history.pushState({}, "", "/login");
  };

  const navigateToLanding = () => {
    setShowLoginPanel(false);
    window.history.pushState({}, "", "/");
  };

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

  // ── Main App (đã đăng nhập) ──
  if (isLoggedIn) {
    return (
      <AppShell activeTab={activeTab} setActiveTab={handleTabChange}>
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