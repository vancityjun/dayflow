// Live Activity — iOS Lock Screen states
// 3 states: Upcoming · In Progress · Time Ended
// Compact lock-screen cards. Same design system as the main app.

const TASK = {
  title: 'Design review',
  range: '11:30 AM — 12:45 PM',
};

const C = {
  paper: '#FAF8F4',
  ink: '#232422',
  ink2: '#3A3A38',
  warm: '#8A857A',
  warm2: '#C9C3B5',
  warm3: '#E8E3D7',
  accent: '#D7FE03',
};

// ─────────────────────────────────────────────────────────────
// Shared: thin progress bar
// ─────────────────────────────────────────────────────────────
function TaskProgress({ progress, dark, ended = false }) {
  const trackBg = dark ? 'rgba(255,255,255,0.10)' : C.warm3;
  const fillBg = ended ? 'rgba(255,255,255,0.32)' : dark ? C.accent : C.ink;

  return (
    <div
      style={{
        height: 3,
        borderRadius: 2,
        background: trackBg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: `${Math.round(progress * 100)}%`,
          background: fillBg,
          borderRadius: 2,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared: action button
// ─────────────────────────────────────────────────────────────
function ActionBtn({ label, primary, danger, dark = true, fullWidth = false }) {
  let bg, color, border;

  if (primary) {
    bg = dark ? C.accent : C.ink;
    color = dark ? C.ink : '#fff';
    border = 'none';
  } else if (danger) {
    bg = 'transparent';
    color = '#A23A2E';
    border = '1.5px solid #A23A2E';
  } else {
    bg = 'transparent';
    color = dark ? 'rgba(255,255,255,0.82)' : C.ink2;
    border = `1.5px solid ${dark ? 'rgba(255,255,255,0.22)' : C.warm3}`;
  }

  return (
    <button
      style={{
        flex: fullWidth ? undefined : 1,
        width: fullWidth ? '100%' : undefined,
        height: 44,
        borderRadius: 999,
        background: bg,
        color,
        border,
        fontFamily: 'Inter, sans-serif',
        fontWeight: primary ? 600 : 500,
        fontSize: 13,
        letterSpacing: '-0.005em',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// State 1 — Upcoming / Starts Soon
// Calm and readable. No accent — task hasn't started yet.
// ─────────────────────────────────────────────────────────────
function UpcomingCard() {
  return (
    <div
      style={{
        margin: '0 16px',
        padding: '20px 22px 22px',
        borderRadius: 30,
        background: '#fff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.22)',
      }}
    >
      {/* Status + time range */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: C.warm,
            }}
          />
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: C.warm,
            }}
          >
            Starts in 5 min
          </div>
        </div>
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: 12,
            color: C.warm,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.01em',
          }}
        >
          {TASK.range}
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: '-0.03em',
          color: C.ink,
          lineHeight: 1.1,
          marginBottom: 16,
        }}
      >
        {TASK.title}
      </div>

      {/* Readiness indicator — empty track */}
      <div style={{ marginBottom: 18 }}>
        <TaskProgress progress={0} dark={false} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <ActionBtn label="Start" primary dark={false} />
        <ActionBtn label="Snooze" dark={false} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// State 2 — In Progress
// Strongest state. Title + remaining time read at a glance.
// ─────────────────────────────────────────────────────────────
function InProgressCard() {
  return (
    <div
      style={{
        margin: '0 16px',
        padding: '22px 22px 22px',
        borderRadius: 30,
        background: C.ink,
      }}
    >
      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: C.accent,
          }}
        />
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.accent,
          }}
        >
          In Progress
        </div>
      </div>

      {/* Title + remaining — side by side, max visual weight */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: '-0.03em',
            color: '#fff',
            lineHeight: 1.1,
            flex: 1,
          }}
        >
          {TASK.title}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 30,
              color: C.accent,
              letterSpacing: '-0.04em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            58m
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 10,
              color: 'rgba(255,255,255,0.40)',
              marginTop: 4,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}
          >
            left
          </div>
        </div>
      </div>

      {/* Time range */}
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: 12,
          color: 'rgba(255,255,255,0.38)',
          marginBottom: 8,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.01em',
        }}
      >
        {TASK.range}
      </div>

      {/* Progress — ~62% */}
      <TaskProgress progress={0.62} dark={true} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <ActionBtn label="Complete" primary dark={true} />
        <ActionBtn label="Skip" dark={true} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// State 3 — Time Ended
// Compact 3-action layout. Mark complete is the primary CTA.
// ─────────────────────────────────────────────────────────────
function TimeEndedCard() {
  return (
    <div
      style={{
        margin: '0 16px',
        padding: '22px 22px 22px',
        borderRadius: 30,
        background: C.ink,
      }}
    >
      {/* Status + time range */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.28)',
            }}
          />
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.38)',
            }}
          >
            Time Ended
          </div>
        </div>
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: 12,
            color: 'rgba(255,255,255,0.28)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.01em',
          }}
        >
          {TASK.range}
        </div>
      </div>

      {/* Title — slightly dimmed, task is over */}
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: '-0.03em',
          color: 'rgba(255,255,255,0.78)',
          lineHeight: 1.1,
          marginBottom: 14,
        }}
      >
        {TASK.title}
      </div>

      {/* Progress — 100%, muted */}
      <TaskProgress progress={1} dark={true} ended={true} />

      {/* Actions */}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Primary — full width */}
        <ActionBtn label="Mark complete" primary dark={true} fullWidth={true} />
        {/* Secondary row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <ActionBtn label="Reschedule" dark={true} />
          <ActionBtn label="Missed" danger dark={true} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section label — lock screen annotation
// ─────────────────────────────────────────────────────────────
function StateLabel({ children }) {
  return (
    <div
      style={{
        padding: '0 26px 10px',
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.28)',
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Lock screen — all 3 states in sequence
// ─────────────────────────────────────────────────────────────
function LiveActivityScreen() {
  return (
    <div
      style={{
        background: '#0E0E0D',
        minHeight: '100%',
        paddingTop: 64,
        paddingBottom: 60,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Lock screen clock */}
      <div style={{ textAlign: 'center', padding: '16px 0 44px' }}>
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 200,
            fontSize: 78,
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          11:47
        </div>
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 15,
            color: 'rgba(255,255,255,0.50)',
            marginTop: 10,
            letterSpacing: '0.01em',
          }}
        >
          Tuesday, 28 April
        </div>
      </div>

      {/* ── State 1 ── */}
      <div style={{ marginBottom: 36 }}>
        <StateLabel>1 · Upcoming</StateLabel>
        <UpcomingCard />
      </div>

      {/* ── State 2 ── */}
      <div style={{ marginBottom: 36 }}>
        <StateLabel>2 · In Progress</StateLabel>
        <InProgressCard />
      </div>

      {/* ── State 3 ── */}
      <div>
        <StateLabel>3 · Time Ended</StateLabel>
        <TimeEndedCard />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mount
// ─────────────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IOSDevice dark={true}>
    <LiveActivityScreen />
  </IOSDevice>,
);
