'use client';

import { useEffect, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type ServiceStatus = 'connected' | 'disconnected' | 'checking';

interface HealthData {
  success: boolean;
  api: { status: string; environment: string; timestamp: string };
  mongodb: { status: string; readyState: number };
  redis: { status: string; ping: string | null };
}

interface ServiceState {
  overall: ServiceStatus;
  data: HealthData | null;
  error: string | null;
  latency: number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toStatus = (s: string): ServiceStatus =>
  s === 'connected' ? 'connected' : 'disconnected';

const palette = {
  connected: {
    color: '#22d3a3',
    glow: 'rgba(34,211,163,0.35)',
    border: 'rgba(34,211,163,0.25)',
    bg: 'rgba(34,211,163,0.07)',
    label: 'Connected',
  },
  disconnected: {
    color: '#f87171',
    glow: 'rgba(248,113,113,0.35)',
    border: 'rgba(248,113,113,0.25)',
    bg: 'rgba(248,113,113,0.07)',
    label: 'Disconnected',
  },
  checking: {
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.35)',
    border: 'rgba(167,139,250,0.25)',
    bg: 'rgba(167,139,250,0.07)',
    label: 'Checking…',
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusDot({ status }: { status: ServiceStatus }) {
  const c = palette[status];
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 9,
        height: 9,
        borderRadius: '50%',
        backgroundColor: c.color,
        boxShadow: `0 0 7px ${c.glow}`,
        flexShrink: 0,
        animation: status === 'checking' ? 'pulse 1.4s ease-in-out infinite' : 'none',
      }}
    />
  );
}

