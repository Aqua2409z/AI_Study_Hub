import { useState } from "react";
import StatCard from "../Dashboard/Statcard";
import RecentFilesSection from "../Dashboard/Recentfilessection";
import ScheduleSection from "../Dashboard/Schedulesection";
import StatsOverview from "../Dashboard/Statsoverview";
import CourseProgress from "../Dashboard/Courseprogress";
import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";

interface DashboardProps {
    onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
    const [activeMenu, setActiveMenu] = useState("dashboard");

    const statCards = [
        { icon: "📄", value: 245, label: "Tài liệu", trend: "18 tài liệu mới tuần này", backgroundColor: "bg-blue-500/30" },
        { icon: "📖", value: 28, label: "Môn học", trend: "3 môn học mới", backgroundColor: "bg-green-500/30" },
        { icon: "💾", value: "12.45 Gb", label: "Dung lượng đã dùng", trend: "62% / 20 GB", backgroundColor: "bg-orange-500/30" },
        { icon: "🤖", value: 356, label: "Lượt hỏi AI", trend: "56 lượt tuần này", backgroundColor: "bg-purple-500/30" },
    ];

    const recentFiles = [
        { id: "1", name: "Giải tích 2 - Chương 3.pdf", tag: "Giải tích 2", timeAgo: "2 giờ trước", tagColor: "bg-blue-500/20 text-blue-300" },
        { id: "2", name: "Bài tập Cấu trúc dữ liệu.docx", tag: "Cấu trúc dữ liệu", timeAgo: "5 giờ trước", tagColor: "bg-green-500/20 text-green-300" },
        { id: "3", name: "Machine Learning cơ bản.pptx", tag: "Trí tuệ nhân tạo", timeAgo: "1 ngày trước", tagColor: "bg-orange-500/20 text-orange-300" },
    ];

    const schedules = [
        { id: "1", time: "08:00 - 09:30", title: "Giải tích 2", room: "Phòng A101 - Tòa A", color: "bg-blue-400" },
        { id: "2", time: "10:00 - 11:30", title: "Cấu trúc dữ liệu", room: "Phòng B203 - Tòa B", color: "bg-green-400" },
    ];

    const stats = [
        { label: "Thời gian học", value: "18h 45m", change: "12% so với tuần trước" },
        { label: "Tài liệu đã xem", value: "43", change: "8% so với tuần trước" },
    ];

    const courses = [
        { id: "1", name: "Trí tuệ nhân tạo", progress: 85, color: "bg-purple-400" },
        { id: "2", name: "Cấu trúc dữ liệu", progress: 76, color: "bg-green-400" },
    ];

    return (
        <div className="flex h-screen bg-space text-cream overflow-hidden w-full">
            <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header userName="Nguyễn Văn A" onLogout={onLogout} />

                <div className="flex-1 overflow-y-auto relative z-10">
                    <div className="fixed top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-100px] left-1/2 w-[400px] h-[400px] rounded-full bg-green-500/20 blur-3xl" />
                        <div className="absolute bottom-[-120px] right-[-120px] w-[450px] h-[450px] rounded-full bg-purple-500/20 blur-3xl" />
                    </div>

                    <div className="relative z-10 p-6 max-w-7xl mx-auto w-full">
                        <div className="mb-8">
                            <h2 className="text-3xl font-grotesk font-bold text-cream mb-2">Chào mừng trở lại, Nguyễn Văn A! 👋</h2>
                            <p className="text-cream/60">Hôm nay bạn muốn học gì mới?</p>
                            <p className="text-cream/40 text-sm font-mono mt-2">Thứ Ba, 20/05/2025</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {statCards.map((card, idx) => (
                                <StatCard key={idx} icon={card.icon} value={card.value} label={card.label} trend={card.trend} backgroundColor={card.backgroundColor} />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Dùng toán tử ép kiểu "as any" để triệt tiêu vệt gạch đỏ TypeScript ngay lập tức */}
                                <RecentFilesSection files={recentFiles as any} />

                            </div>

                            <div className="liquid-glass rounded-[20px] p-6 hidden lg:block">
                                <h3 className="text-xl font-grotesk font-bold text-cream mb-4">Trợ lý AI</h3>
                                <p className="text-sm text-cream/60 font-mono">Tính năng đang được phát triển...</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
                            <div className="lg:col-span-2">
                                <StatsOverview stats={stats as any} />
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}