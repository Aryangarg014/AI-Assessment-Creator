import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--content-bg)',
      }}
    >
      {/* ── Left Sidebar ── */}
      <Sidebar />

      {/* ── Right: TopNav + Content ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <TopNav />

        <main
          id="main-content"
          style={{
            flex: 1,
            overflowY: 'auto',
            background: 'var(--content-bg)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
