import type { Metadata } from 'next';
import Link from 'next/link';
import EmptyAssignmentsIllustration from '@/components/illustrations/EmptyAssignments';
import AssignmentCard from '@/components/assignments/AssignmentCard';
import FloatingCreateBtn from '@/components/assignments/FloatingCreateBtn';
import { BackArrowIcon } from '@/components/icons/NavIcons';
import type { Assignment } from '@/types';

export const metadata: Metadata = {
  title: 'Assignments — VedaAI',
  description: 'Create and manage your AI-powered assessments and assignments.',
};

// ─── Data Fetching ─────────────────────────────────────────────────────────────
async function getAssignments(): Promise<Assignment[]> {
  try {
    const base = process.env.BACKEND_URL ?? 'http://localhost:5000';
    const res = await fetch(`${base}/api/assignments`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as Assignment[]) ?? [];
  } catch {
    return [];
  }
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function FilterIcon() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden="true">
      <path d="M0.5 1H14.5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2.5 6H12.5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 11H10"    stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="5"      stroke="#BBBBBB" strokeWidth="1.5" />
      <path   d="M10.5 10.5L14 14"          stroke="#BBBBBB" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <line x1="8" y1="2"  x2="8"  y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="8"  x2="14" y2="8"  stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col h-full">
      {/* Mobile page breadcrumb header */}
      <div className="md:hidden mx-3 mt-3 bg-white rounded-[20px] px-4 py-3 flex items-center gap-2 shrink-0">
        <Link href="/" className="w-8 h-8 flex items-center justify-center text-[#555] rounded-lg hover:bg-gray-100 transition-colors no-underline">
          <BackArrowIcon />
        </Link>
        <span className="text-[15px] font-semibold text-[#111] flex-1 text-center pr-8">
          Assignments
        </span>
      </div>

      {/* Centered illustration */}
      <div className="flex-1 flex items-center justify-center px-6 pb-24 md:pb-6">
        <div className="fade-up flex flex-col items-center text-center max-width-[460px] w-full max-w-[460px]">
          <EmptyAssignmentsIllustration />

          <h1 className="text-[1.2rem] font-bold text-[#111] mt-5 mb-2.5 tracking-tight">
            No assignments yet
          </h1>
          <p className="text-[0.875rem] text-[#555] leading-relaxed max-w-[360px] mb-8">
            Create your first assignment to start collecting and grading student
            submissions. You can set up rubrics, define marking criteria, and let
            AI assist with grading.
          </p>

          {/* CTA */}
          <Link
            id="create-first-assignment-btn"
            href="/assignments/new"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#141414] text-white text-[0.9rem] font-semibold tracking-wide shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:bg-[#2a2a2a] hover:-translate-y-px hover:shadow-lg transition-all duration-200 no-underline"
          >
            <PlusIcon />
            Create Your First Assignment
          </Link>
        </div>
      </div>

      {/* Mobile FAB + Bottom Nav spacing */}
      <FloatingCreateBtn />
    </div>
  );
}

// ─── Populated State ──────────────────────────────────────────────────────────
function PopulatedState({ assignments }: { assignments: Assignment[] }) {
  return (
    <div className="flex flex-col">

      {/* ── Mobile page breadcrumb header ── */}
      <div className="md:hidden mx-3 mt-3 bg-white rounded-[20px] px-4 py-3 flex items-center gap-2 shrink-0">
        <Link href="/" className="w-8 h-8 flex items-center justify-center text-[#555] rounded-lg hover:bg-gray-100 transition-colors no-underline">
          <BackArrowIcon />
        </Link>
        <span className="text-[15px] font-semibold text-[#111] flex-1 text-center pr-8">
          Assignments
        </span>
      </div>

      {/* ── Content padded area ── */}
      <div className="p-4 md:p-5 flex flex-col gap-4 pb-28 md:pb-24">

        {/* Desktop page header (green dot + title + subtitle) */}
        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"
              style={{ boxShadow: '0 0 0 3px rgba(34,197,94,0.18)' }}
              aria-hidden="true"
            />
            <h1 className="text-[1.25rem] font-bold text-[#111]">Assignments</h1>
          </div>
          <p className="text-[0.825rem] text-[#777] mt-0.5 ml-[18px]">
            Manage and create assignments for your classes.
          </p>
        </div>

        {/* ── Filter + Search bar — white card ── */}
        <div className="bg-white rounded-[20px] px-4 py-3 flex items-center gap-3">
          {/* Filter button */}
          <button id="filter-by-btn" className="filter-btn">
            <FilterIcon />
            <span className="hidden sm:inline">Filter By</span>
            <span className="sm:hidden">Filter</span>
          </button>

          {/* Divider on desktop */}
          <div className="hidden md:block w-px h-5 bg-[#e0e0e0]" aria-hidden="true" />

          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-[#f7f7f7] rounded-full px-4 py-2 border border-[#ebebeb]">
            <SearchIcon />
            <input
              id="search-assignments-input"
              type="search"
              placeholder="Search Assignment"
              className="flex-1 bg-transparent border-none outline-none text-[0.85rem] text-[#333] placeholder:text-[#bbb]"
            />
          </div>
        </div>

        {/* ── Assignments grid ── */}
        {/* 2 columns desktop / 1 column mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id ?? assignment.title}
              assignment={assignment}
            />
          ))}

          {/* Bottom gradient blur — indicates more content below */}
          {assignments.length > 4 && (
            <div
              className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none col-span-full"
              style={{ background: 'linear-gradient(to bottom, transparent, #f0f2f5 90%)' }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {/* Floating create button (desktop pill + mobile circle) */}
      <FloatingCreateBtn />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AssignmentsPage() {
  const assignments = await getAssignments();
  return assignments.length === 0
    ? <EmptyState />
    : <PopulatedState assignments={assignments} />;
}
