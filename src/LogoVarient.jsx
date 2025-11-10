function LogoVariant1({ width = 120, height = 120, primary = "#10B981" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Chat logo"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0" stopColor={primary} stopOpacity="1"/>
          <stop offset="1" stopColor="#047857" stopOpacity="1"/>
        </linearGradient>
      </defs>

      <path fill="none" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        d="M8 28c0-11 9-20 20-20s20 9 20 20-9 20-20 20c-1.7 0-3.3-.17-4.8-.5L10 54l3.4-9.8C8.6 41.2 8 34.9 8 28z"/>
      {/* nodes */}
      <circle cx="26" cy="22" r="3.2" fill={primary}/>
      <circle cx="38" cy="32" r="3.2" fill="#fff" stroke={primary} strokeWidth="1.2"/>
      <circle cx="30" cy="38" r="3.2" fill={primary}/>
      {/* connections */}
      <path d="M28 24 L36 30" stroke={primary} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M31 35 L33 33" stroke={primary} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export default LogoVariant1