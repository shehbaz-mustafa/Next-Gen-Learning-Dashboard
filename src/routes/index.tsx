import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { Sparkles, TrendingUp, Award } from "lucide-react";

import { fetchCourses } from "@/lib/courses.functions";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { CourseSkeleton } from "@/components/dashboard/CourseSkeleton";

const coursesQuery = queryOptions({
  queryKey: ["courses"],
  queryFn: () => fetchCourses(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — Nebula Learn" },
      { name: "description", content: "Your live learning dashboard powered by edge-rendered data and buttery animations." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery),
  component: Dashboard,
  pendingComponent: DashboardSkeleton,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center bg-[#06060a] text-white/70 p-6 text-sm">
      Failed to load courses: {error.message}
    </div>
  ),
});

function Dashboard() {
  return (
    <div className="dark min-h-screen w-full bg-[#06060a] text-white flex relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-600/10 blur-[120px]" />

      <DashboardSidebar />

      <main className="flex-1 min-w-0 p-6 md:p-10 relative">
        <Header />
        <Suspense fallback={<GridSkeleton />}>
          <CoursesGrid />
        </Suspense>
      </main>
    </div>
  );
}

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-10"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-violet-300/70">Friday · June 5</p>
      <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight">
        Welcome back, <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">Andaz kumar</span>
      </h1>
      <p className="mt-2 text-sm text-white/50 max-w-xl">
        Pick up where you left off. Six enrolled courses, live from the edge.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3 max-w-2xl">
        <Stat icon={Sparkles} label="Active" value="6" />
        <Stat icon={TrendingUp} label="Avg progress" value="45%" />
        <Stat icon={Award} label="Completed" value="12" />
      </div>
    </motion.header>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Sparkles; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-4">
      <div className="flex items-center gap-2 text-white/40 text-xs">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function CoursesGrid() {
  const { data: courses } = useSuspenseQuery(coursesQuery);

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-semibold">Your courses</h2>
        <span className="text-xs text-white/40 font-mono">{courses.length} enrolled</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
        {courses.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
        ))}
      </div>
    </section>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <CourseSkeleton key={i} />
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="dark min-h-screen w-full bg-[#06060a] text-white flex">
      <DashboardSidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="h-10 w-64 rounded-lg bg-white/5 animate-pulse" />
        <div className="mt-3 h-4 w-96 rounded bg-white/5 animate-pulse" />
        <div className="mt-10">
          <GridSkeleton />
        </div>
      </main>
    </div>
  );
}
