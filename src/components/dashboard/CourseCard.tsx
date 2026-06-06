import { motion } from "framer-motion";
import { Clock, User } from "lucide-react";
import type { Course } from "@/integrations/supabase/client";

const colorMap: Record<string, string> = {
  indigo: "from-indigo-500/30 to-indigo-500/0",
  violet: "from-violet-500/30 to-violet-500/0",
  fuchsia: "from-fuchsia-500/30 to-fuchsia-500/0",
  emerald: "from-emerald-500/30 to-emerald-500/0",
  amber: "from-amber-500/30 to-amber-500/0",
  sky: "from-sky-500/30 to-sky-500/0",
};

const barColor: Record<string, string> = {
  indigo: "from-indigo-400 to-indigo-300",
  violet: "from-violet-400 to-violet-300",
  fuchsia: "from-fuchsia-400 to-pink-300",
  emerald: "from-emerald-400 to-teal-300",
  amber: "from-amber-400 to-orange-300",
  sky: "from-sky-400 to-cyan-300",
};

export function CourseCard({ course, index }: { course: Course; index: number }) {
  const grad = colorMap[course.thumbnail_color] ?? colorMap.violet;
  const bar = barColor[course.thumbnail_color] ?? barColor.violet;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 200, damping: 24 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#10101a]/80 backdrop-blur-xl p-5 will-change-transform"
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${grad} opacity-60 group-hover:opacity-100 transition-opacity`}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-widest text-white/50 px-2 py-1 rounded-md bg-white/5 border border-white/5">
            {course.category}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            {course.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white leading-tight">{course.title}</h3>
        <p className="mt-2 text-sm text-white/50 line-clamp-2">{course.description}</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
          <span className="inline-flex items-center gap-1.5">
            <User className="w-3 h-3" />
            {course.instructor}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {course.duration_hours}h
          </span>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs text-white/60 mb-1.5">
            <span>Progress</span>
            <span className="font-mono text-white">{course.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{
                delay: index * 0.06 + 0.2,
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`h-full bg-gradient-to-r ${bar}`}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
