import { useState, useEffect, useRef, useMemo } from "react";
import {
  LayoutDashboard, BookOpen, FileText, Calendar, GraduationCap,
  MessageSquare, Award, FolderOpen, Settings, Bell, Search, Flame,
  ChevronDown, LogOut, Sparkles, TrendingUp, Clock, Trophy, Star, Rocket,
} from "lucide-react";
import * as THREE from "three";
import "./Dashboard.css";

interface DashboardProps {
  onLogout?: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [chartRange, setChartRange] = useState("This Week");
  const mountRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────────────────────
  // THREE.JS — cosmic backdrop (stars, nebulas, low-poly planets)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020512, 1);
    mount.appendChild(renderer.domElement);
    camera.position.z = 25;

    // Stars — two layers for parallax
    const makeStars = (count: number, size: number, spread: number, color: number) => {
      const g = new THREE.BufferGeometry();
      const verts: number[] = [];
      for (let i = 0; i < count; i++) {
        verts.push(
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread
        );
      }
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
      const m = new THREE.PointsMaterial({ color, size, sizeAttenuation: true, transparent: true, opacity: 0.9 });
      return { mesh: new THREE.Points(g, m), g, m };
    };
    const starsA = makeStars(2500, 0.05, 180, 0xffffff);
    const starsB = makeStars(900, 0.09, 240, 0xa5b4fc);
    const starsC = makeStars(400, 0.12, 260, 0xf0abfc);
    scene.add(starsA.mesh, starsB.mesh, starsC.mesh);