function ServiceCard({
  id,
  icon,
  name,
  status,
  rows,
}: {
  id: string;
  icon: string;
  name: string;
  status: ServiceStatus;
  rows: { label: string; value: string }[];
}) {
  const c = palette[status];
  return (
    <div
      id={id}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>{icon}</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e0e0f0' }}>{name}</span>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: c.color,
            background: 'rgba(0,0,0,0.2)',
            padding: '0.2rem 0.6rem',
            borderRadius: 999,
            border: `1px solid ${c.border}`,
          }}
        >
          <StatusDot status={status} />
          {c.label}
        </span>
      </div>

      {/* Detail rows */}
      {rows.map(({ label, value }) => (
        <div
          key={label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '0.5rem',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#7777aa' }}>{label}</span>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#c0c0e0',
              textAlign: 'right',
              fontFamily: 'monospace',
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [state, setState] = useState<ServiceState>({
    overall: 'checking',
    data: null,
    error: null,
    latency: null,
  });

  const checkHealth = useCallback(async () => {
    setState((s) => ({ ...s, overall: 'checking', error: null }));
    const t0 = performance.now();
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'}/api/health`;
      const res = await fetch(url, { cache: 'no-store' });
      const elapsed = Math.round(performance.now() - t0);
      const json: HealthData = await res.json();
      setState({
        overall: json.success ? 'connected' : 'disconnected',
        data: json,
        error: null,
        latency: elapsed,
      });
    } catch (err) {
      setState({
        overall: 'disconnected',
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        latency: null,
      });
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const { overall, data, error, latency } = state;
  const c = palette[overall];

  // Build service cards from response data
  const mongoStatus: ServiceStatus = data
    ? toStatus(data.mongodb.status)
    : overall === 'checking'
    ? 'checking'
    : 'disconnected';

  const redisStatus: ServiceStatus = data
    ? toStatus(data.redis.status)
    : overall === 'checking'
    ? 'checking'
    : 'disconnected';

  const mongoRows = data
    ? [
        { label: 'State', value: data.mongodb.status },
        { label: 'readyState', value: String(data.mongodb.readyState) },
      ]
    : [{ label: 'State', value: overall === 'checking' ? '—' : 'N/A' }];

  const redisRows = data
    ? [
        { label: 'Ping', value: data.redis.ping ?? '—' },
        { label: 'State', value: data.redis.status },
      ]
    : [{ label: 'State', value: overall === 'checking' ? '—' : 'N/A' }];

  const apiRows = data
    ? [
        { label: 'Environment', value: data.api.environment },
        { label: 'Timestamp', value: new Date(data.api.timestamp).toLocaleTimeString() },
        ...(latency !== null ? [{ label: 'Latency', value: `${latency}ms` }] : []),
      ]
    : [];

  return (
    <>
      {/* Keyframe for the pulsing dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main
        style={{
          minHeight: '100dvh',
          background: 'linear-gradient(135deg, #0f0f13 0%, #13101e 55%, #0d1219 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* Ambient orbs */}
        {[
          { top: '8%', left: '12%', color: 'rgba(108,99,255,0.13)', size: 480 },
          { bottom: '10%', right: '8%', color: 'rgba(34,211,163,0.09)', size: 400 },
          { top: '55%', left: '55%', color: 'rgba(167,139,250,0.07)', size: 320 },
        ].map((orb, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              filter: 'blur(48px)',
              pointerEvents: 'none',
              ...orb,
            }}
          />
        ))}

        {/* Card */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            background: 'rgba(24,24,34,0.88)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: `1px solid ${c.border}`,
            borderRadius: 28,
            padding: '2.5rem',
            maxWidth: 520,
            width: '100%',
            boxShadow: `0 0 72px ${c.glow}, 0 32px 72px rgba(0,0,0,0.55)`,
            transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
            animation: 'fadeUp 0.5s ease both',
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 8px 28px rgba(108,99,255,0.45)',
              marginBottom: '1.5rem',
            }}
            aria-hidden="true"
          >
            🧠
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '1.65rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '0.3rem',
              background: 'linear-gradient(135deg, #f0f0ff 30%, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AI Assessment Creator
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#7777aa', marginBottom: '2rem' }}>
            Infrastructure health dashboard
          </p>

          {/* Overall status badge */}
          <div
            id="overall-status"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: 999,
              border: `1px solid ${c.border}`,
              background: 'rgba(0,0,0,0.25)',
              marginBottom: '1.75rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: c.color,
              transition: 'all 0.4s ease',
            }}
          >
            <StatusDot status={overall} />
            {overall === 'checking'
              ? 'Checking all services…'
              : overall === 'connected'
              ? 'All systems operational'
              : 'One or more services degraded'}
            {latency !== null && (
              <span style={{ fontWeight: 400, fontSize: '0.75rem', color: '#7777aa' }}>
                · {latency}ms
              </span>
            )}
          </div>

          {/* Connection error banner */}
          {error && !data && (
            <div
              style={{
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.25)',
                borderRadius: 12,
                padding: '0.875rem 1rem',
                marginBottom: '1.5rem',
                fontSize: '0.8rem',
                color: '#fca5a5',
              }}
            >
              <strong>Cannot reach backend:</strong> {error}
              <br />
              <span style={{ color: '#7777aa', display: 'block', marginTop: 4 }}>
                Ensure the backend is running on{' '}
                <code style={{ color: '#a78bfa' }}>
                  {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'}
                </code>
              </span>
            </div>
          )}

          {/* Service cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.75rem' }}>
            <ServiceCard
              id="service-api"
              icon="⚡"
              name="Express API"
              status={overall === 'checking' ? 'checking' : overall === 'connected' ? 'connected' : error ? 'disconnected' : 'connected'}
              rows={apiRows.length ? apiRows : [{ label: 'State', value: '—' }]}
            />
            <ServiceCard
              id="service-mongodb"
              icon="🍃"
              name="MongoDB Atlas"
              status={mongoStatus}
              rows={mongoRows}
            />
            <ServiceCard
              id="service-redis"
              icon="⚡"
              name="Upstash Redis"
              status={redisStatus}
              rows={redisRows}
            />
          </div>

          {/* Retry button */}
          <button
            id="retry-health-check"
            onClick={checkHealth}
            disabled={overall === 'checking'}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 14,
              border: 'none',
              background:
                overall === 'checking'
                  ? 'rgba(108,99,255,0.25)'
                  : 'linear-gradient(135deg, #6c63ff 0%, #8b5cf6 100%)',
              color: overall === 'checking' ? '#9999bb' : '#fff',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: overall === 'checking' ? 'not-allowed' : 'pointer',
              boxShadow:
                overall === 'checking' ? 'none' : '0 4px 20px rgba(108,99,255,0.4)',
              transition: 'all 0.2s ease',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={(e) => {
              if (overall !== 'checking') {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 8px 28px rgba(108,99,255,0.55)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                overall === 'checking' ? 'none' : '0 4px 20px rgba(108,99,255,0.4)';
            }}
          >
            {overall === 'checking' ? 'Checking…' : '↺  Re-check All Services'}
          </button>
        </div>
      </main>
    </>
  );
}
