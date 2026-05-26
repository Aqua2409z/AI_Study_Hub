import { useState, useEffect, useRef } from "react";

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
}

export default function Header({ userName = "Nguyễn Văn A", onLogout }: HeaderProps) {
  // State quản lý ẩn/hiện menu dropdown đăng xuất
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tự động đóng dropdown nếu người dùng click ra ngoài khu vực profile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-16 bg-space/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 relative z-50">
      {/* Left - Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu, môn học, ghi chú..."
            className="w-full bg-white/10 rounded-lg px-4 py-2 text-cream placeholder:text-cream/40 outline-none focus:bg-white/20 transition text-sm font-mono"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cream/60">
            🔍
          </span>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Shortcut hint */}
        <span className="text-cream/50 text-xs font-mono hidden lg:inline">Ctrl + K</span>

        {/* Notification Bell */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition">
          <span className="text-lg">🔔</span>
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            1
          </span>
        </button>

        {/* Help/Info */}
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition">
          <span className="text-lg">❓</span>
        </button>

        {/* User Profile Khu vực chứa Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ml-2 ${isDropdownOpen ? 'bg-white/10' : 'hover:bg-white/10'}`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {userName.charAt(0)}
            </div>
            <div className="flex flex-col items-start">
              <p className="text-cream text-sm font-mono">{userName}</p>
              <p className="text-cream/50 text-xs">Sinh viên</p>
            </div>
            <span className={`text-cream/60 ml-2 text-[10px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {/* Khung Dropdown Menu đổ xuống */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#091133] border border-white/10 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-white/5 lg:hidden">
                <p className="text-cream text-sm font-mono truncate">{userName}</p>
                <p className="text-cream/40 text-xs">Sinh viên</p>
              </div>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (onLogout) onLogout(); // Gọi hàm logout từ App.tsx truyền xuống để xóa localStorage và chuyển trang
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition flex items-center gap-2 font-mono group"
              >
                <span className="group-hover:translate-x-0.5 transition-transform">🚪</span> 
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}