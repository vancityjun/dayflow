// task-input.jsx — Onboarding: Plan Your Day
// Chip-based task input → AI schedule generation

const { useState, useRef } = React;

const C = {
  paper: '#FAF8F4',
  ink: '#232422',
  ink2: '#3A3A38',
  warm: '#8A857A',
  warm2: '#C9C3B5',
  warm3: '#E8E3D7',
  accent: '#D7FE03',
};

const QUICK_ADD = ['Morning walk', 'Read 30 min', 'Lunch break', 'Review notes', 'Planning'];
const INITIAL = ['Email replies', 'Team standup', 'Deep work'];

// ─────────────────────────────────────────────────────────────
// Step dots
// ─────────────────────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            height: 2.5,
            borderRadius: 999,
            width: i === current ? 22 : 6,
            background: i < current ? C.ink2 : i === current ? C.ink : C.warm3,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Task chip
// ─────────────────────────────────────────────────────────────
function Chip({ label, onRemove }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 8px 6px 13px',
        borderRadius: 999,
        background: hover ? C.warm3 : 'rgba(35,36,34,0.07)',
        transition: 'background 0.12s ease',
      }}
    >
      <span
        style={{
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: 14,
          color: C.ink,
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
      <button
        onPointerDown={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          color: C.warm2,
          fontSize: 17,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────
function TaskInputScreen() {
  const [tasks, setTasks] = useState(INITIAL);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const commit = () => {
    const t = value.trim();
    if (t && !tasks.includes(t)) setTasks((prev) => [...prev, t]);
    setValue('');
  };

  const remove = (i) => setTasks((prev) => prev.filter((_, idx) => idx !== i));

  const quickAdd = (label) => {
    if (!tasks.includes(label)) setTasks((prev) => [...prev, label]);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    }
    if (e.key === 'Backspace' && value === '' && tasks.length > 0) {
      setTasks((prev) => prev.slice(0, -1));
    }
  };

  const canGenerate = tasks.length > 0;

  return (
    <div
      style={{
        background: C.paper,
        minHeight: '100%',
        paddingTop: 64,
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Scrollable body ───────────────────────────────── */}
      <div style={{ flex: 1, padding: '32px 24px 0' }}>
        <StepDots current={3} total={4} />

        {/* Header */}
        <div style={{ marginTop: 28, marginBottom: 36 }}>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: '-0.04em',
              color: C.ink,
              lineHeight: 1.05,
              marginBottom: 10,
            }}
          >
            Plan your day
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 15,
              color: C.warm,
              lineHeight: 1.6,
              letterSpacing: '-0.01em',
            }}
          >
            Tell us what you want to do. We'll build your schedule.
          </div>
        </div>

        {/* ── Chip input box ───────────────────────────────── */}
        <div
          onClick={() => inputRef.current?.focus()}
          style={{
            padding: '16px',
            borderRadius: 16,
            background: 'rgba(35,36,34,0.04)',
            cursor: 'text',
            minHeight: 116,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              alignItems: 'center',
            }}
          >
            {tasks.map((t, i) => (
              <Chip key={i} label={t} onRemove={() => remove(i)} />
            ))}
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKey}
              onBlur={() => {
                if (value.trim()) commit();
              }}
              placeholder="Add a task…"
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: 14,
                color: C.ink,
                letterSpacing: '-0.01em',
                flexGrow: 1,
                minWidth: 90,
                padding: '6px 2px',
              }}
            />
          </div>
        </div>

        {/* AI hint */}
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: 999,
              background: C.accent,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 12,
              color: C.warm,
              letterSpacing: '0.01em',
            }}
          >
            No need to set time — we'll organize your day.
          </span>
        </div>

        {/* ── Quick add ────────────────────────────────────── */}
        <div style={{ marginTop: 38 }}>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: C.warm2,
              marginBottom: 14,
            }}
          >
            Quick add
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {QUICK_ADD.map((s, i) => {
              const added = tasks.includes(s);
              return (
                <button
                  key={i}
                  onClick={() => quickAdd(s)}
                  disabled={added}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 999,
                    border: `1px solid ${added ? 'transparent' : C.warm3}`,
                    background: added ? 'rgba(35,36,34,0.05)' : 'transparent',
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: 13,
                    color: added ? C.warm2 : C.warm,
                    cursor: added ? 'default' : 'pointer',
                    letterSpacing: '-0.01em',
                    transition: 'all 0.12s ease',
                  }}
                >
                  {added ? s : `+ ${s}`}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>

      {/* ── Sticky bottom CTA ──────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          padding: '0 24px 40px',
          background: C.paper,
        }}
      >
        <div style={{ height: 1, background: C.warm3, marginBottom: 20 }} />
        <button
          disabled={!canGenerate}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 999,
            border: 'none',
            background: canGenerate ? C.accent : C.warm3,
            color: canGenerate ? C.ink : C.warm2,
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '-0.02em',
            cursor: canGenerate ? 'pointer' : 'default',
            transition: 'background 0.15s ease, color 0.15s ease',
          }}
        >
          Generate my schedule
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IOSDevice>
    <TaskInputScreen />
  </IOSDevice>,
);