    // Nebulas — wireframe icosahedrons
    const nebGeo1 = new THREE.IcosahedronGeometry(40, 4);
    const nebMat1 = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.09 });
    const neb1 = new THREE.Mesh(nebGeo1, nebMat1);
    neb1.position.z = -10;
    scene.add(neb1);

    const nebGeo2 = new THREE.IcosahedronGeometry(35, 4);
    const nebMat2 = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.06 });
    const neb2 = new THREE.Mesh(nebGeo2, nebMat2);
    neb2.position.set(15, -10, -12);
    scene.add(neb2);

    // Planets — low-poly with flatShading
    const planets = [
      { color: 0x8b5cf6, size: 4, pos: [20, 15, -15], speed: [0.005, 0.01] },
      { color: 0x3b82f6, size: 3, pos: [-18, -12, -18], speed: [-0.005, 0.008] },
      { color: 0xec4899, size: 2.5, pos: [12, -18, -20], speed: [0.004, 0.006] },
    ].map(p => {
      const geo = new THREE.IcosahedronGeometry(p.size, 1);
      const mat = new THREE.MeshPhongMaterial({ color: p.color, shininess: 30, flatShading: true });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
      scene.add(mesh);
      return { mesh, geo, mat, base: [...p.pos] as number[], speed: p.speed };
    });

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);
    const pl1 = new THREE.PointLight(0x8b5cf6, 2, 60); pl1.position.set(25, 20, -10); scene.add(pl1);
    const pl2 = new THREE.PointLight(0x3b82f6, 2, 60); pl2.position.set(-22, -8, -14); scene.add(pl2);

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = Date.now();

      starsA.mesh.rotation.y += 0.0003;
      starsB.mesh.rotation.y -= 0.0002;
      starsC.mesh.rotation.y += 0.00015;
      neb1.rotation.x += 0.0008; neb1.rotation.y += 0.001;
      neb2.rotation.x -= 0.0006; neb2.rotation.y += 0.0008;

      planets.forEach((p, i) => {
        p.mesh.rotation.x += p.speed[0];
        p.mesh.rotation.y += p.speed[1];
        p.mesh.position.x = p.base[0] + Math.sin(t * 0.0003 + i) * 3;
        p.mesh.position.y = p.base[1] + Math.cos(t * 0.0002 + i) * 2.5;
      });

      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 1.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      [starsA, starsB, starsC].forEach(s => { s.g.dispose(); s.m.dispose(); });
      nebGeo1.dispose(); nebMat1.dispose(); nebGeo2.dispose(); nebMat2.dispose();
      planets.forEach(p => { p.geo.dispose(); p.mat.dispose(); });
      renderer.dispose();
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Data
  // ─────────────────────────────────────────────────────────────
  const stats = [
    { label: "Courses Enrolled", value: "12",   sub: "+2 this month",  color: "from-blue-500/10 to-cyan-500/5",    ring: "ring-blue-500/10",    icon: BookOpen,  iconColor: "text-blue-300" },
    { label: "Hours Studied",    value: "28.5", sub: "+5.3 this week", color: "from-purple-500/10 to-indigo-500/5", ring: "ring-purple-500/10",  icon: Clock,     iconColor: "text-purple-300" },
    { label: "Achievements",     value: "24",   sub: "Badges earned",  color: "from-emerald-500/10 to-teal-500/5",  ring: "ring-emerald-500/10", icon: Trophy,    iconColor: "text-emerald-300" },
    { label: "Average Grade",    value: "92%",  sub: "Excellent!",     color: "from-pink-500/10 to-rose-500/5",    ring: "ring-pink-500/10",    icon: Star,      iconColor: "text-pink-300" },
    { label: "Quests Completed", value: "8",    sub: "Keep it up!",    color: "from-orange-500/10 to-amber-500/5",  ring: "ring-orange-500/10",  icon: Rocket,    iconColor: "text-orange-300" },
  ];

  const courses = [
    { name: "Astronomy 101",        progress: 75, color: "from-blue-400 to-cyan-400" },
    { name: "Physics Fundamentals", progress: 60, color: "from-purple-400 to-violet-500" },
    { name: "Space Exploration",    progress: 40, color: "from-pink-400 to-rose-500" },
    { name: "Data Science Basics",  progress: 80, color: "from-cyan-400 to-teal-400" },
  ];

  const schedule = [
    { time: "9:00 AM",  event: "Astronomy Lecture", room: "Room 201", dot: "bg-blue-400" },
    { time: "11:00 AM", event: "Physics Lab",       room: "Room 305", dot: "bg-purple-400" },
    { time: "2:00 PM",  event: "Group Project",     room: "Online",   dot: "bg-cyan-400" },
    { time: "4:00 PM",  event: "Study Session",     room: "Library",  dot: "bg-amber-400" },
  ];

  const assignments = [
    { title: "Astronomy Quiz",       due: "Due in 2 days", color: "text-red-400",    badge: "bg-red-500/5 border-red-500/10" },
    { title: "Physics Lab Report",   due: "Due in 4 days", color: "text-amber-400",  badge: "bg-amber-500/5 border-amber-500/10" },
    { title: "Space Research Essay", due: "Due in 6 days", color: "text-blue-400",   badge: "bg-blue-500/5 border-blue-500/10" },
  ];

  const navItems = [
    { name: "Dashboard",     icon: LayoutDashboard },
    { name: "My Documents",  icon: BookOpen },
    { name: "Assignments",   icon: FileText },
    { name: "Schedule",      icon: Calendar },
    { name: "Grades",        icon: GraduationCap },
    { name: "Messages",      icon: MessageSquare, badge: 3 },
    { name: "Achievements",  icon: Award },
    { name: "Resources",     icon: FolderOpen },
    { name: "Settings",      icon: Settings },
  ];

  const chartData = useMemo(() => {
    return chartRange === "This Week" ? [35, 50, 42, 65, 58, 78, 82] : [40, 55, 48, 62, 70, 60, 85, 78, 88, 72, 90, 95];
  }, [chartRange]);

  const chartPath = useMemo(() => {
    const n = chartData.length;
    const max = Math.max(...chartData);
    const pts = chartData.map((v, i) => ({
      x: (i / (n - 1)) * 100,
      y: 95 - (v / max) * 80,
    }));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i], p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    const area = d + ` L 100 100 L 0 100 Z`;
    return { line: d, area, last: pts[pts.length - 1], pts };
  }, [chartData]);

  return (
    <div className="min-h-screen text-slate-100 font-sans relative selection:bg-purple-500/30 overflow-hidden">
      {/* THREE.JS background */}
      <div ref={mountRef} className="fixed inset-0 z-0" style={{ background: "#01030a" }} />

      {/* Aurora orbs - Tăng nhẹ kích thước và giữ nguyên độ mờ mượt mà */}
      <div className="aurora" style={{ width: 600, height: 600, top: "-150px", left: "-100px", background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)" }} />
      <div className="aurora" style={{ width: 700, height: 700, top: "25%", right: "-200px", background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)" }} />
      <div className="aurora" style={{ width: 550, height: 550, bottom: "-150px", left: "25%", background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)" }} />

      {/* Grid + gradient overlays */}
      <div className="fixed inset-0 z-[3] pointer-events-none grid-bg opacity-30" />
      <div className="fixed inset-0 z-[3] pointer-events-none bg-gradient-to-b from-transparent via-[#020512]/10 to-[#020512]/60" />

      {/* INTERFACE */}
      <div className="flex relative z-10 max-w-[1600px] mx-auto p-4 gap-4 min-h-screen">

        {/* SIDEBAR - Đã hạ nền xuống white/[0.015] và tăng blur lên backdrop-blur-3xl */}
        <aside className="w-64 shrink-0 flex flex-col justify-between bg-white/[0.015] border border-white/5 backdrop-blur-3xl rounded-3xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.3)] gradient-border">
          <div>
            <div className="flex items-center gap-3 px-2 py-3 mb-6 fade-up">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-violet-500 to-pink-500 flex items-center justify-center glow-pulse">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-extrabold tracking-wide text-[15px] leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  AI Study Hub
                </h1>
                <p className="text-[10px] font-mono tracking-[0.25em] text-blue-400 uppercase">Eduverse</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = activeNav === item.name;
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveNav(item.name)}
                    className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative shine ${
                      active
                        ? "bg-gradient-to-r from-blue-600/15 via-violet-600/10 to-transparent text-white border-l-[3px] border-blue-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                        : "text-slate-400 hover:bg-white/[0.02] hover:text-slate-100 border-l-[3px] border-transparent"
                    }`}
                  >
                    <Icon size={17} className={active ? "text-blue-300" : "text-slate-500 group-hover:text-slate-300"} />
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User card - Giảm opacity nền */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-b from-purple-400 to-indigo-600 border border-purple-300/20 flex items-center justify-center font-bold text-sm text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                    AK
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#020512]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Anh Khoa</h4>
                  <p className="text-[10px] font-mono text-purple-300/80">Year 3 Student</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                title="Log out"
              >
                <LogOut size={14} />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span className="text-blue-300 font-bold">Level 12</span>
                <span>2,140 / 3,000 XP</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950/40 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                  style={{ width: "71%" }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">

          {/* HEADER */}
          <header className="flex items-center justify-between shrink-0 bg-white/[0.015] border border-white/5 backdrop-blur-3xl rounded-2xl px-5 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.15)] fade-up">
            <div>
              <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-pink-300 num-glow">
                Welcome back, Anh Khoa <span className="inline-block animate-pulse">✨</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-mono flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 twinkle" />
                Ready to explore new knowledge today?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-950/35 border border-white/5 rounded-xl flex items-center px-3.5 py-2 gap-2.5 w-72 focus-within:border-blue-500/40 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all">
                <Search size={15} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses, topics, videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-xs text-slate-100 placeholder:text-slate-500"
                />
                <kbd className="text-[9px] font-mono text-slate-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
              </div>

              <button className="w-9 h-9 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition rounded-xl flex items-center justify-center text-slate-300 relative shine">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#020512] animate-pulse" />
              </button>
              <button className="w-9 h-9 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition rounded-xl flex items-center justify-center text-slate-300 shine">
                <Calendar size={16} />
              </button>

              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-orange-500/20 rounded-xl px-3.5 py-1.5 flex items-center gap-2">
                <Flame size={16} className="text-orange-400 fill-orange-400/40" />
                <div className="text-right leading-tight">
                  <p className="text-[9px] font-mono uppercase text-orange-300 tracking-wider">Streak</p>
                  <p className="text-xs font-black text-white">7 Days</p>
                </div>
              </div>
            </div>
          </header>

          {/* STATS - Đổi nền từ bg-slate-950/70 về bg-slate-950/35 */}
          <section className="grid grid-cols-5 gap-3.5 shrink-0">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className={`relative bg-slate-950/35 border border-white/5 backdrop-blur-3xl rounded-2xl p-4 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)] transition-all duration-300 shine ring-1 ${s.ring} fade-up overflow-hidden`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-60 pointer-events-none`} />
                  <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-35 bg-current ${s.iconColor}`} />

                  <div className="relative flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold text-slate-300 tracking-[0.12em] uppercase leading-tight">
                      {s.label}
                    </span>
                    <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 ${s.iconColor}`}>
                      <Icon size={16} />
                    </span>
                  </div>
                  <div className="relative mt-3">
                    <h3 className="text-3xl font-black tracking-tight text-white leading-none num-glow">{s.value}</h3>
                    <p className="text-[10px] font-mono text-cyan-300/90 mt-2 flex items-center gap-1.5">
                      <TrendingUp size={10} /> {s.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* MIDDLE */}
          <section className="grid grid-cols-3 gap-4 min-h-[340px]">
            {/* CHART */}
            <div className="col-span-2 bg-white/[0.015] border border-white/5 backdrop-blur-3xl rounded-3xl p-5 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative overflow-hidden gradient-border">
              <div className="flex justify-between items-center z-10">
                <div>
                  <h3 className="text-sm font-extrabold tracking-wide uppercase text-slate-100">Learning Progress</h3>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">Performance tracking timeline</p>
                </div>
                <select
                  value={chartRange}
                  onChange={(e) => setChartRange(e.target.value)}
                  className="clean-select bg-slate-950/40 border border-white/5 rounded-xl px-3 py-1.5 text-[11px] font-mono text-slate-200 outline-none cursor-pointer transition"
                >
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>

              <div className="flex-1 w-full relative mt-6 min-h-[180px] flex">
                <div className="w-10 flex flex-col justify-between pointer-events-none text-[9px] font-mono text-slate-500 pr-2 py-0">
                  {"100% 75% 50% 25% 0%".split(" ").map((l) => (
                    <div key={l} className="text-right leading-none">{l}</div>
                  ))}
                </div>

                <div className="relative flex-1 h-full">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                    {[0,1,2,3,4].map((i) => (
                      <div key={i} className="w-full border-t border-dashed border-white/[0.04]" />
                    ))}
                  </div>

                  <svg className="absolute inset-0 w-full h-full overflow-visible z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                        <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <path d={chartPath.area} fill="url(#chartGrad)" />
                    <path d={chartPath.line} fill="none" stroke="url(#chartLine)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    {chartPath.pts.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="1" fill="#fff" />
                      </g>
                    ))}
                  </svg>

                  <div
                    className="absolute z-20 -translate-y-[140%] bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded-md shadow-[0_0_16px_rgba(168,85,247,0.5)] whitespace-nowrap"
                    style={{
                      left: `${Math.min(Math.max(chartPath.last.x, 8), 88)}%`,
                      top: `${chartPath.last.y}%`,
                      transform: `translate(-50%, -140%)`,
                    }}
                  >
                    ★ {Math.max(...chartData)}%
                  </div>
                </div>
              </div>

              <div className="flex pl-10 text-[10px] font-mono text-slate-500 mt-2 pt-2 border-t border-white/[0.04] z-10">
                <div className="grid grid-cols-7 flex-1">
                  {(chartRange === "This Week"
                    ? ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
                    : ["W1","W2","W3","W4","W5","W6","W7"]
                  ).map(d => <span key={d} className="text-center">{d}</span>)}
                </div>
              </div>

              <div className="absolute bottom-3 right-4 z-30 pointer-events-none flex items-center gap-2 bg-slate-950/60 border border-purple-500/20 px-2.5 py-1.5 rounded-xl backdrop-blur-md float-bob">
                <span className="text-lg">👨‍🚀</span>
                <div className="text-[9px] font-mono leading-tight pr-0.5">
                  <p className="text-purple-300 font-bold">ORBIT</p>
                  <p className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> live
                  </p>
                </div>
              </div>
            </div>

            {/* COURSE PROGRESS */}
            <div className="bg-white/[0.015] border border-white/5 backdrop-blur-3xl rounded-3xl p-5 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.2)] gradient-border">
              <div>
                <h3 className="text-sm font-extrabold tracking-wide uppercase text-slate-100">Course Progress</h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Active enrollment benchmarks</p>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-4 my-3">
                {courses.map((c, idx) => (
                  <div key={idx} className="space-y-1.5 fade-up" style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200 truncate max-w-[75%]">{c.name}</span>
                      <span className="font-mono text-slate-300 font-bold">{c.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950/40 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full bg-gradient-to-r ${c.color} rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.3)]`}
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-2.5 text-center text-xs font-bold text-blue-300 bg-gradient-to-r from-blue-500/5 to-violet-500/5 hover:from-blue-500/10 hover:to-violet-500/10 border border-blue-500/10 transition rounded-xl shine">
                View All Courses →
              </button>
            </div>
          </section>

          {/* BOTTOM */}
          <section className="grid grid-cols-3 gap-4 shrink-0 pb-2">
            {/* SCHEDULE */}
            <div className="bg-white/[0.015] border border-white/5 backdrop-blur-3xl rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-black tracking-wider uppercase text-slate-100">Today's Schedule</h4>
                <button className="text-[10px] font-mono text-blue-300 hover:text-blue-200 hover:underline">View Calendar</button>
              </div>
              <div className="space-y-2.5">
                {schedule.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03] transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <div>
                        <p className="text-xs font-bold text-slate-100">{s.event}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{s.room}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-300 bg-slate-950/40 border border-white/5 px-2 py-0.5 rounded-md">{s.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ASSIGNMENTS */}
            <div className="bg-white/[0.015] border border-white/5 backdrop-blur-3xl rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-black tracking-wider uppercase text-slate-100">Upcoming Assignments</h4>
                <button className="text-[10px] font-mono text-blue-300 hover:text-blue-200 hover:underline">View All</button>
              </div>
              <div className="space-y-2.5">
                {assignments.map((a, i) => (
                  <div key={i} className={`flex items-center justify-between p-2.5 rounded-xl border ${a.badge} hover:brightness-110 transition`}>
                    <div>
                      <p className="text-xs font-bold text-slate-100">{a.title}</p>
                      <p className={`text-[10px] font-mono mt-0.5 ${a.color}`}>{a.due}</p>
                    </div>
                    <FileText size={14} className="text-slate-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* PROMO */}
            <div className="relative bg-gradient-to-br from-indigo-950/20 via-purple-950/15 to-pink-950/15 border border-purple-500/20 backdrop-blur-3xl rounded-3xl p-5 flex flex-col justify-between shadow-[0_8px_32px_rgba(147,51,234,0.1)] overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

              <div className="relative flex items-start gap-3">
                <span className="text-xl bg-purple-500/10 w-10 h-10 rounded-xl flex items-center justify-center border border-purple-500/20">
                  🚀
                </span>
                <div>
                  <h4 className="text-xs font-extrabold tracking-wide uppercase text-purple-200">Keep Exploring!</h4>
                  <p className="text-[11px] text-slate-300/90 mt-1 leading-relaxed">The universe is full of knowledge waiting for you.</p>
                </div>
              </div>

              <div className="relative mt-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="flex -space-x-1.5">
                    {["A1", "B2", "C3"].map((t, i) => (
                      <div key={t} className={`w-5 h-5 rounded-full border border-slate-900 text-[8px] flex items-center justify-center font-bold text-white bg-gradient-to-br ${["from-blue-500 to-violet-600","from-pink-500 to-rose-600","from-emerald-500 to-cyan-600"][i]}`}>
                        {t}
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-300">
                    <span className="text-emerald-400">+140</span> active now
                  </span>
                </div>
                <button className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 hover:brightness-110 text-white font-mono text-[11px] font-black uppercase tracking-wider rounded-xl transition duration-300 shadow-[0_4px_20px_rgba(147,51,234,0.2)] shine">
                  🌠 Launch Star Map
                </button>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}