'use client';

import { useState, useRef, useEffect } from 'react';
import type { Assignment } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(raw: string | undefined): string {
  if (!raw) return '—';
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}-${mm}-${d.getFullYear()}`;
  } catch {
    return raw;
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function DotsIcon() {
  return (
    <svg width="4" height="16" viewBox="0 0 4 16" fill="none" aria-hidden="true">
      <circle cx="2" cy="2"  r="1.6" fill="#BBBBBB" />
      <circle cx="2" cy="8"  r="1.6" fill="#BBBBBB" />
      <circle cx="2" cy="14" r="1.6" fill="#BBBBBB" />
    </svg>
  );
}

// ─── Assignment Card ──────────────────────────────────────────────────────────
interface Props { assignment: Assignment }

export default function AssignmentCard({ assignment }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onMouse = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onMouse); document.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  const assignedOn = formatDate(assignment.createdAt);
  const dueOn = formatDate(assignment.dueDate);

  return (
    /* assignment-card class provides: white bg, rounded-2xl, border, min-height 140, hover shadow */
    <article className="assignment-card">

      {/* Top row: title + 3-dot */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-[1.05rem] font-bold text-[#111] leading-snug flex-1">
          {assignment.title}
        </h2>

        {/* 3-dot menu */}
        <div ref={menuRef} className="relative shrink-0">
          <button
            id={`card-menu-${assignment._id ?? 'item'}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="More options"
            aria-expanded={menuOpen}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
          >
            <DotsIcon />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+4px)] bg-white rounded-[10px] shadow-[0_6px_24px_rgba(0,0,0,0.12)] border border-[#e8e8e8] z-50 min-w-[168px] overflow-hidden"
            >
              <button
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="w-full px-4 py-[11px] text-left text-sm text-[#111] font-medium hover:bg-[#f8f8f8] transition-colors border-none bg-transparent cursor-pointer"
              >
                View Assignment
              </button>
              <button
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="w-full px-4 py-[11px] text-left text-sm text-red-500 font-medium hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer border-t border-[#f5f5f5]"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: dates */}
      <div className="flex items-center justify-between flex-wrap gap-1.5 mt-5">
        <span className="text-[0.8rem] text-[#555]">
          <strong className="font-semibold">Assigned on</strong>
          {' : '}
          <span className="text-[#777]">{assignedOn}</span>
        </span>
        <span className="text-[0.8rem] text-[#555]">
          <strong className="font-semibold">Due</strong>
          {' : '}
          <span className="text-[#777]">{dueOn}</span>
        </span>
      </div>
    </article>
  );
}
