import { useState } from "react";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  activeMenu?: string;
  onMenuClick?: (menuId: string) => void;
}

export default function Sidebar({ activeMenu = "dashboard", onMenuClick }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const mainMenuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "my-files", label: "Tài liệu của tôi", icon: "📁" },
    { id: "courses", label: "Môn học", icon: "📚" },
    { id: "ai-chat", label: "AI Hỏi đáp", icon: "🤖" },
    { id: "note", label: "Ghi chú", icon: "📝" },
    { id: "schedule", label: "Lịch học", icon: "📅" },
    { id: "quiz", label: "Bài tập & Quiz", icon: "✏️" },
    { id: "favorite", label: "Yêu thích", icon: "❤️" },
    { id: "trash", label: "Thùng rác", icon: "🗑️" },
  ];

  const subMenuItems: MenuItem[] = [
    { id: "shared", label: "Thư mục", icon: "+" },
    { id: "categories", label: "Toàn cao cấp", icon: ">" },
    { id: "search-files", label: "Cấu trúc dữ liệu", icon: ">" },
    { id: "create-note", label: "Trí tuệ nhân tạo", icon: ">" },
    { id: "english", label: "Tiếng Anh", icon: ">" },
    { id: "more", label: "Xem thêm", icon: ">" },
  ];

  const handleMenuClick = (menuId: string) => {
    if (onMenuClick) {
      onMenuClick(menuId);
    }
  };

  return (
    <div className="w-56 bg-space/80 backdrop-blur-md border-r border-white/10 flex flex-col h-screen overflow-y-auto sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
            📚
          </div>
          <div>
            <p className="text-cream font-grotesk font-bold text-sm">AI Study Hub</p>
            <p className="text-cream/50 text-xs">Học thông minh, hiểu sâu</p>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {mainMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-mono ${
              activeMenu === item.id
                ? "bg-blue-500/30 text-neon border border-neon/30"
                : "text-cream/70 hover:text-cream hover:bg-white/5"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Sub Menu */}
      <div className="border-t border-white/10 p-4">
        <p className="text-cream/50 text-xs font-mono uppercase mb-3">Thư mục</p>
        <div className="space-y-1">
          {subMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-cream/60 hover:text-cream hover:bg-white/5 transition text-sm"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-mono">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Storage Info */}
      <div className="border-t border-white/10 p-4">
        <p className="text-cream/60 text-xs font-mono mb-2">Dung lượng đã dùng</p>
        <p className="text-cream text-sm font-grotesk mb-2">12.45 GB / 20 GB</p>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-[62%] bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" />
        </div>
        <button className="w-full mt-4 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition text-xs font-mono font-bold">
          Nâng cấp gói
        </button>
      </div>
    </div>
  );
}