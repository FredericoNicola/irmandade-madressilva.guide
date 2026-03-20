export default function Logo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 5 honeysuckle petals rotating from center */}
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={angle}
          d="M 50 50 C 43 43 41 21 50 10 C 59 21 57 43 50 50 Z"
          fill="currentColor"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      {/* Center fill (matches page background to create "hole" effect) */}
      <circle cx="50" cy="50" r="6" style={{ fill: "var(--bg)" }} />
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </svg>
  );
}
