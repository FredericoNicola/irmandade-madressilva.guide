export default function Logo({
  size = 36,
  className = "",
  bgColor,
}: {
  size?: number;
  className?: string;
  /** Fill for the center hole — defaults to page bg. Pass the section bg color when logo sits on a custom background. */
  bgColor?: string;
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
      {/* Outer badge ring */}
      <circle
        cx="50"
        cy="50"
        r="47.5"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
      />
      {/* Inner badge ring */}
      <circle
        cx="50"
        cy="50"
        r="43"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.35"
      />
      {/* 5 honeysuckle petals rotating from center */}
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={angle}
          d="M 50 50 C 43 43 41 21 50 10 C 59 21 57 43 50 50 Z"
          fill="currentColor"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      {/* Center fill — use bgColor when sitting on a custom section background */}
      <circle cx="50" cy="50" r="6" fill={bgColor ?? "var(--bg)"} />
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </svg>
  );
}
