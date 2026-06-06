# Ember Dashboard

A modern, full-stack student learning dashboard built with cutting-edge web technologies. Features real-time course tracking, edge-rendered components, and a beautiful glassmorphic UI.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Create environment variables (copy from .env.example)
cp .env.example .env
# Then update .env with your Supabase credentials

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build & Deploy

```bash
# Production build
npm run build

# Preview build locally
npm preview
```

---

## 🏗️ Architecture Overview

### Tech Stack
- **Framework**: [TanStack React Start](https://tanstack.com/react-start) - Full-stack React meta-framework
- **Routing**: TanStack Router v1 - Type-safe, dynamic file-based routing
- **State Management**: TanStack React Query v5 - Server state management
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible primitives
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 - Utility-first CSS
- **Backend**: Supabase - PostgreSQL database with RLS (Row Level Security)
- **Runtime**: Nitro (edge-first runtime via Cloudflare Workers)
- **Build Tool**: Vite v7 - Lightning-fast bundler

### Project Structure

```
src/
├── routes/              # File-based routing (TanStack Router)
│   ├── __root.tsx      # Root layout wrapper
│   └── index.tsx       # Dashboard page
├── components/
│   ├── dashboard/      # Dashboard-specific components
│   │   ├── CourseCard.tsx       # Individual course card
│   │   ├── CourseSkeleton.tsx   # Loading skeleton
│   │   └── Sidebar.tsx          # Navigation sidebar
│   └── ui/             # Reusable Radix UI components
├── hooks/              # Custom React hooks
├── lib/
│   ├── courses.functions.ts     # Server functions (RPC)
│   ├── error-capture.ts         # Error boundary utilities
│   ├── utils.ts                 # General utilities
│   └── api/             # API server functions
├── integrations/
│   └── supabase/        # Supabase client setup
├── server.ts           # Entry point for server runtime
└── router.tsx          # Router configuration
```

---

## 🔄 Server/Client Component Split

### The Problem
Traditional full-stack React applications face challenges:
- **Data fetching on client**: Extra round trips, slower time-to-interactive
- **Hydration mismatches**: Server and client can render differently
- **Waterfall requests**: Data dependencies cascade in series

### Our Solution: TanStack React Start

TanStack React Start enables **Server Functions** - a seamless way to write server code alongside client code without an explicit API layer.

#### Server Functions (RPC Style)

**Example**: `src/lib/courses.functions.ts`

```typescript
import { createServerFn } from "@tanstack/react-start";

export const fetchCourses = createServerFn({ method: "GET" }).handler(
  async (): Promise<Course[]> => {
    // This code runs ONLY on the server
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("enrolled_at", { ascending: false });
    
    if (error) throw new Error(error.message);
    return (data ?? []) as Course[];
  },
);
```

**Key Points:**
- ✅ Marked with `createServerFn` - compiler knows this is server-only
- ✅ Automatically handles serialization/deserialization of arguments and responses
- ✅ Can access server-only resources (databases, private APIs, environment variables)
- ✅ Throws on the server if client tries to execute it

#### Client-Side Data Fetching with React Query

**Example**: `src/routes/index.tsx`

```typescript
const coursesQuery = queryOptions({
  queryKey: ["courses"],
  queryFn: () => fetchCourses(), // Transparently calls server function
});

export const Route = createFileRoute("/")({
  // Server-side loader ensures data is pre-fetched
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery),
  component: Dashboard,
  pendingComponent: DashboardSkeleton, // Loading UI
  errorComponent: ({ error }) => <ErrorFallback error={error} />,
});

function Dashboard() {
  // Access pre-fetched data with React Query
  const { data: courses } = useSuspenseQuery(coursesQuery);
  return <CoursesGrid courses={courses} />;
}
```

**Key Points:**
- ✅ `ensureQueryData` pre-fetches on the server before rendering
- ✅ `useSuspenseQuery` provides type-safe, pre-fetched data
- ✅ No waterfall: data is ready when component mounts
- ✅ Automatic caching and revalidation

### Data Flow Diagram

```
1. User requests dashboard
   ↓
2. Router loader runs on server
   ├─→ calls ensureQueryData(coursesQuery)
   ├─→ queryFn calls fetchCourses() (server function)
   ├─→ Supabase query executes on server
   ↓
3. Server renders React component with data
   ├─→ No hydration mismatch (data pre-fetched)
   ├─→ HTML sent to client
   ↓
4. Client hydrates
   ├─→ Query cache already populated
   ├─→ Component renders immediately
   ├─→ Smooth animations run
```

---

## 💡 Architectural Choices & Why

### 1. **Supabase for Backend**
- **Why**: PostgreSQL database with built-in RLS, real-time subscriptions, and a JavaScript SDK
- **Benefits**: No custom backend to maintain; secure by default; easy to scale
- **Trade-off**: Less control than custom backend; locked into Postgres ecosystem

### 2. **Server Functions Over Traditional REST**
- **Why**: Eliminates need for explicit API route creation; reduces boilerplate
- **Benefits**: Type-safe end-to-end; single function can be called from server or client; built-in serialization
- **Trade-off**: Less transparent than REST; tied to TanStack ecosystem

### 3. **React Query for State Management**
- **Why**: Specialized for server state (not UI state)
- **Benefits**: Automatic caching, revalidation, background syncing; easy pagination/infinite queries
- **Trade-off**: Learning curve; requires understanding of stale time and cache keys

### 4. **File-Based Routing (TanStack Router)**
- **Why**: Type-safe routing; dynamic route generation
- **Benefits**: Routes are files; loaders are co-located; easy to split-code
- **Trade-off**: Slightly more setup than Next.js; newer, less battle-tested

### 5. **Radix UI + Tailwind**
- **Why**: Unstyled components + utility CSS = maximum flexibility
- **Benefits**: Accessibility baked in; customizable without component forking; small bundle size
- **Trade-off**: More CSS to write; need design system discipline

### 6. **Nitro Runtime (Edge-First)**
- **Why**: Deploy anywhere - Cloudflare Workers, Vercel, Node.js
- **Benefits**: Consistent environment; edge-first performance; better than traditional Node.js
- **Trade-off**: Some Node.js APIs not available at the edge

---

## 🎯 Challenges & Solutions

### Challenge 1: Peer Dependency Conflict
**Problem**: `@lovable.dev/vite-tanstack-config` required `nitro>=3.0.260603-beta` but project had `3.0.260429-beta`.

**Solution**: Used `--legacy-peer-deps` flag during installation to allow mismatched peer versions. This is acceptable for beta versions.

**How to avoid**: Wait for stable releases; pin exact versions instead of ranges.

---

### Challenge 2: Server/Client Split Confusion
**Problem**: Difficult to understand where code runs (server vs client) without clear boundaries.

**Solution**: 
- Named server functions with `.functions.ts` suffix for clarity
- Used `createServerFn` decorator as visual marker
- Added comments explaining execution context
- Kept server code minimal and focused on data fetching

**Best practice**: Server functions should only handle data operations; move business logic to shared utilities.

---

### Challenge 3: Data Fetching Waterfall
**Problem**: Route component needs course data, but it's not fetched until component mounts (slow).

**Solution**:
- Used route loader with `ensureQueryData()`
- Data pre-fetches on server during route resolution
- React Query cache populated before HTML sent to client
- Suspense boundary with skeleton loading state

**Benefit**: Eliminates waterfall; data ready immediately on client.

---

### Challenge 4: Type Safety Across Boundary
**Problem**: Server functions return typed data, but type info could be lost in JSON serialization.

**Solution**:
- Defined `Course` type in Supabase client module
- Server function explicitly returns `Promise<Course[]>`
- React Query `queryOptions` validates response shape
- TypeScript enforces types end-to-end

**Result**: Full type-safety from database to UI.

---

### Challenge 5: Environment Variables for Supabase
**Problem**: Need to share public credentials with client but keep them organized.

**Solution**:
- Created `.env.example` as documentation
- Added `.env` to `.gitignore` to prevent accidental commits
- Used both `NEXT_PUBLIC_*` (for Next.js compatibility) and `VITE_*` (for Vite)
- Clear comments explaining which are public vs private

**Result**: Safe, documented configuration; no secrets in version control.

---

## 🚦 Component Communication Pattern

### Server-Initiated Data Flow (Recommended)
```
Route Loader (server)
  ↓
Server Function (fetchCourses)
  ↓
Supabase Query
  ↓
Cache populated on client
  ↓
Component renders (data ready)
```

### Client-Initiated Refetch (For Interaction)
```
User clicks "Refresh"
  ↓
Component calls queryClient.invalidateQueries()
  ↓
React Query automatically calls server function
  ↓
New data fetched on server
  ↓
Component updates
```

---

## 🎨 UI/UX Features

- **Glassmorphism**: Backdrop blur with transparent components
- **Smooth Animations**: Framer Motion for entrance/exit animations
- **Loading States**: Skeleton screens for better perceived performance
- **Dark Theme**: Built-in dark mode styling
- **Responsive**: Mobile-first design with Tailwind breakpoints
- **Accessible**: Radix UI ensures WCAG 2.1 compliance

---

## 🔐 Security Considerations

### Supabase RLS (Row Level Security)
- Database enforces access control at the row level
- Server functions can safely trust user context
- Never trust client-provided user IDs (RLS validates on server)

### Environment Variables
- Public credentials (Supabase anon key) are in `.env`
- Private credentials should use additional `.env.local`
- Both are git-ignored

### Error Handling
- Server errors caught and rendered as HTML error page
- Prevents leaking stack traces to client
- Error boundary captures SSR errors

---

## 📊 Performance Optimizations

- **Server-side data fetching**: No extra client-server roundtrip
- **Vite code splitting**: Automatic chunk splitting for routes
- **React Query caching**: Reduces redundant API calls
- **Suspense boundaries**: Progressive rendering with streaming
- **Edge runtime**: Deploy closer to users with Nitro

---

## 🔧 Development Workflow

```bash
# Start dev server (HMR enabled)
npm run dev

# Type check
tsc --noEmit

# Lint
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

---

## 📚 Learning Resources

- [TanStack React Start Docs](https://tanstack.com/react-start/latest/docs/overview)
- [TanStack Router Docs](https://tanstack.com/router/latest)
- [React Query Docs](https://tanstack.com/query/latest)
- [Supabase Docs](https://supabase.com/docs)
- [Radix UI Docs](https://www.radix-ui.com/docs/primitives/overview/introduction)

---

## 📝 License

MIT
