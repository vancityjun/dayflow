// Onboarding flow — step-by-step, one question at a time
// Q1–Q2: picker dropdown for time selection
// Q3–Q4: card buttons for category selection

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

// ─────────────────────────────────────────────────────────────
// Time options — 4:00 AM to 11:30 AM, every 30 min
// ─────────────────────────────────────────────────────────────
const TIME_OPTIONS = (() => {
  const out = [];
  for (let h = 4; h <= 11; h++) {
    [0, 30].forEach((m) => {
      const ampm = h < 12 ? 'AM' : 'PM';
      const h12 = h > 12 ? h - 12 : h;
      const minStr = m === 0 ? '00' : '30';
      out.push(`${h12}:${minStr} ${ampm}`);
    });
  }
  return out;
})();

// ─────────────────────────────────────────────────────────────
// Question data
// type: 'picker' → time dropdown  |  'cards' → tap cards
// ─────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'wake_time',
    question: 'What time do you usually wake up?',
    type: 'picker',
    placeholder: 'Select a time',
    options: TIME_OPTIONS,
  },
  {
    id: 'work_start',
    question: 'When do you usually start working?',
    type: 'picker',
    placeholder: 'Select a time',
    options: TIME_OPTIONS,
  },
  {
    id: 'peak_focus',
    question: 'When are you most focused?',
    type: 'cards',
    options: [
      'Early morning',
      'Mid-morning',
      'Early afternoon',
      'Late afternoon',
      'Evening',
      'It varies',
    ],
  },
  {
    id: 'schedule_style',
    question: 'How do you prefer to structure your day?',
    type: 'cards',
    options: ['Tightly scheduled', 'Loose blocks', 'Flexible / flow', 'React as things come'],
  },
];

