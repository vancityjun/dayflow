// weekly-insight.jsx — AI Summary Screen
// Editorial clarity + minimal data visualization + actionable layer.
// Fintech-inspired but task-management toned.

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

// ── API response shape — plug real data here ─────────────────
const DATA = {
  dateRange: 'Apr 21 – Apr 28',

  insight: 'You are most productive in the morning.',

  timeChart: [
    { label: '8', val: 0.38 },
    { label: '10', val: 1.0 }, // peak
    { label: '12', val: 0.72 },
    { label: '2', val: 0.4 },
    { label: '4', val: 0.18 },
    { label: '6', val: 0.08 },
  ],

  completion: { done: 76, skipped: 24 },

  patterns: [
    { label: 'After 4 PM', text: 'Completion rate drops sharply.' },
    { label: 'Long Tasks', text: '90-min blocks often left unfinished.' },
    { label: '9–11 AM', text: 'Highest output quality of the day.' },
  ],

  suggestions: [
    {
      text: 'Reserve deep work for the morning, before other meetings.',
      action: 'Apply to tomorrow',
    },
    { text: 'Split tasks over 90 minutes into two separate blocks.', action: 'Use this plan' },
    { text: 'Move lower-priority tasks to the afternoon.', action: 'Try this week' },
  ],

  reflection: 'Your schedule is improving compared to last week.',
};

// ─────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────
function MetaLabel({ children }) {
  return (
    <div
      style={{
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: 11,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: C.warm,
      }}
    >
      {children}
    </div>
  );
}

