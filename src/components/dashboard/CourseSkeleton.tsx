export function CourseSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#10101a]/80 p-5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-5 w-16 rounded-md bg-white/5" />
        <div className="h-3 w-12 rounded bg-white/5" />
      </div>
      <div className="h-5 w-3/4 rounded bg-white/10" />
      <div className="mt-2 h-3 w-full rounded bg-white/5" />
      <div className="mt-1 h-3 w-2/3 rounded bg-white/5" />
      <div className="mt-5 h-1.5 w-full rounded-full bg-white/5" />
    </div>
  );
}
