// notification-center.jsx (v2) — native iOS Notification Center card
// Dark translucent card. Icon left, content right. iOS system hierarchy.

const C = {
  ink: '#232422',
  accent: '#D7FE03',
};

// ─────────────────────────────────────────────────────────────
// App icon — rounded square, ink bg, small accent node
// ─────────────────────────────────────────────────────────────
function AppIcon({ size = 40 }) {
  const r = Math.round(size * 0.245);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: C.ink,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: Math.round(size * 0.32),
          height: Math.round(size * 0.32),
          borderRadius: 999,
          background: C.accent,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Card shell — dark frosted glass
// ─────────────────────────────────────────────────────────────
function CardShell({ children }) {
  return (
    <div
      style={{
        margin: '0 16px',
        background: 'rgba(36, 36, 34, 0.90)',
        backdropFilter: 'blur(40px) saturate(160%)',
        WebkitBackdropFilter: 'blur(40px) saturate(160%)',
        borderRadius: 20,
        overflow: 'hidden',
        // top-edge highlight for depth
        boxShadow: '0 6px 28px rgba(0,0,0,0.42), ' + 'inset 0 0.5px 0 rgba(255,255,255,0.12)',
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Notification body — icon left, content right
// ─────────────────────────────────────────────────────────────
function NotificationBody() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 14px 14px',
      }}
    >
      {/* App icon — left column */}
      <AppIcon size={40} />

      {/* Content — right column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Row 1: app name + timestamp */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 12,
              color: 'rgba(255,255,255,0.50)',
              letterSpacing: '0.01em',
            }}
          >
            Tasks
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 12,
              color: 'rgba(255,255,255,0.36)',
            }}
          >
            now
          </div>
        </div>

        {/* Row 2: title */}
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 15,
            color: '#fff',
            letterSpacing: '-0.015em',
            lineHeight: 1.3,
            marginBottom: 3,
          }}
        >
          Design review starts in 5 min
        </div>

        {/* Row 3: body */}
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 13,
            color: 'rgba(255,255,255,0.52)',
            letterSpacing: '0.01em',
            lineHeight: 1.4,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          11:30 AM — 12:45 PM
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Collapsed — body only
// ─────────────────────────────────────────────────────────────
function NotificationCollapsed() {
  return (
    <CardShell>
      <NotificationBody />
    </CardShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Expanded — body + action buttons
// ─────────────────────────────────────────────────────────────
function NotificationExpanded() {
  return (
    <CardShell>
      <NotificationBody />

      {/* Separator */}
      <div
        style={{
          height: 0.5,
          background: 'rgba(255,255,255,0.08)',
        }}
      />

      {/* Action buttons */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '10px 14px 14px',
        }}
      >
        {/* Primary — Start early */}
        <button
          style={{
            flex: 1,
            height: 40,
            borderRadius: 10,
            border: 'none',
            background: 'rgba(255,255,255,0.14)',
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 14,
            color: '#fff',
            letterSpacing: '-0.01em',
            cursor: 'pointer',
          }}
        >
          Start early
        </button>

        {/* Secondary — Snooze */}
        <button
          style={{
            flex: 1,
            height: 40,
            borderRadius: 10,
            border: 'none',
            background: 'rgba(255,255,255,0.07)',
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 14,
            color: 'rgba(255,255,255,0.60)',
            letterSpacing: '-0.01em',
            cursor: 'pointer',
          }}
        >
          Snooze
        </button>
      </div>
    </CardShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Label
// ─────────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <div
      style={{
        padding: '0 26px 10px',
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.26)',
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Showcase — both states, no full lock screen
// ─────────────────────────────────────────────────────────────
function NotificationScreen() {
  return (
    <div
      style={{
        background: '#0E0E0D',
        minHeight: '100%',
        paddingTop: 64,
        paddingBottom: 60,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <Label>Collapsed</Label>
        <NotificationCollapsed />
      </div>

      <div>
        <Label>Expanded · Long press</Label>
        <NotificationExpanded />
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
    <NotificationScreen />
  </IOSDevice>,
);
