import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import MobileTopBar from '@/components/layout/MobileTopBar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    /**
     * Outer shell: gray background, full screen.
     * Desktop: padding + gap so cards "float" within the gray space.
     * Mobile: flex-col with no padding (inner components handle their own margin).
     */
    <div className="h-[100dvh] bg-[#f0f2f5] overflow-hidden flex flex-col md:flex-row md:p-3 md:gap-3">

      {/* ── Desktop Sidebar Card ── */}
      <aside className="hidden md:flex flex-col bg-white rounded-[20px] w-[228px] shrink-0 overflow-y-auto overflow-x-hidden">
        <Sidebar />
      </aside>

      {/* ── Right column ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden md:gap-3">

        {/* Mobile Top Bar — visible only on mobile */}
        <div className="md:hidden shrink-0">
          <MobileTopBar />
        </div>

        {/* Desktop TopNav Card — visible only on desktop */}
        <div className="hidden md:flex bg-white rounded-[20px] h-16 shrink-0 items-center justify-between px-5 shadow-sm">
          <TopNav />
        </div>

        {/* Scrollable content — fills remaining height */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto min-h-0"
        >
          {children}
        </main>

        {/* Mobile Bottom Nav — rendered here so it doesn't clip content, positioned fixed */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
