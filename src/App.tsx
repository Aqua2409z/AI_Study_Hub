"use client";

import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import OrbisLanding from "./components/LoginPage/OrbisLanding";
import LoginPanel from "./components/LoginPage/LoginPanel";
import Loader from "./components/LoginPage/Loader/Loader";
import { AppShell } from "./components/DashBoard/AppShell";

// Pages
import DashboardPage from "./pages/DashboardPage";
import NotebooksPage from "./pages/NotebooksPage";
import NotebookDetailPage from "./pages/NotebookDetailPage";
import DocumentsPage from "./pages/DocumentsPage";
import ChatPage from "./pages/ChatPage";
import QuizPage from "./pages/QuizPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import CommunityPage from "./pages/CommunityPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import SharedDocumentPage from "./pages/SharedDocumentPage";

export default function App() {
  const { isLoggedIn, login, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle fake login loading
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  useEffect(() => {
    // Simulate init from local storage (Zustand persist handles it, we just need a small delay to prevent flash)
    setTimeout(() => setIsInitializing(false), 100);
  }, []);

  const handleLoginSuccess = (emailFromForm?: string) => {
    setIsLoginLoading(true);
    const finalEmail = emailFromForm || "anhkhoa@fpt.edu.vn";
    setTimeout(() => {
      login(finalEmail);
      setIsLoginLoading(false);
      navigate("/dashboard", { replace: true });
    }, 2500);
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (isInitializing || isLoginLoading) return <Loader />;

  const landingElement = isLoggedIn ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <div className="flex w-screen h-screen overflow-hidden bg-space relative">
      <div className="w-full h-full overflow-y-auto hide-scrollbar relative">
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
        <OrbisLanding onLoginClick={() => navigate("/login")} />
      </div>
    </div>
  );

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={landingElement} />
      <Route path="/privacy-policy" element={landingElement} />
      <Route path="/cookie-settings" element={landingElement} />

      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="flex w-screen h-screen overflow-hidden bg-space relative">
              <div className="w-full h-full flex items-center justify-center relative animate-fade-in">
                <LoginPanel
                  onLoginSuccess={(_, user) => handleLoginSuccess(user.email)}
                  onClose={() => navigate("/")}
                />
              </div>
            </div>
          )
        }
      />

      <Route path="/share/documents/:token" element={<SharedDocumentPage shareToken="token-from-url" />} />

      {/* Authenticated Routes wrapped in AppShell */}
      {isLoggedIn && (
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notebooks" element={<NotebooksPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
          <Route path="/admin/:tab" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      )}

      {/* Catch-all for non-authenticated */}
      {!isLoggedIn && <Route path="*" element={<Navigate to="/" replace />} />}
    </Routes>
  );
}