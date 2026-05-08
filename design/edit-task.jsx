// Edit Task — editorial counterpart to New Task.
// Same tokens + station motif. Pre-filled values, dirty-state Save,
// status segmented control, day-context selection, low-emphasis Delete.

const { useState, useMemo, useEffect, useRef } = React;

// Tokens — matched to Today's Tasks / New Task
const ET = {
  paper: '#FAF8F4',
  ink: '#232422',
  ink2: '#3A3A38',
  warm: '#8A857A',
  warm2: '#C9C3B5',
  warm3: '#E8E3D7',
  warm4: '#F2EEE5',
  accent: '#D7FE03',
  danger: '#A23A2E',
};

const etPad = (n) => String(n).padStart(2, '0');
const etFmtTime = (m) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${etPad(mm)} ${ampm}`;
};
const etFmtDur = (mins) => {
  if (mins < 0) mins = 0;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

// ─────────────────────────────────────────────────────────────
// Top nav — Cancel / Title / Save (Save dim until dirty)
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
          color: ET.ink2,
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
          color: ET.ink,
        }}
      >
        Edit Task
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
          color: canSave ? ET.ink : ET.warm2,
          cursor: canSave ? 'pointer' : 'default',
        }}
      >
        Save
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Station node — matches existing language
// ─────────────────────────────────────────────────────────────
function ETDot({ variant }) {
  const base = {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };
  if (variant === 'start') {
    return (
      <div style={base}>
        <div style={{ width: 9, height: 9, borderRadius: 999, background: ET.ink2 }} />
      </div>
    );
  }
  if (variant === 'end') {
    return (
      <div style={base}>
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            border: `1.5px solid ${ET.ink2}`,
            background: ET.paper,
          }}
        />
      </div>
    );
  }
  return (
    <div style={base}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          border: `1.5px solid ${ET.warm2}`,
          background: ET.paper,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Headline title — pre-filled, dirty-aware tick mark
// ─────────────────────────────────────────────────────────────
function TitleInput({ value, onChange, dirty }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.max(40, el.scrollHeight) + 'px';
  }, [value]);

  return (
    <div style={{ padding: '20px 24px 24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: ET.warm,
          }}
        >
          Task
        </div>
        {dirty && (
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: ET.ink2,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: 999,
                background: ET.accent,
                display: 'inline-block',
              }}
            />
            Edited
          </div>
        )}
      </div>

      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        style={{
          width: '100%',
          display: 'block',
          border: 'none',
          resize: 'none',
          background: 'transparent',
          padding: 0,
          margin: 0,
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 32,
          lineHeight: 1.12,
          letterSpacing: '-0.035em',
          color: ET.ink,
          caretColor: ET.ink,
        }}
      />

      <div
        style={{
          marginTop: 14,
          height: 1,
          background: ET.warm3,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Time row — same as New Task; "edited" hint when value differs
// ─────────────────────────────────────────────────────────────
function TimeRow({ label, value, sub, variant, upperLine, lowerLine, active, edited, onTap }) {
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
            background: upperLine ? ET.warm2 : 'transparent',
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
            background: lowerLine ? ET.warm2 : 'transparent',
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
          <ETDot variant={variant} />
        </div>
      </div>

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
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: ET.warm,
            }}
          >
            <span>{label}</span>
            {edited && (
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 999,
                  background: ET.accent,
                  display: 'inline-block',
                }}
              />
            )}
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: '-0.025em',
              color: ET.ink,
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
              color: ET.warm,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.01em',
              flexShrink: 0,
            }}
          >
            {sub}
          </div>
        )}
      </div>

      {active && (
        <div
          style={{
            position: 'absolute',
            left: 56,
            right: 24,
            bottom: 6,
            height: 2,
            background: ET.accent,
            borderRadius: 2,
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Time wheel — identical pattern to New Task
// ─────────────────────────────────────────────────────────────
const TIME_STEPS = (() => {
  const arr = [];
  for (let m = 5 * 60; m <= 23 * 60 + 55; m += 5) arr.push(m);
  return arr;
})();

function TimeWheel({ value, onChange }) {
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

  const window = [-2, -1, 0, 1, 2].map((o) => TIME_STEPS[idx + o]).filter(Boolean);

  return (
    <div style={{ padding: '12px 24px 4px' }}>
      <div
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
                color: center ? ET.ink : ET.warm2,
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
              {etFmtTime(t)}
              {center && (
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: -6,
                    transform: 'translateX(-50%)',
                    width: 18,
                    height: 1.5,
                    background: ET.ink,
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
// Status segmented control — Active / Skipped / Completed
// Quiet, type-led — no heavy chips.
// ─────────────────────────────────────────────────────────────
function StatusControl({ value, onChange }) {
  const opts = [
    { id: 'active', label: 'Active' },
    { id: 'skipped', label: 'Skipped' },
    { id: 'completed', label: 'Completed' },
  ];
  return (
    <div style={{ padding: '24px 24px 0' }}>
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: ET.warm,
          marginBottom: 12,
        }}
      >
        State
      </div>
      <div
        style={{
          display: 'flex',
          background: ET.warm4,
          borderRadius: 999,
          padding: 4,
          gap: 0,
        }}
      >
        {opts.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              style={{
                flex: 1,
                height: 36,
                border: 'none',
                background: active ? ET.paper : 'transparent',
                color: active ? ET.ink : ET.warm,
                borderRadius: 999,
                fontFamily: 'Inter',
                fontWeight: active ? 600 : 500,
                fontSize: 13,
                letterSpacing: '-0.005em',
                cursor: 'pointer',
                boxShadow: active ? '0 1px 0 rgba(35,36,34,0.04)' : 'none',
                transition: 'background 120ms ease, color 120ms ease',
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Day context — read-only "where this sits" with subtle rail
// ─────────────────────────────────────────────────────────────
function ContextRow({ eyebrow, title, meta, variant, upperLine, lowerLine, current }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative',
        minHeight: current ? 72 : 48,
      }}
    >
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
            background: upperLine ? ET.warm2 : 'transparent',
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
            background: lowerLine ? ET.warm2 : 'transparent',
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
          {current ? (
            <div
              style={{
                width: 22,
                height: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: ET.ink,
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: 22,
                height: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  border: `1.5px solid ${ET.warm}`,
                  background: ET.paper,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: current ? '14px 24px 14px 4px' : '8px 24px 8px 4px',
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
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: current ? ET.ink2 : ET.warm2,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: current ? 700 : 500,
              fontSize: current ? 17 : 13,
              color: current ? ET.ink : ET.warm,
              marginTop: current ? 4 : 2,
              letterSpacing: current ? '-0.02em' : '-0.005em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: current ? 600 : 500,
            fontSize: current ? 13 : 11,
            color: current ? ET.ink2 : ET.warm2,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.01em',
            flexShrink: 0,
          }}
        >
          {meta}
        </div>
      </div>
    </div>
  );
}

function ContextSection({ prevTask, current, nextTask }) {
  return (
    <div style={{ padding: '24px 0 0' }}>
      <div
        style={{
          padding: '0 24px 12px',
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
            color: ET.warm,
          }}
        >
          In your day
        </div>
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: '0.04em',
            color: ET.warm2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          Tue · Apr 28
        </div>
      </div>

      <ContextRow
        eyebrow="Previous"
        title={prevTask.title}
        meta={`ends ${etFmtTime(prevTask.end)}`}
        variant="upcoming"
        upperLine={false}
        lowerLine={true}
      />

      <ContextRow
        eyebrow="Current"
        title={current.title}
        meta={`${etFmtTime(current.start)} – ${etFmtTime(current.end)}`}
        current
        upperLine={true}
        lowerLine={true}
      />

      <ContextRow
        eyebrow="Next"
        title={nextTask.title}
        meta={`at ${etFmtTime(nextTask.start)}`}
        variant="upcoming"
        upperLine={true}
        lowerLine={false}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Delete — text-only, low emphasis, separated from CTA
// ─────────────────────────────────────────────────────────────
function DeleteAction({ onPress, confirming, onConfirm, onCancel }) {
  if (confirming) {
    return (
      <div
        style={{
          margin: '20px 16px 0',
          padding: '16px 18px',
          background: ET.warm4,
          borderRadius: 14,
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
              fontSize: 13,
              color: ET.ink,
              letterSpacing: '-0.01em',
            }}
          >
            Delete this task?
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 12,
              color: ET.warm,
              marginTop: 2,
              letterSpacing: '-0.005em',
            }}
          >
            This can't be undone.
          </div>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px 4px',
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: 13,
            color: ET.ink2,
            cursor: 'pointer',
          }}
        >
          Keep
        </button>
        <button
          onClick={onConfirm}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px 4px',
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 13,
            color: ET.danger,
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    );
  }
  return (
    <div
      style={{
        margin: '24px 16px 0',
        paddingTop: 16,
        borderTop: `1px solid ${ET.warm3}`,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <button
        onClick={onPress}
        style={{
          background: 'transparent',
          border: 'none',
          padding: '8px 16px',
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: 13,
          letterSpacing: '0.01em',
          color: ET.danger,
          cursor: 'pointer',
          opacity: 0.9,
        }}
      >
        Delete task
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Save CTA — disabled until dirty
// ─────────────────────────────────────────────────────────────
function SaveCTA({ enabled, onPress }) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 16px 24px',
        background: `linear-gradient(to top, ${ET.paper} 60%, rgba(250,248,244,0))`,
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
          background: ET.ink,
          opacity: enabled ? 1 : 0.32,
          transition: 'opacity 160ms ease',
        }}
      >
        Save changes
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────
function EditTaskScreen() {
  // Existing task being edited (matches the "current" task on Today)
  const original = {
    title: 'Design review',
    start: 11 * 60 + 30,
    end: 12 * 60 + 45,
    status: 'active',
  };

  const [title, setTitle] = useState(original.title);
  const [start, setStart] = useState(original.start);
  const [end, setEnd] = useState(original.end);
  const [status, setStatus] = useState(original.status);
  const [active, setActive] = useState('start');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const titleDirty = title.trim() !== original.title;
  const startDirty = start !== original.start;
  const endDirty = end !== original.end;
  const statusDirty = status !== original.status;
  const dirty = titleDirty || startDirty || endDirty || statusDirty;

  const canSave = dirty && title.trim().length > 0 && end > start;

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

  // Day context — neighbouring tasks from Today's Tasks
  const prevTask = { title: 'Coffee & walk', end: 11 * 60 + 20 };
  const nextTask = { title: 'Lunch', start: 13 * 60 + 0 };

  return (
    <div
      data-screen-label="01 Edit Task"
      style={{
        background: ET.paper,
        color: ET.ink,
        fontFamily: 'Inter, sans-serif',
        paddingTop: 56,
        paddingBottom: 120,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopNav canSave={canSave} onCancel={() => {}} onSave={() => {}} />

      <TitleInput value={title} onChange={setTitle} dirty={titleDirty} />

      {/* Schedule label */}
      <div
        style={{
          padding: '0 24px 0',
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: ET.warm,
        }}
      >
        Schedule
      </div>

      <div style={{ marginTop: 6 }}>
        <TimeRow
          label="Start"
          value={etFmtTime(start)}
          sub={null}
          variant="start"
          upperLine={false}
          lowerLine={true}
          active={active === 'start'}
          edited={startDirty}
          onTap={() => setActive('start')}
        />

        <TimeRow
          label="End"
          value={etFmtTime(end)}
          sub={etFmtDur(dur)}
          variant="end"
          upperLine={true}
          lowerLine={false}
          active={active === 'end'}
          edited={endDirty}
          onTap={() => setActive('end')}
        />
      </div>

      <TimeWheel
        value={active === 'start' ? start : end}
        onChange={active === 'start' ? setStartSafe : setEndSafe}
      />

      <StatusControl value={status} onChange={setStatus} />

      <ContextSection
        prevTask={prevTask}
        current={{ title: title || original.title, start, end }}
        nextTask={nextTask}
      />

      <DeleteAction
        onPress={() => setConfirmingDelete(true)}
        confirming={confirmingDelete}
        onConfirm={() => setConfirmingDelete(false)}
        onCancel={() => setConfirmingDelete(false)}
      />

      <div style={{ flex: 1, minHeight: 24 }} />

      <SaveCTA enabled={canSave} onPress={() => {}} />
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IOSDevice>
    <EditTaskScreen />
  </IOSDevice>,
);
