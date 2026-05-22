import type { Metadata } from 'next';
import Link from 'next/link';
import EmptyAssignmentsIllustration from '@/components/illustrations/EmptyAssignments';

export const metadata: Metadata = {
  title: 'Assignments — VedaAI',
  description: 'Create and manage your AI-powered assessments and assignments.',
};

// ─── Sparkle Icon (reused from sidebar style) ─────────────────────────────────
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <line x1="8" y1="2" x2="8" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="8" x2="14" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Assignments Page ─────────────────────────────────────────────────────────
export default function AssignmentsPage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - var(--topnav-height))',
        padding: '40px 24px',
      }}
    >
      <div
        className="fade-up"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 440,
          width: '100%',
        }}
      >
        {/* Illustration */}
        <EmptyAssignmentsIllustration />

        {/* Heading */}
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginTop: '1.5rem',
            marginBottom: '0.625rem',
            letterSpacing: '-0.01em',
          }}
        >
          No assignments yet
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            maxWidth: 340,
            marginBottom: '1.75rem',
          }}
        >
          Create your first assignment to start collecting and grading student
          submissions. You can set up rubrics, define marking criteria, and let AI
          assist with grading.
        </p>

        {/* CTA Button */}
        <Link
          id="create-first-assignment-btn"
          href="/assignments/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141414] text-white text-[0.9rem] font-semibold tracking-[0.005em] shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out hover:bg-[#2a2a2a] hover:-translate-y-px hover:shadow-lg no-underline"
        >
          <PlusIcon />
          Create Your First Assignment
        </Link>
      </div>
    </div>
  );
}
