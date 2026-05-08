// ai-summary.jsx — AI Weekly Summary Screen
// Typography-first. No cards. Hierarchy through type scale, weight, and whitespace.

const C = {
  paper: '#FAF8F4',
  ink: '#232422',
  ink2: '#3A3A38',
  warm: '#8A857A',
  warm2: '#C9C3B5',
  warm3: '#E8E3D7',
  accent: '#D7FE03',
};

// ── Plug real API response here ──────────────────────────────
const DATA = {
  dateRange: 'Apr 21 – Apr 28',
  main: 'You are most productive in the first half of the day.',
  patterns: [
    'Tasks scheduled after 4 PM are consistently skipped.',
    'Work blocks longer than 90 minutes tend to remain incomplete.',
    'Your output is most focused between 9 AM and noon.',
  ],
  suggestions: [
    'Reserve deep work for the morning, before other meetings begin.',
    'Split tasks over 90 minutes into two separate blocks.',
    'Move low-priority work to the afternoon and protect the morning.',
  ],
  reflection: 'Your schedule is improving compared to last week.',
};

// ─────────────────────────────────────────────────────────────
// Reusable atoms
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

function Hairline({ mx = 24 }) {
  return (
    <div
      style={{
        height: 1,
        background: C.warm3,
        marginLeft: mx,
        marginRight: mx,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// 1. Header
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

      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: 14,
          color: C.warm,
        }}
      >
        Based on your last 7 days
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Main Insight — the visual anchor of the screen
//    Largest type. No card, no box. One short accent mark below.
// ─────────────────────────────────────────────────────────────
function MainInsight() {
  return (
    <div style={{ padding: '28px 24px 36px' }}>
      <MetaLabel>Main Insight</MetaLabel>

      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: '-0.035em',
          color: C.ink,
          lineHeight: 1.28,
          marginTop: 14,
        }}
      >
        {DATA.main}
      </div>

      {/* Accent mark — editorial punctuation, not decoration */}
      <div
        style={{
          width: 36,
          height: 2.5,
          borderRadius: 999,
          background: C.accent,
          marginTop: 22,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Patterns — AI sentences, warm dot anchor, no cards
// ─────────────────────────────────────────────────────────────
function Patterns() {
  return (
    <div style={{ padding: '28px 24px 36px' }}>
      <MetaLabel>Patterns</MetaLabel>

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {DATA.patterns.map((sentence, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: 999,
                background: C.warm2,
                flexShrink: 0,
                marginTop: 8,
              }}
            />
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: 15,
                color: C.ink,
                lineHeight: 1.65,
                letterSpacing: '-0.01em',
              }}
            >
              {sentence}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Suggestions — slightly more emphasis than patterns
//    Accent dots. Weight 500. Very subtle background tint.
// ─────────────────────────────────────────────────────────────
function Suggestions() {
  return (
    <div
      style={{
        background: 'rgba(35,36,34,0.030)',
        padding: '28px 24px 36px',
      }}
    >
      <MetaLabel>Suggestions</MetaLabel>

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {DATA.suggestions.map((sentence, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            {/* Accent dot — the only #d7fe03 in this section */}
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: C.accent,
                flexShrink: 0,
                marginTop: 7,
              }}
            />
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: 15,
                color: C.ink2,
                lineHeight: 1.65,
                letterSpacing: '-0.01em',
              }}
            >
              {sentence}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. Reflection footer — very quiet, emotional close
// ─────────────────────────────────────────────────────────────
function Reflection() {
  return (
    <div
      style={{
        padding: '20px 24px 8px',
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
function AISummaryScreen() {
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
      <MainInsight />
      <Hairline />
      <Patterns />
      <Hairline />
      <Suggestions />
      <Reflection />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IOSDevice>
    <AISummaryScreen />
  </IOSDevice>,
);
