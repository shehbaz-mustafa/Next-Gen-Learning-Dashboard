import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, BarChart3, Settings, GraduationCap } from "lucide-react";
import { useState } from "react";

const items = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const [active, setActive] = useState("dashboard");

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl p-4 gap-2 sticky top-0 h-screen">
      <div className="flex items-center gap-2 px-3 py-4 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center shadow-lg shadow-violet-500/30">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Nebula</p>
          <p className="text-[10px] text-white/40 tracking-widest uppercase">Learn</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/20 to-fuchsia-500/10 border border-violet-400/30"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl p-4 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-white/5">
        <p className="text-xs text-white/60">Streak</p>
        <p className="text-2xl font-bold text-white mt-1">14 days</p>
        <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
          />
        </div>
      </div>
    </aside>
  );
}
