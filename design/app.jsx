// Today's Tasks — refined, editorial subway-inspired
// Inter only. Palette: ink, paper, warm grey, single accent.

const { useState, useEffect, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Tokens — restrained palette
// ─────────────────────────────────────────────────────────────
const C = {
  paper: '#FAF8F4', // warm off-white page
  ink: '#232422',
  ink2: '#3A3A38', // secondary text
  warm: '#8A857A', // warm grey, muted text
  warm2: '#C9C3B5', // hairlines + upcoming line
  warm3: '#E8E3D7', // soft fills
  rail: 'rgba(35,36,34,0.10)', // timeline line — softer
  warmMute: '#A39E91', // muted-but-warm copy for inactive rows
  accent: '#D7FE03',
};

// ─────────────────────────────────────────────────────────────
// Mock data — "today" 7am to ~9pm
// ─────────────────────────────────────────────────────────────
const NOW_MIN = 11 * 60 + 47; // 11:47 AM

const TASKS = [
  { id: 'A', title: 'Morning routine', start: 7 * 60 + 0, end: 7 * 60 + 45, status: 'completed' },
  { id: 'B', title: 'Inbox & standup', start: 8 * 60 + 0, end: 8 * 60 + 45, status: 'completed' },
  {
    id: 'C',
    title: 'Deep work — Spec V2',
    start: 9 * 60 + 0,
    end: 11 * 60 + 0,
    status: 'completed',
  },
  { id: 'D', title: 'Coffee & walk', start: 11 * 60 + 0, end: 11 * 60 + 20, status: 'skipped' },
  { id: 'E', title: 'Design review', start: 11 * 60 + 30, end: 12 * 60 + 45, status: 'current' },
  { id: 'F', title: 'Lunch', start: 13 * 60 + 0, end: 13 * 60 + 45, status: 'upcoming' },
  {
    id: 'G',
    title: 'Pair on onboarding',
    start: 14 * 60 + 0,
    end: 15 * 60 + 30,
    status: 'upcoming',
  },
  { id: 'H', title: 'Gym', start: 17 * 60 + 30, end: 18 * 60 + 30, status: 'upcoming' },
  { id: 'I', title: 'Read & wind down', start: 21 * 60 + 0, end: 21 * 60 + 45, status: 'upcoming' },
];

// ─────────────────────────────────────────────────────────────
// Utils
// ─────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0');
const fmtTime = (m) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${pad(mm)} ${ampm}`;
};
const fmtRange = (s, e) => `${fmtTime(s)} – ${fmtTime(e)}`;
const fmtDur = (mins) => {
  if (mins < 0) mins = 0;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

// ─────────────────────────────────────────────────────────────
// Station node — minimal, expressive of state
// ─────────────────────────────────────────────────────────────
function StationDot({ status }) {
  // shared box so all variants center on the same axis
  const base = {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };
  if (status === 'current') {
    return (
      <div style={{ ...base, position: 'relative' }}>
        {/* soft outer halo — flat low-opacity fill, no blur */}
        <div
          style={{
            position: 'absolute',
            width: 22,
            height: 22,
            borderRadius: 999,
            background: C.accent,
            opacity: 0.22,
          }}
        />
        {/* inner solid dot */}
        <div
          style={{
            position: 'relative',
            width: 10,
            height: 10,
            borderRadius: 999,
            background: C.accent,
          }}
        />
      </div>
    );
  }
  if (status === 'completed') {
    return (
      <div style={base}>
        <div style={{ width: 10, height: 10, borderRadius: 999, background: C.ink }} />
      </div>
    );
  }
  if (status === 'skipped') {
    return (
      <div style={base}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            border: `1.5px solid ${C.warm}`,
            background: C.paper,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 14,
              height: 1.5,
              background: C.warm,
              transform: 'translate(-50%, -50%) rotate(45deg)',
            }}
          />
        </div>
      </div>
    );
  }
  // upcoming
  return (
    <div style={base}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          border: `1.5px solid ${C.warm2}`,
          background: C.paper,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Header — date + progress, top-safe-area aware
// ─────────────────────────────────────────────────────────────
function Header({ done, total }) {
  const pct = Math.round((done / total) * 100);
  return (
    <div style={{ padding: '12px 24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.16em',
              color: C.warm,
              textTransform: 'uppercase',
            }}
          >
            Tuesday
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 36,
              letterSpacing: '-0.04em',
              color: C.ink,
              marginTop: 6,
              lineHeight: 1,
            }}
          >
            28 April
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 18,
              color: C.warm,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.01em',
            }}
          >
            {done}
            <span style={{ color: C.warm2 }}>/{total}</span>
          </div>
        </div>
      </div>

      {/* slim progress rule */}
      <div
        style={{
          marginTop: 20,
          height: 2,
          background: C.warm3,
          position: 'relative',
          borderRadius: 2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: `${pct}%`,
            background: C.ink,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Current task card — title-led, minimal
// ─────────────────────────────────────────────────────────────
function CurrentCard({ task, next, nowMin, ended = false }) {
  const remaining = task.end - nowMin;
  const total = task.end - task.start;
  const elapsed = nowMin - task.start;
  const pct = ended ? 100 : Math.max(0, Math.min(100, (elapsed / total) * 100));

  return (
    <div
      style={{
        margin: '12px 16px 8px',
        boxShadow: 'none',
        color: '#fff',
        padding: '26px 26px 26px',
        position: 'relative',
        borderRadius: '30px',
        background: 'rgb(35, 36, 34)',
      }}
    >
      {/* tiny status row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: ended ? 'rgba(255,255,255,0.45)' : C.accent,
          }}
        />
        {ended ? 'Time ended' : 'In progress'}
      </div>

      {/* title */}
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 30,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: '#fff',
          marginTop: 16,
        }}
      >
        {task.title}
      </div>

      {/* schedule + remaining */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 20,
          marginTop: 28,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            Schedule
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 15,
              color: '#fff',
              marginTop: 6,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.01em',
            }}
          >
            {fmtRange(task.start, task.end)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            {ended ? 'Status' : 'Remaining'}
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 24,
              color: ended ? 'rgba(255,255,255,0.85)' : C.accent,
              marginTop: 4,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.022em',
              lineHeight: 1,
            }}
          >
            {ended ? (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.85)',
                }}
              >
                Ended
              </span>
            ) : (
              fmtDur(remaining)
            )}
          </div>
        </div>
      </div>

      {/* slim progress */}
      <div
        style={{
          marginTop: 22,
          height: 3,
          background: 'rgba(255,255,255,0.12)',
          position: 'relative',
          borderRadius: 2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: `${pct}%`,
            background: ended ? 'rgba(255,255,255,0.55)' : C.accent,
            borderRadius: 2,
          }}
        />
      </div>

      {/* next */}
      {next && (
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            Next
          </div>
          <div
            style={{
              flex: 1,
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 14,
              color: 'rgba(255,255,255,0.85)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {next.title}
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 13,
              color: 'rgba(255,255,255,0.65)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {fmtTime(next.start)}
          </div>
        </div>
      )}

      {/* actions */}
      {ended ? (
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            style={{
              width: '100%',
              height: 44,
              borderRadius: 999,
              border: 'none',
              color: C.ink,
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '-0.005em',
              cursor: 'pointer',
              background: 'rgb(215, 254, 3)',
            }}
          >
            Mark complete
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              style={{
                flex: 1,
                height: 44,
                borderRadius: 999,
                background: 'transparent',
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: '-0.005em',
                cursor: 'pointer',
                lineHeight: '1.4',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              Reschedule
            </button>
            <button
              style={{
                flex: 1,
                height: 44,
                borderRadius: 999,
                background: 'transparent',
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: '-0.005em',
                cursor: 'pointer',
                lineHeight: '1.4',
                color: 'rgb(162, 58, 46)',
                border: '1.5px solid rgb(162, 58, 46)',
              }}
            >
              Missed
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
          <button
            style={{
              flex: 1,
              height: 44,
              borderRadius: 999,
              border: 'none',
              color: C.ink,
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '-0.005em',
              cursor: 'pointer',
              background: 'rgb(215, 254, 3)',
            }}
          >
            Complete early
          </button>
          <button
            style={{
              flex: 1,
              height: 44,
              borderRadius: 999,
              background: 'transparent',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 13,
              letterSpacing: '-0.005em',
              cursor: 'pointer',
              lineHeight: '1.4',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            Skip
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Station row — quiet, title-led
// ─────────────────────────────────────────────────────────────
function StationRow({ task, prevStatus, nextStatus, isFirst, isLast }) {
  const { status } = task;

  // line color — uniformly soft; no heavy ink line
  const segColor = () => C.rail;
  void prevStatus;
  void nextStatus;
  const upperColor = isFirst ? 'transparent' : segColor();
  const lowerColor = isLast ? 'transparent' : segColor();

  const titleColor =
    status === 'completed' ? C.warmMute : status === 'skipped' ? C.warmMute : C.ink;

  const timeColor = C.warm;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative',
        minHeight: 64,
      }}
    >
      {/* gutter */}
      <div
        style={{
          width: 56,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            height: '50%',
            width: 2,
            transform: 'translateX(-50%)',
            background: upperColor,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            height: '50%',
            width: 2,
            transform: 'translateX(-50%)',
            background: lowerColor,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        >
          <StationDot status={status} />
        </div>
      </div>

      {/* content */}
      <div
        style={{
          flex: 1,
          padding: '12px 24px 12px 4px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: '-0.018em',
              color: titleColor,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {task.title}
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 12,
              color: timeColor,
              marginTop: 3,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.01em',
            }}
          >
            {fmtRange(task.start, task.end)}
            {status === 'skipped' && (
              <span style={{ marginLeft: 8, color: C.warm, fontStyle: 'italic' }}>skipped</span>
            )}
          </div>
        </div>
        {/* duration on right, very subtle */}
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: 12,
            color: C.warm2,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.01em',
            flexShrink: 0,
          }}
        >
          {fmtDur(task.end - task.start)}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section label — quiet, editorial
// ─────────────────────────────────────────────────────────────
function SectionLabel({ children, count }) {
  return (
    <div
      style={{
        padding: '20px 24px 6px',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: C.warm,
        }}
      >
        {children}
      </div>
      {count != null && (
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: '0.04em',
            color: C.warm2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {count}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom CTA — fixed above home indicator
// ─────────────────────────────────────────────────────────────
function AddBar() {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        marginTop: -120,
        padding: '14px 32px 22px',
        background: `linear-gradient(to top, ${C.paper} 55%, rgba(250,248,244,0))`,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <button
        style={{
          width: '100%',
          height: 52,
          border: 'none',
          boxShadow: 'none',
          color: '#fff',
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: '-0.01em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          cursor: 'pointer',
          pointerEvents: 'auto',
          borderRadius: '50px',
          position: 'relative',
          background: '#2D2E2B',
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            position: 'relative',
            display: 'inline-block',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              height: 1.8,
              background: '#fff',
              transform: 'translateY(-50%)',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: 1.8,
              background: '#fff',
              transform: 'translateX(-50%)',
            }}
          />
        </span>
        Add task
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────
function TodayScreen() {
  const [tweaks, setTweak] = useTweaks(
    /*EDITMODE-BEGIN*/ {
      timeEnded: false,
    } /*EDITMODE-END*/,
  );
  const tasks = TASKS;
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'completed').length;
  const currentIdx = tasks.findIndex((t) => t.status === 'current');
  const current = tasks[currentIdx];
  const next = tasks[currentIdx + 1];

  const past = tasks.slice(0, currentIdx);
  const upcoming = tasks.slice(currentIdx + 1);

  // Render the timeline as ONE continuous list so the line is unbroken.
  // Sections are visual labels above; the list itself is contiguous.
  const allRows = tasks; // all tasks in order

  return (
    <div
      data-screen-label="01 Today"
      style={{
        background: C.paper,
        fontFamily: 'Inter, sans-serif',
        color: C.ink,
        // top safe area clears status bar + Dynamic Island;
        // bottom padding clears the fixed AddBar + home indicator.
        paddingTop: 64,
        paddingBottom: 160,
        minHeight: '100%',
      }}
    >
      <Header done={done} total={total} />
      <CurrentCard task={current} next={next} nowMin={NOW_MIN} ended={tweaks.timeEnded} />

      {/* Today section */}
      <SectionLabel count={`${tasks.length} tasks`}>Today</SectionLabel>

      <div>
        {allRows.map((t, i) => (
          <StationRow
            key={t.id}
            task={t}
            prevStatus={allRows[i - 1]?.status}
            nextStatus={allRows[i + 1]?.status}
            isFirst={i === 0}
            isLast={i === allRows.length - 1}
          />
        ))}
      </div>

      {/* end-of-day quiet marker */}
      <div
        style={{
          padding: '24px 24px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: C.warm2,
        }}
      >
        <div style={{ flex: 1, height: 1, background: C.warm3 }} />
        End of day
        <div style={{ flex: 1, height: 1, background: C.warm3 }} />
      </div>

      <AddBar />

      <TweaksPanel>
        <TweakSection title="Current task">
          <TweakToggle
            label="Time ended"
            value={tweaks.timeEnded}
            onChange={(v) => setTweak('timeEnded', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IOSDevice>
    <TodayScreen />
  </IOSDevice>,
);