// ─────────────────────────────────────────────────────────────
// Progress bar — segmented rule
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
            transition: 'background 0.25s ease',
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Time picker — inline expanding dropdown
// ─────────────────────────────────────────────────────────────
function TimePicker({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* ── Trigger field ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          height: 54,
          padding: '0 18px',
          borderRadius: open ? '14px 14px 0 0' : 14,
          border: `1.5px solid ${open ? C.ink : C.warm3}`,
          borderBottom: open ? `1px solid ${C.warm3}` : `1.5px solid ${open ? C.ink : C.warm3}`,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'Inter, sans-serif',
          fontWeight: value ? 500 : 400,
          fontSize: 16,
          letterSpacing: '-0.01em',
          color: value ? C.ink : C.warm2,
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
          boxShadow: open ? 'none' : '0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{value || placeholder}</span>
        {/* Chevron */}
        <svg
          width="13"
          height="8"
          viewBox="0 0 13 8"
          fill="none"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.20s ease',
          }}
        >
          <path
            d="M1 1l5.5 6L12 1"
            stroke={C.warm}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Option list — inline expansion ── */}
      {open && (
        <div
          style={{
            background: '#fff',
            border: `1.5px solid ${C.ink}`,
            borderTop: 'none',
            borderRadius: '0 0 14px 14px',
            overflowY: 'auto',
            maxHeight: 220,
          }}
        >
          {options.map((opt, i) => {
            const isSelected = value === opt;
            return (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  height: 46,
                  padding: '0 18px',
                  border: 'none',
                  borderTop: i === 0 ? 'none' : `0.5px solid ${C.warm3}`,
                  background: isSelected ? C.ink : 'transparent',
                  color: isSelected ? '#fff' : C.ink,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: 15,
                  letterSpacing: '-0.01em',
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{opt}</span>
                {isSelected && (
                  <svg
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      d="M1.5 5L5 8.5L12.5 1"
                      stroke={C.accent}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Option card — for category-type questions
// ─────────────────────────────────────────────────────────────
function OptionCard({ label, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: '100%',
        padding: '17px 20px',
        borderRadius: 14,
        border: selected ? 'none' : `1.5px solid ${C.warm3}`,
        background: selected ? C.ink : '#fff',
        color: selected ? '#fff' : C.ink,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        fontSize: 16,
        letterSpacing: '-0.015em',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: selected ? 'none' : '0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)',
        transition: 'background 0.15s ease, color 0.15s ease',
        flexShrink: 0,
      }}
    >
      <span>{label}</span>
      {selected && (
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            background: C.accent,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path
              d="M1 4.5L4.5 8L11 1"
              stroke={C.ink}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Question screen — reusable layout, renders picker or cards
// ─────────────────────────────────────────────────────────────
function QuestionScreen({ question, stepIndex, totalSteps, selected, onSelect, onNext, onBack }) {
  const canNext = selected !== null && selected !== undefined;
  const isPicker = question.type === 'picker';

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
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            border: 'none',
            background: C.warm3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: stepIndex > 0 ? 'pointer' : 'default',
            opacity: stepIndex > 0 ? 1 : 0,
            pointerEvents: stepIndex > 0 ? 'auto' : 'none',
            flexShrink: 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
            <path
              d="M7.5 1.5L2 8l5.5 6.5"
              stroke={C.ink2}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <ProgressBar current={stepIndex} total={totalSteps} />

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
          {stepIndex + 1}/{totalSteps}
        </div>
      </div>

      {/* ── Question heading ── */}
      <div style={{ padding: '32px 24px 28px' }}>
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
          Question {stepIndex + 1}
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
          {question.question}
        </div>
      </div>

      {/* ── Input area ── */}
      <div
        style={{
          padding: '0 24px',
          flex: isPicker ? 0 : 1,
          display: 'flex',
          flexDirection: 'column',
          gap: isPicker ? 0 : 10,
        }}
      >
        {isPicker ? (
          <TimePicker
            options={question.options}
            value={selected}
            onChange={onSelect}
            placeholder={question.placeholder}
          />
        ) : (
          question.options.map((opt) => (
            <OptionCard
              key={opt}
              label={opt}
              selected={selected === opt}
              onSelect={() => onSelect(opt)}
            />
          ))
        )}
      </div>

      {/* ── Spacer for picker (pushes Next to bottom) ── */}
      {isPicker && <div style={{ flex: 1 }} />}

      {/* ── Next button — sticky bottom ── */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          padding: '20px 24px 28px',
          background: `linear-gradient(to top, ${C.paper} 60%, rgba(250,248,244,0))`,
          marginTop: 20,
        }}
      >
        <button
          onClick={canNext ? onNext : undefined}
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
// Completion screen
// ─────────────────────────────────────────────────────────────
function CompletionScreen() {
  return (
    <div
      style={{
        background: C.paper,
        minHeight: '100%',
        paddingTop: 64,
        paddingBottom: 48,
        paddingLeft: 24,
        paddingRight: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          background: C.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        <svg width="30" height="22" viewBox="0 0 30 22" fill="none">
          <path
            d="M2 11L11 20L28 2"
            stroke={C.ink}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: '-0.04em',
          color: C.ink,
          marginBottom: 14,
        }}
      >
        All set!
      </div>
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: 16,
          color: C.warm,
          lineHeight: 1.55,
          maxWidth: 260,
          marginBottom: 52,
        }}
      >
        We'll build your perfect daily schedule around your rhythm.
      </div>
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
        }}
      >
        Get started
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Root controller
// ─────────────────────────────────────────────────────────────
function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const totalSteps = QUESTIONS.length;
  const current = QUESTIONS[step];
  const selected = answers[current?.id] ?? null;

  const handleSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
  };

  const handleNext = () => {
    if (!selected) return;
    if (step < totalSteps - 1) setStep((s) => s + 1);
    else setDone(true);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (done) return <CompletionScreen />;

  return (
    <QuestionScreen
      question={current}
      stepIndex={step}
      totalSteps={totalSteps}
      selected={selected}
      onSelect={handleSelect}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Mount
// ─────────────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IOSDevice>
    <OnboardingScreen />
  </IOSDevice>,
);
