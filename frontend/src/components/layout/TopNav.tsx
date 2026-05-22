'use client';

import { BellIcon, BackArrowIcon, GridIcon, ChevronDownIcon } from '@/components/icons/NavIcons';
import { useRouter } from 'next/navigation';

interface TopNavProps {
  title?: string;
  showBack?: boolean;
}

function UserAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
      JD
    </div>
  );
}

// ─── TopNav — renders inner content only; card shell is in layout.tsx ─────────
export default function TopNav({ title = 'Assignment', showBack = true }: TopNavProps) {
  const router = useRouter();

  return (
    <>
      {/* Left: back + breadcrumb */}
      <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-1.5 text-[#555]">
          <GridIcon />
          <span className="text-sm font-medium text-[#555]">{title}</span>
        </div>
      </div>

      {/* Right: bell + user */}
      <div className="flex items-center gap-1">
        <button
          id="topnav-bell-btn"
          className="topnav-icon-btn relative"
          aria-label="Notifications"
        >
          <BellIcon />
          <span
            aria-label="1 new notification"
            className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full bg-red-500 border-[1.5px] border-white"
          />
        </button>

        <button
          id="topnav-user-menu"
          className="flex items-center gap-2 px-2.5 py-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
          aria-label="User menu"
        >
          <UserAvatar />
          <span className="text-[13.5px] font-semibold text-[#111]">John Doe</span>
          <ChevronDownIcon />
        </button>
      </div>
    </>
  );
}
