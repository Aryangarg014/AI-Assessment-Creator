'use client';

import { useEffect, useState } from 'react';

type HealthStatus = 'checking' | 'connected' | 'disconnected';

interface HealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
  environment: string;
}

export default function HomePage() {
  const [status, setStatus] = useState<HealthStatus>('checking');
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const checkHealth = async () => {
    setStatus('checking');
    setError(null);
    const start = performance.now();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/health`, { cache: 'no-store' });
      const elapsed = Math.round(performance.now() - start);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: HealthResponse = await res.json();
      setData(json);
      setLatency(elapsed);
      setStatus('connected');
    } catch (err) {
      setLatency(null);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('disconnected');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const statusConfig = {
    checking: {
      label: 'Checking…',
      color: '#a78bfa',
      glow: 'rgba(167,139,250,0.4)',
      dot: 'animate-pulse bg-violet-400',
      border: 'rgba(167,139,250,0.3)',
    },
    connected: {
      label: 'Connected',
      color: '#22d3a3',
      glow: 'rgba(34,211,163,0.4)',
      dot: 'bg-emerald-400',
      border: 'rgba(34,211,163,0.3)',
    },
    disconnected: {
      label: 'Disconnected',
      color: '#f87171',
      glow: 'rgba(248,113,113,0.4)',
      dot: 'animate-pulse bg-red-400',
      border: 'rgba(248,113,113,0.3)',
    },
  };

  const cfg = statusConfig[status];

  return (
    <main
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(135deg, #0f0f13 0%, #13101e 50%, #0d1219 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient orbs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,163,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'rgba(28,28,38,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${cfg.border}`,
          borderRadius: '24px',
          padding: '3rem 3.5rem',
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          boxShadow: `0 0 60px ${cfg.glow}, 0 24px 64px rgba(0,0,0,0.5)`,
          transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.75rem',
            boxShadow: '0 8px 32px rgba(108,99,255,0.45)',
            fontSize: '2rem',
          }}
          aria-hidden="true"
        >
          🧠
        </div>

        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #f0f0ff 30%, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          AI Assessment Creator
        </h1>

        <p
          style={{
            fontSize: '0.95rem',
            color: '#9999bb',
            marginBottom: '2.5rem',
          }}
        >
          Backend connection status
        </p>

        {/* Status badge */}
        <div
          id="connection-status"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '999px',
            border: `1px solid ${cfg.border}`,
            background: 'rgba(255,255,255,0.04)',
            marginBottom: '2rem',
            transition: 'all 0.4s ease',
          }}
        >
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: cfg.color,
              boxShadow: `0 0 8px ${cfg.glow}`,
              flexShrink: 0,
              display: 'inline-block',
            }}
            aria-hidden="true"
          />
          <span
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: cfg.color,
              transition: 'color 0.4s ease',
            }}
          >
            {cfg.label}
          </span>
          {latency !== null && (
            <span
              style={{
                fontSize: '0.75rem',
                color: '#9999bb',
                marginLeft: '0.25rem',
              }}
            >
              {latency}ms
            </span>
          )}
        </div>

        {/* Detail rows */}
        {status === 'connected' && data && (
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              textAlign: 'left',
              marginBottom: '1.75rem',
            }}
          >
            {[
              { label: 'Message', value: data.message },
              { label: 'Environment', value: data.environment },
              {
                label: 'Timestamp',
                value: new Date(data.timestamp).toLocaleString(),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}
              >
                <span style={{ fontSize: '0.8rem', color: '#9999bb', flexShrink: 0 }}>
                  {label}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#e0e0f0', textAlign: 'right' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        {status === 'disconnected' && (
          <div
            style={{
              background: 'rgba(248,113,113,0.07)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.75rem',
              fontSize: '0.8rem',
              color: '#fca5a5',
              textAlign: 'left',
            }}
          >
            <strong>Error:</strong> {error}
            <br />
            <span style={{ color: '#9999bb', marginTop: '0.25rem', display: 'block' }}>
              Make sure the backend is running on{' '}
              <code style={{ color: '#a78bfa' }}>
                {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'}
              </code>
            </span>
          </div>
        )}

        {/* Retry button */}
        <button
          id="retry-health-check"
          onClick={checkHealth}
          disabled={status === 'checking'}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: '12px',
            border: 'none',
            background:
              status === 'checking'
                ? 'rgba(108,99,255,0.3)'
                : 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: status === 'checking' ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow:
              status === 'checking' ? 'none' : '0 4px 20px rgba(108,99,255,0.4)',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={(e) => {
            if (status !== 'checking') {
              (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
              (e.target as HTMLButtonElement).style.boxShadow =
                '0 8px 28px rgba(108,99,255,0.55)';
            }
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.target as HTMLButtonElement).style.boxShadow =
              status === 'checking' ? 'none' : '0 4px 20px rgba(108,99,255,0.4)';
          }}
        >
          {status === 'checking' ? 'Checking…' : 'Re-check Connection'}
        </button>
      </div>
    </main>
  );
}
