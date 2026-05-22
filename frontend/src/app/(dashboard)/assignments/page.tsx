import type { Metadata } from 'next';
import Link from 'next/link';
import EmptyAssignmentsIllustration from '@/components/illustrations/EmptyAssignments';
import type { Assignment } from '@/types';

export const metadata: Metadata = {
  title: 'Assignments — VedaAI',
  description: 'Create and manage your AI-powered assessments and assignments.',
};

// ─── Data Fetching ────────────────────────────────────────────────────────────
async function getAssignments(): Promise<Assignment[]> {
  try {
    const baseUrl = process.env.BACKEND_URL ?? 'http://localhost:5000';
    const res = await fetch(`${baseUrl}/api/assignments`, {
      cache: 'no-store', // always fresh — will add SWR/revalidation in a later stage
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as Assignment[]) ?? [];
  } catch {
    // Backend is down or unreachable — degrade gracefully to empty state
    return [];
  }
}

// ─── Plus Icon ────────────────────────────────────────────────────────────────
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <line x1="8" y1="2" x2="8" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="8" x2="14" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
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
          maxWidth: 460,
          width: '100%',
        }}
      >
        {/* Illustration */}
        <EmptyAssignmentsIllustration />

        {/* Heading */}
        <h1
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginTop: '1.25rem',
            marginBottom: '0.6rem',
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
            maxWidth: 360,
            marginBottom: '2rem',
          }}
        >
          Create your first assignment to start collecting and grading student
          submissions. You can set up rubrics, define marking criteria, and let AI
          assist with grading.
        </p>

        {/* CTA — more padding than before to match Figma pill size */}
        <Link
          id="create-first-assignment-btn"
          href="/assignments/new"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#141414] text-white text-[0.9rem] font-semibold tracking-[0.005em] shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out hover:bg-[#2a2a2a] hover:-translate-y-px hover:shadow-lg no-underline"
        >
          <PlusIcon />
          Create Your First Assignment
        </Link>
      </div>
    </div>
  );
}

// ─── Assignments Page ─────────────────────────────────────────────────────────
export default async function AssignmentsPage() {
  const assignments = await getAssignments();

  // Empty state — DB is empty or backend is unreachable
  if (assignments.length === 0) {
    return <EmptyState />;
  }

  // Assignment list — will be fully built in a later stage
  // For now, shows a minimal list so the data contract is verified end-to-end
  return (
    <div style={{ padding: '32px 28px' }}>
      <h1
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '1.5rem',
        }}
      >
        Assignments ({assignments.length})
      </h1>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {assignments.map((a) => (
          <li
            key={a._id}
            style={{
              background: 'white',
              borderRadius: 12,
              padding: '16px 20px',
              border: '1px solid var(--sidebar-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {a.title}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Due: {a.dueDate} · Status: {a.status}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
