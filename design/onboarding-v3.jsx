// Onboarding V3 — iOS Wheel Picker
// Separate file. Does NOT modify V1 or V2.

const { useState } = React;

const C = {
  paper: '#FAF8F4',
  ink: '#232422',
  ink2: '#3A3A38',
  warm: '#8A857A',
  warm2: '#C9C3B5',
  warm3: '#E8E3D7',
  accent: '#D7FE03',
};

// Time options — every 15 min, 4:00 AM → 11:45 AM (32 items)
const TIMES = (() => {
  const pad = (n) => String(n).padStart(2, '0');
  const out = [];
  for (let h = 4; h <= 11; h++) {
    [0, 15, 30, 45].forEach((m) => out.push(`${h}:${pad(m)} AM`));
  }
  return out;
})();

const DEFAULT_TIME = '7:00 AM';

// Wheel geometry
const ITEM_H = 46;
const VISIBLE = 5;
const HEIGHT = ITEM_H * VISIBLE; // 230px

// ─────────────────────────────────────────────────────────────
// Wheel Picker
// Pointer-drag to scroll. Snaps to nearest item on release.
// ─────────────────────────────────────────────────────────────
function WheelPicker({ options, value, onChange }) {
  const selectedIdx = Math.max(0, options.indexOf(value));
  const [dragging, setDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [offset, setOffset] = useState(0); // live pixel offset during drag

  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setStartY(e.clientY);
    setOffset(0);
  };

  const onMove = (e) => {
    if (!dragging) return;
    setOffset(e.clientY - startY);
  };

  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    const delta = -Math.round(offset / ITEM_H);
    const newIdx = Math.max(0, Math.min(options.length - 1, selectedIdx + delta));
    onChange(options[newIdx]);
    setOffset(0);
  };

  return (
    <div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{
        height: HEIGHT,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'ns-resize',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* ── Highlight band behind selected row ── */}
      <div
        style={{
          position: 'absolute',
          top: ITEM_H * Math.floor(VISIBLE / 2),
          left: 0,
          right: 0,
          height: ITEM_H,
          background: 'rgba(35,36,34,0.04)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Hairlines framing the selected row ── */}
      <div
        style={{
          position: 'absolute',
          top: ITEM_H * Math.floor(VISIBLE / 2),
          left: 32,
          right: 32,
          height: ITEM_H,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'rgba(35,36,34,0.14)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'rgba(35,36,34,0.14)',
          }}
        />
      </div>

      {/* ── Top gradient fade ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: ITEM_H * 2,
          background: `linear-gradient(to bottom, ${C.paper} 15%, rgba(250,248,244,0) 100%)`,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* ── Bottom gradient fade ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: ITEM_H * 2,
          background: `linear-gradient(to top, ${C.paper} 15%, rgba(250,248,244,0) 100%)`,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* ── Items ── */}
      {options.map((opt, i) => {
        // relPos: 0 = center, negative = above, positive = below
        const relPos = i - selectedIdx + offset / ITEM_H;
        const absRel = Math.abs(relPos);
        if (absRel > 3.0) return null;

        const isCenter = absRel < 0.45;
        const opacity = Math.max(0.06, 1 - absRel * 0.38);
        const fontSize = isCenter ? 21 : absRel < 1.45 ? 16 : 14;
        const fontWeight = isCenter ? 600 : 400;
        const top = HEIGHT / 2 + relPos * ITEM_H - ITEM_H / 2;

        return (
          <div
            key={opt}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: ITEM_H,
              top,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Inter',
              fontSize,
              fontWeight,
              letterSpacing: '-0.01em',
              fontVariantNumeric: 'tabular-nums',
              color: C.ink,
              opacity,
              zIndex: 1,
              pointerEvents: 'none',
              // Transitions only when not dragging (enables snap animation on release)
              transition: dragging
                ? 'none'
                : 'top 0.14s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.14s ease, font-size 0.14s ease',
            }}
          >
            {opt}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Progress bar — segmented rule (4 steps, step 1 active)
// ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: 5, flex: 1 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            background: i <= current ? C.ink : C.warm3,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V3 Screen
// ─────────────────────────────────────────────────────────────
function OnboardingV3() {
  const [time, setTime] = useState(DEFAULT_TIME);
  const canNext = Boolean(time);

  return (
    <div
      style={{
        background: C.paper,
        minHeight: '100%',
        paddingTop: 64,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── Top nav ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 24px 0',
        }}
      >
        {/* Back button — hidden on step 1 */}
        <div style={{ width: 34, height: 34, flexShrink: 0 }} />

        <ProgressBar current={0} total={4} />

        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: 12,
            color: C.warm,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.02em',
            flexShrink: 0,
          }}
        >
          1/4
        </div>
      </div>

      {/* ── Question ── */}
      <div style={{ padding: '36px 24px 0' }}>
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: '0.16em',
            color: C.warm,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          Question 1
        </div>
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: '-0.03em',
            color: C.ink,
            lineHeight: 1.25,
          }}
        >
          What time do you usually wake up?
        </div>
      </div>

      {/* ── Wheel picker ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ padding: '8px 0' }}>
          <WheelPicker options={TIMES} value={time} onChange={setTime} />
        </div>

        {/* Selected value summary */}
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 13,
            color: C.warm,
            letterSpacing: '0.01em',
            fontVariantNumeric: 'tabular-nums',
            marginTop: 4,
          }}
        >
          Wake-up time: <span style={{ fontWeight: 600, color: C.ink2 }}>{time}</span>
        </div>
      </div>

      {/* ── Next button — sticky bottom ── */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          padding: '20px 24px 28px',
          background: `linear-gradient(to top, ${C.paper} 60%, rgba(250,248,244,0))`,
        }}
      >
        <button
          style={{
            width: '100%',
            height: 52,
            borderRadius: 999,
            border: 'none',
            background: canNext ? C.ink : C.warm3,
            color: canNext ? '#fff' : C.warm,
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: '-0.01em',
            cursor: canNext ? 'pointer' : 'default',
            transition: 'background 0.2s ease, color 0.2s ease',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mount
// ─────────────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IOSDevice>
    <OnboardingV3 />
  </IOSDevice>,
);
