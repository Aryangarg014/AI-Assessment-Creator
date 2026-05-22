'use client';

import { BellIcon, BackArrowIcon, GridIcon, ChevronDownIcon } from '@/components/icons/NavIcons';
import { useRouter } from 'next/navigation';

interface TopNavProps {
  title?: string;
  showBack?: boolean;
}

// ─── User Avatar ──────────────────────────────────────────────────────────────
function UserAvatar() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 700,
        color: 'white',
        flexShrink: 0,
      }}
    >
      JD
    </div>
  );
}

// ─── TopNav ───────────────────────────────────────────────────────────────────
export default function TopNav({ title = 'Assignment', showBack = true }: TopNavProps) {
  const router = useRouter();

  return (
    <header
      style={{
        height: 'var(--topnav-height)',
        background: '#ffffff',
        borderBottom: '1px solid var(--sidebar-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
      }}
    >
      {/* ── Left: Back + Title ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showBack && (
          <button
            id="topnav-back-btn"
            onClick={() => router.back()}
            className="topnav-icon-btn"
            aria-label="Go back"
          >
            <BackArrowIcon />
          </button>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            color: 'var(--topnav-text)',
          }}
        >
          <GridIcon />
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--topnav-text)',
            }}
          >
            {title}
          </span>
        </div>
      </div>

      {/* ── Right: Bell + User ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Notification Bell */}
        <button
          id="topnav-bell-btn"
          className="topnav-icon-btn"
          aria-label="Notifications"
          style={{ position: 'relative', color: 'var(--topnav-icon)' }}
        >
          <BellIcon />
          {/* Notification dot */}
          <span
            aria-label="1 new notification"
            style={{
              position: 'absolute',
              top: 7,
              right: 7,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#ef4444',
              border: '1.5px solid #ffffff',
            }}
          />
        </button>

        {/* User Profile Dropdown */}
        <button
          id="topnav-user-menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 10px 5px 5px',
            borderRadius: 10,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.05)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
          aria-label="User menu"
        >
          <UserAvatar />
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            John Doe
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            <ChevronDownIcon />
          </span>
        </button>
      </div>
    </header>
  );
}
