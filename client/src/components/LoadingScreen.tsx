const PETALS = [0, 72, 144, 216, 288];

export default function LoadingScreen() {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-6">
      {/* Rotating honeysuckle with staggered petal bloom */}
      <svg
        width={72}
        height={72}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin-slow"
        style={{ color: "var(--brand)" }}
      >
        {PETALS.map((angle, i) => (
          <path
            key={angle}
            d="M 50 50 C 43 43 41 21 50 10 C 59 21 57 43 50 50 Z"
            fill="currentColor"
            transform={`rotate(${angle} 50 50)`}
            style={{
              animation: "petalBloom 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.3}s`,
              transformOrigin: "50px 50px",
            }}
          />
        ))}
        <circle cx="50" cy="50" r="6" fill="var(--bg)" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
      </svg>

      <p
        className="text-[10px] font-semibold uppercase tracking-[0.3em]"
        style={{ color: "var(--fg-subtle)" }}
      >
        Loading
        <span style={{ animation: "ellipsis 1.5s steps(4, end) infinite" }}>
          ...
        </span>
      </p>

      <style>{`
        @keyframes petalBloom {
          0%, 100% { opacity: 0.25; transform: scale(0.88); }
          50%       { opacity: 1;    transform: scale(1.08); }
        }
        @keyframes ellipsis {
          0%   { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0% 0 0); }
        }
      `}</style>
    </div>
  );
}