function ChartLabel({ children }) {
  return (
    <div
      style={{
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: 10,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: C.warm,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}

function Hairline() {
  return <div style={{ height: 1, background: C.warm3, margin: '0 24px' }} />;
}

function ArrowRight({ color = C.warm }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M2 6h8M7 3l3 3-3 3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────
function Header() {
  return (
    <div style={{ padding: '20px 24px 26px' }}>
      <MetaLabel>{DATA.dateRange}</MetaLabel>
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: '-0.04em',
          color: C.ink,
          lineHeight: 1.05,
          marginTop: 10,
          marginBottom: 8,
        }}
      >
        Weekly Insight
      </div>
      <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 14, color: C.warm }}>
        Based on your last 7 days
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero Insight — large statement on bare background
// One accent mark beneath — the only non-structural accent use
// ─────────────────────────────────────────────────────────────
function HeroInsight() {
  return (
    <div style={{ padding: '32px 24px 36px' }}>
      <MetaLabel>Main Insight</MetaLabel>
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: '-0.035em',
          color: C.ink,
          lineHeight: 1.3,
          marginTop: 16,
        }}
      >
        {DATA.insight}
      </div>
      <div
        style={{
          width: 32,
          height: 2.5,
          borderRadius: 999,
          background: C.accent,
          marginTop: 24,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Time-of-day bar chart
// ─────────────────────────────────────────────────────────────
function TimeChart() {
  const BAR_H = 52;
  const peak = Math.max(...DATA.timeChart.map((d) => d.val));

  return (
    <div>
      <ChartLabel>Time of day</ChartLabel>
      {/* Bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 5,
          height: BAR_H,
        }}
      >
        {DATA.timeChart.map((d, i) => {
          const isPeak = d.val === peak;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: d.val * BAR_H,
                borderRadius: '3px 3px 0 0',
                background: isPeak ? C.accent : d.val > 0.55 ? C.ink : C.warm3,
              }}
            />
          );
        })}
      </div>
      {/* X-axis labels */}
      <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
        {DATA.timeChart.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: 'Inter',
              fontSize: 9,
              color: C.warm2,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {d.label}
          </div>
        ))}
      </div>
      {/* Peak label */}
      <div
        style={{
          marginTop: 10,
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: 11,
          color: C.warm,
          letterSpacing: '0.01em',
        }}
      >
        Peak: <span style={{ color: C.ink, fontWeight: 600 }}>10 AM</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Completion split chart
// ─────────────────────────────────────────────────────────────
function CompletionChart() {
  const { done, skipped } = DATA.completion;

  return (
    <div>
      <ChartLabel>Completion</ChartLabel>

      {/* Split pill */}
      <div
        style={{
          height: 6,
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          marginBottom: 14,
        }}
      >
        <div style={{ flex: done, background: C.ink }} />
        <div style={{ width: 2, background: C.paper }} />
        <div style={{ flex: skipped, background: C.warm3 }} />
      </div>

      {/* Two stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 24,
              color: C.ink,
              letterSpacing: '-0.04em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {done}%
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 10,
              color: C.warm,
              marginTop: 3,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Done
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 16,
              color: C.warm,
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {skipped}%
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 10,
              color: C.warm2,
              marginTop: 3,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Skipped
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Visualization section — 2-col grid
// ─────────────────────────────────────────────────────────────
function Visualizations() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        padding: '0 24px 36px',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '14px 14px 16px',
          border: `1px solid ${C.warm3}`,
        }}
      >
        <TimeChart />
      </div>
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '14px 14px 16px',
          border: `1px solid ${C.warm3}`,
        }}
      >
        <CompletionChart />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Patterns — 2-col insight blocks
// ─────────────────────────────────────────────────────────────
function PatternBlock({ label, text, span2 }) {
  return (
    <div
      style={{
        background: 'rgba(35,36,34,0.04)',
        borderRadius: 14,
        padding: '16px 16px 18px',
        gridColumn: span2 ? 'span 2' : undefined,
      }}
    >
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.ink,
          lineHeight: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: 16,
          height: 1.5,
          borderRadius: 999,
          background: C.warm2,
          margin: '8px 0 10px',
        }}
      />
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: 13,
          color: C.ink2,
          lineHeight: 1.6,
          letterSpacing: '-0.01em',
        }}
      >
        {text}
      </div>
    </div>
  );
}

function Patterns() {
  return (
    <div style={{ padding: '32px 24px 36px' }}>
      <MetaLabel>Patterns</MetaLabel>
      <div
        style={{
          marginTop: 20,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        {DATA.patterns.map((p, i) => (
          <PatternBlock
            key={i}
            label={p.label}
            text={p.text}
            span2={i === DATA.patterns.length - 1 && DATA.patterns.length % 2 !== 0}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Suggestion card — tappable, inline action
// ─────────────────────────────────────────────────────────────
function SuggestionCard({ text, action }) {
  const [active, setActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerCancel={() => setActive(false)}
      style={{
        padding: '16px 18px 14px',
        borderRadius: 16,
        border: `1.5px solid ${active ? C.warm2 : C.warm3}`,
        background: active ? 'rgba(35,36,34,0.025)' : '#fff',
        cursor: 'pointer',
        transition: 'border-color 0.12s ease, background 0.12s ease',
      }}
    >
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: 15,
          color: C.ink,
          lineHeight: 1.55,
          letterSpacing: '-0.01em',
          marginBottom: 12,
        }}
      >
        {text}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 5,
        }}
      >
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: 12,
            color: C.warm,
            letterSpacing: '0.01em',
          }}
        >
          {action}
        </div>
        <ArrowRight />
      </div>
    </div>
  );
}

function Suggestions() {
  return (
    <div style={{ padding: '32px 24px 36px' }}>
      <MetaLabel>Suggestions</MetaLabel>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DATA.suggestions.map((s, i) => (
          <SuggestionCard key={i} text={s.text} action={s.action} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom CTA — the next step after reading
// ─────────────────────────────────────────────────────────────
function BottomCTA() {
  return (
    <div style={{ padding: '0 24px 32px' }}>
      <button
        style={{
          width: '100%',
          height: 52,
          borderRadius: 999,
          border: 'none',
          background: C.ink,
          color: '#fff',
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        Optimize tomorrow's schedule
        <ArrowRight color="rgba(255,255,255,0.5)" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Reflection footer
// ─────────────────────────────────────────────────────────────
function Reflection() {
  return (
    <div
      style={{
        padding: '4px 24px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div style={{ flex: 1, height: 1, background: C.warm3 }} />
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: 12,
          color: C.warm2,
          whiteSpace: 'nowrap',
        }}
      >
        {DATA.reflection}
      </div>
      <div style={{ flex: 1, height: 1, background: C.warm3 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────
function WeeklyInsightScreen() {
  return (
    <div
      style={{
        background: C.paper,
        minHeight: '100%',
        paddingTop: 64,
        paddingBottom: 48,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <Header />
      <Hairline />
      <HeroInsight />
      <Visualizations />
      <Hairline />
      <Patterns />
      <Hairline />
      <Suggestions />
      <BottomCTA />
      <Reflection />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IOSDevice>
    <WeeklyInsightScreen />
  </IOSDevice>,
);
