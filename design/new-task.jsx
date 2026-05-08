// New Task — editorial extension of Today's Tasks
// Same palette + Inter only. Subtle station motif, headline-scale input.

const { useState, useMemo, useEffect, useRef } = React;

// Tokens — matched to Today's Tasks
const NT = {
  paper: '#FAF8F4',
  ink: '#232422',
  ink2: '#3A3A38',
  warm: '#8A857A',
  warm2: '#C9C3B5',
  warm3: '#E8E3D7',
  accent: '#D7FE03',
};

const ntPad = (n) => String(n).padStart(2, '0');
const ntFmtTime = (m) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${ntPad(mm)} ${ampm}`;
};
const ntFmtDur = (mins) => {
  if (mins < 0) mins = 0;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

// ─────────────────────────────────────────────────────────────
// Top nav — Cancel / Title / Save
// ─────────────────────────────────────────────────────────────
function TopNav({ canSave, onCancel, onSave }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 20px 8px',
        minHeight: 44,
      }}
    >
      <button
        onClick={onCancel}
        style={{
          background: 'transparent',
          border: 'none',
          padding: '8px 4px',
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: '-0.005em',
          color: NT.ink2,
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>

      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: NT.ink,
        }}
      >
        New Task
      </div>

      <button
        onClick={onSave}
        disabled={!canSave}
        style={{
          background: 'transparent',
          border: 'none',
          padding: '8px 4px',
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: '-0.005em',
          color: canSave ? NT.ink : NT.warm2,
          cursor: canSave ? 'pointer' : 'default',
          opacity: canSave ? 1 : 1,
        }}
      >
        Save
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Station node (matches Today's Tasks)
// ─────────────────────────────────────────────────────────────
function NTDot({ variant }) {
  const base = {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };
  if (variant === 'start') {
    // subtle solid ink dot — start of segment
    return (
      <div style={base}>
        <div style={{ width: 9, height: 9, borderRadius: 999, background: NT.ink2 }} />
      </div>
    );
  }
  if (variant === 'end') {
    // open ring — terminus
    return (
      <div style={base}>
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            border: `1.5px solid ${NT.ink2}`,
            background: NT.paper,
          }}
        />
      </div>
    );
  }
  // upcoming — quiet outline
  return (
    <div style={base}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          border: `1.5px solid ${NT.warm2}`,
          background: NT.paper,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Headline-scale title input
// ─────────────────────────────────────────────────────────────
function TitleInput({ value, onChange }) {
  const ref = useRef(null);

  // auto-resize textarea so it feels like typing a headline
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.max(40, el.scrollHeight) + 'px';
  }, [value]);

  return (
    <div style={{ padding: '24px 24px 28px' }}>
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: NT.warm,
          marginBottom: 14,
        }}
      >
        Task
      </div>

      <style>{`
        .nt-title::placeholder {
          color: ${NT.warm2};
          font-weight: 400;
          letter-spacing: -0.02em;
          opacity: 1;
        }
      `}</style>
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter task name"
        spellCheck={false}
        className="nt-title"
        style={{
          width: '100%',
          display: 'block',
          border: 'none',
          resize: 'none',
          background: 'transparent',
          padding: 0,
          margin: 0,
          fontFamily: 'Inter',
          fontWeight: value ? 700 : 400,
          fontSize: 32,
          lineHeight: 1.12,
          letterSpacing: value ? '-0.035em' : '-0.02em',
          color: value ? NT.ink : NT.warm2,
          caretColor: NT.ink,
          transition: 'color 120ms ease',
        }}
      />

      {/* subtle hairline — minimal container cue */}
      <div
        style={{
          marginTop: 14,
          height: 1,
          background: NT.warm3,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Time row — tappable, station-dot left rail
// ─────────────────────────────────────────────────────────────
function TimeRow({
  label,
  value,
  sub,
  variant, // 'start' | 'end'
  upperLine,
  lowerLine,
  active,
  onTap,
}) {
  return (
    <div
      onClick={onTap}
      role="button"
      style={{
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative',
        minHeight: 72,
        cursor: 'pointer',
      }}
    >
      {/* gutter with continuous line */}
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
            width: 1.5,
            transform: 'translateX(-50%)',
            background: upperLine ? NT.warm2 : 'transparent',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            height: '50%',
            width: 1.5,
            transform: 'translateX(-50%)',
            background: lowerLine ? NT.warm2 : 'transparent',
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
          <NTDot variant={variant} />
        </div>
      </div>

      {/* content */}
      <div
        style={{
          flex: 1,
          padding: '16px 24px 16px 4px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: NT.warm,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: '-0.025em',
              color: NT.ink,
              marginTop: 4,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>
        </div>
        {sub != null && (
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 12,
              color: NT.warm,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.01em',
              flexShrink: 0,
            }}
          >
            {sub}
          </div>
        )}
      </div>

      {/* selection underline — only when this row is the active picker */}
      {active && (
        <div
          style={{
            position: 'absolute',
            left: 56,
            right: 24,
            bottom: 6,
            height: 2,
            background: NT.accent,
            borderRadius: 2,
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inline time wheel — implies modal interaction without
// occupying the whole screen with picker UI.
// ─────────────────────────────────────────────────────────────
const TIME_STEPS = (() => {
  const arr = [];
  // 5am to 11:55pm in 5-min steps
  for (let m = 5 * 60; m <= 23 * 60 + 55; m += 5) arr.push(m);
  return arr;
})();

function TimeWheel({ value, onChange }) {
  const trackRef = useRef(null);
  const idx = useMemo(() => {
    let best = 0,
      bestDiff = Infinity;
    TIME_STEPS.forEach((t, i) => {
      const d = Math.abs(t - value);
      if (d < bestDiff) {
        bestDiff = d;
        best = i;
      }
    });
    return best;
  }, [value]);

  // window of 5 entries: -2 .. +2 around current
  const window = [-2, -1, 0, 1, 2].map((o) => TIME_STEPS[idx + o]).filter(Boolean);

  return (
    <div style={{ padding: '12px 24px 4px' }}>
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          overflow: 'hidden',
          height: 36,
          position: 'relative',
        }}
      >
        {window.map((t, i) => {
          const center = i === Math.floor(window.length / 2);
          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              style={{
                flex: 1,
                height: 28,
                border: 'none',
                background: 'transparent',
                color: center ? NT.ink : NT.warm2,
                borderRadius: 0,
                padding: 0,
                fontFamily: 'Inter',
                fontWeight: center ? 600 : 500,
                fontSize: center ? 13 : 11,
                letterSpacing: '0.005em',
                fontVariantNumeric: 'tabular-nums',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {ntFmtTime(t)}
              {center && (
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: -6,
                    transform: 'translateX(-50%)',
                    width: 18,
                    height: 1.5,
                    background: NT.ink,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom CTA — Add Task
// ─────────────────────────────────────────────────────────────
function AddTaskCTA({ enabled, onPress }) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 16px 24px',
        background: `linear-gradient(to top, ${NT.paper} 60%, rgba(250,248,244,0))`,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <button
        onClick={onPress}
        disabled={!enabled}
        style={{
          width: '100%',
          height: 54,
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
          cursor: enabled ? 'pointer' : 'default',
          pointerEvents: 'auto',
          borderRadius: 50,
          background: NT.ink,
          opacity: enabled ? 1 : 0.35,
          transition: 'opacity 160ms ease',
        }}
      >
        Add task
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Context — selectable "Place after" options
// ─────────────────────────────────────────────────────────────
function ContextRadio({ checked }) {
  return (
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: 999,
        border: `1.5px solid ${checked ? NT.ink : NT.warm2}`,
        background: NT.paper,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'border-color 120ms ease',
      }}
    >
      {checked && (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: NT.ink,
          }}
        />
      )}
    </div>
  );
}

function ContextOption({ eyebrow, title, meta, checked, onSelect }) {
  return (
    <div
      onClick={onSelect}
      role="button"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 0',
        cursor: 'pointer',
      }}
    >
      <div style={{ width: 22, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <ContextRadio checked={checked} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: '0.16em',
            color: NT.warm,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: checked ? 600 : 500,
            fontSize: 14,
            color: checked ? NT.ink : NT.ink2,
            marginTop: 3,
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 120ms ease',
          }}
        >
          {title}
          <span
            style={{
              color: NT.warm2,
              fontVariantNumeric: 'tabular-nums',
              marginLeft: 8,
              fontWeight: 500,
            }}
          >
            {meta}
          </span>
        </div>
      </div>
    </div>
  );
}

function ContextSection({ prevTask, nextTask }) {
  const [placement, setPlacement] = useState('after');
  return (
    <div style={{ padding: '28px 24px 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: NT.warm,
          }}
        >
          Place in day
        </div>
      </div>

      <ContextOption
        eyebrow="After"
        title={prevTask.title}
        meta={`ends ${ntFmtTime(prevTask.end)}`}
        checked={placement === 'after'}
        onSelect={() => setPlacement('after')}
      />

      <div style={{ height: 1, background: NT.warm3, marginLeft: 36 }} />

      <ContextOption
        eyebrow="Before"
        title={nextTask.title}
        meta={`at ${ntFmtTime(nextTask.start)}`}
        checked={placement === 'before'}
        onSelect={() => setPlacement('before')}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────
function NewTaskScreen() {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState(12 * 60 + 50); // 12:50 pm — slot after current "Design review"
  const [end, setEnd] = useState(13 * 60 + 45); // 1:45 pm
  const [active, setActive] = useState('start'); // 'start' | 'end'

  const canSave = title.trim().length > 0 && end > start;

  // Keep a sane gap when adjusting
  const setStartSafe = (v) => {
    const clamped = Math.max(5 * 60, Math.min(23 * 60 + 55, v));
    setStart(clamped);
    if (end <= clamped) setEnd(Math.min(23 * 60 + 55, clamped + 30));
  };
  const setEndSafe = (v) => {
    const clamped = Math.max(5 * 60, Math.min(23 * 60 + 55, v));
    setEnd(Math.max(start + 5, clamped));
  };

  const dur = end - start;

  // Existing schedule context — inferred from Today's Tasks
  const prevTask = { title: 'Design review', end: 12 * 60 + 45 };
  const nextTask = { title: 'Pair on onboarding', start: 14 * 60 + 0 };

  return (
    <div
      data-screen-label="01 New Task"
      style={{
        background: NT.paper,
        color: NT.ink,
        fontFamily: 'Inter, sans-serif',
        paddingTop: 56, // status bar / Dynamic Island
        paddingBottom: 120, // sticky CTA + home indicator
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopNav canSave={canSave} onCancel={() => {}} onSave={() => {}} />

      <TitleInput value={title} onChange={setTitle} />

      {/* Schedule label */}
      <div
        style={{
          padding: '4px 24px 0',
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: NT.warm,
        }}
      >
        Schedule
      </div>

      {/* Two station rows for Start / End — connected by ink line */}
      <div style={{ marginTop: 6 }}>
        <TimeRow
          label="Start"
          value={ntFmtTime(start)}
          sub={null}
          variant="start"
          upperLine={false}
          lowerLine={true}
          active={active === 'start'}
          onTap={() => setActive('start')}
        />

        <TimeRow
          label="End"
          value={ntFmtTime(end)}
          sub={ntFmtDur(dur)}
          variant="end"
          upperLine={true}
          lowerLine={false}
          active={active === 'end'}
          onTap={() => setActive('end')}
        />
      </div>

      {/* Inline wheel — driven by which row is active */}
      <TimeWheel
        value={active === 'start' ? start : end}
        onChange={active === 'start' ? setStartSafe : setEndSafe}
      />

      {/* Context — quiet selectable list, no card chrome */}
      <ContextSection prevTask={prevTask} nextTask={nextTask} />

      {/* spacer pushes CTA region down */}
      <div style={{ flex: 1, minHeight: 24 }} />

      <AddTaskCTA enabled={canSave} onPress={() => {}} />
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IOSDevice>
    <NewTaskScreen />
  </IOSDevice>,
);
