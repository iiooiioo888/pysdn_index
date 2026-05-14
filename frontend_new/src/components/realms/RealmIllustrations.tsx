import type React from 'react'

/**
 * RealmIllustrations — Inline SVG illustrations for each realm.
 *
 * - 天域 (tianyu): Futuristic data/task flow diagram in cyan
 * - 神域 (shenyu): AI neural network / knowledge graph in violet
 * - 鏡界 (jingjie): Mirror/reflection data processing in emerald
 */

interface RealmIllustrationProps {
  className?: string
  size?: number
}

/** 天域 — Futuristic data/task flow diagram (cyan #06b6d4) */
export function TianyuIllustration({ className = '', size = 64 }: RealmIllustrationProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tianyu-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="tianyu-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Background circuit pattern */}
      <circle cx="32" cy="32" r="28" stroke="url(#tianyu-grad)" strokeWidth="1" opacity="0.15" />
      <circle cx="32" cy="32" r="22" stroke="url(#tianyu-grad)" strokeWidth="0.5" opacity="0.1" />
      {/* Central node */}
      <rect x="26" y="26" width="12" height="12" rx="3" fill="url(#tianyu-grad)" opacity="0.9" filter="url(#tianyu-glow)" />
      {/* Data flow arrows - top */}
      <path d="M32 8 L32 24" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" />
      <circle cx="32" cy="8" r="3" fill="#22d3ee" opacity="0.7" />
      {/* Data flow arrows - right */}
      <path d="M40 32 L56 32" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" />
      <circle cx="56" cy="32" r="3" fill="#22d3ee" opacity="0.7" />
      {/* Data flow arrows - bottom */}
      <path d="M32 40 L32 56" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" />
      <circle cx="32" cy="56" r="3" fill="#22d3ee" opacity="0.7" />
      {/* Data flow arrows - left */}
      <path d="M24 32 L8 32" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" />
      <circle cx="8" cy="32" r="3" fill="#22d3ee" opacity="0.7" />
      {/* Diagonal connectors */}
      <path d="M15 15 L27 27" stroke="#06b6d4" strokeWidth="1" opacity="0.35" strokeDasharray="2 2" />
      <path d="M49 15 L37 27" stroke="#06b6d4" strokeWidth="1" opacity="0.35" strokeDasharray="2 2" />
      <path d="M15 49 L27 37" stroke="#06b6d4" strokeWidth="1" opacity="0.35" strokeDasharray="2 2" />
      <path d="M49 49 L37 37" stroke="#06b6d4" strokeWidth="1" opacity="0.35" strokeDasharray="2 2" />
      {/* Corner task nodes */}
      <rect x="11" y="11" width="8" height="6" rx="2" fill="#06b6d4" opacity="0.45" />
      <rect x="45" y="11" width="8" height="6" rx="2" fill="#06b6d4" opacity="0.45" />
      <rect x="11" y="47" width="8" height="6" rx="2" fill="#06b6d4" opacity="0.45" />
      <rect x="45" y="47" width="8" height="6" rx="2" fill="#06b6d4" opacity="0.45" />
      {/* Pulse animation ring */}
      <circle cx="32" cy="32" r="16" stroke="#22d3ee" strokeWidth="0.8" opacity="0.25">
        <animate attributeName="r" values="16;20;16" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.08;0.25" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

/** 神域 — AI neural network / knowledge graph (violet #8b5cf6) */
export function ShenyuIllustration({ className = '', size = 64 }: RealmIllustrationProps) {
  const nodes = [
    { x: 32, y: 14 },
    { x: 14, y: 28 },
    { x: 50, y: 28 },
    { x: 20, y: 48 },
    { x: 44, y: 48 },
    { x: 32, y: 36 },
  ]
  const edges = [
    [0, 1], [0, 2], [0, 5],
    [1, 3], [1, 5],
    [2, 4], [2, 5],
    [3, 5], [4, 5],
  ]

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="shenyu-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="shenyu-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="shenyu-node-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </radialGradient>
      </defs>
      {/* Background hexagonal grid hint */}
      <circle cx="32" cy="32" r="28" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.08" />
      <circle cx="32" cy="32" r="20" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.06" />
      {/* Edges (connections) */}
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="#8b5cf6"
          strokeWidth="1.2"
          opacity="0.35"
        >
          <animate attributeName="opacity" values="0.35;0.55;0.35" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </line>
      ))}
      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={i === 5 ? 6 : 4.5} fill="url(#shenyu-node-grad)" opacity={i === 5 ? 0.95 : 0.7} filter="url(#shenyu-glow)" />
          {i === 5 && (
            <circle cx={n.x} cy={n.y} r="10" stroke="#c4b5fd" strokeWidth="0.6" opacity="0.2">
              <animate attributeName="r" values="10;14;10" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.05;0.2" dur="4s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}
      {/* Data pulse traveling along edge */}
      <circle r="2" fill="#c4b5fd" opacity="0.8">
        <animateMotion dur="3s" repeatCount="indefinite" path={`M${nodes[0].x},${nodes[0].y} L${nodes[5].x},${nodes[5].y} L${nodes[4].x},${nodes[4].y}`} />
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

/** 鏡界 — Mirror/reflection data processing (emerald #10b981) */
export function JingjieIllustration({ className = '', size = 64 }: RealmIllustrationProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="jingjie-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="jingjie-mirror" x1="32" y1="0" x2="32" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#10b981" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.4" />
        </linearGradient>
        <filter id="jingjie-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="jingjie-clip-left">
          <rect x="0" y="0" width="32" height="64" />
        </clipPath>
        <clipPath id="jingjie-clip-right">
          <rect x="32" y="0" width="32" height="64" />
        </clipPath>
      </defs>
      {/* Mirror line (center) */}
      <line x1="32" y1="6" x2="32" y2="58" stroke="url(#jingjie-mirror)" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Left side - data input */}
      <g clipPath="url(#jingjie-clip-left)">
        <rect x="8" y="12" width="18" height="8" rx="2" fill="#10b981" opacity="0.5" />
        <rect x="12" y="24" width="14" height="6" rx="2" fill="#10b981" opacity="0.35" />
        <rect x="6" y="36" width="20" height="8" rx="2" fill="#10b981" opacity="0.5" />
        <rect x="10" y="48" width="16" height="6" rx="2" fill="#10b981" opacity="0.35" />
        {/* Arrow to mirror */}
        <path d="M28 16 L30 16" stroke="#6ee7b7" strokeWidth="1" opacity="0.5" />
        <path d="M28 40 L30 40" stroke="#6ee7b7" strokeWidth="1" opacity="0.5" />
      </g>
      {/* Right side - reflected output (mirrored) */}
      <g clipPath="url(#jingjie-clip-right)" opacity="0.6">
        <rect x="38" y="12" width="18" height="8" rx="2" fill="#10b981" opacity="0.5" />
        <rect x="38" y="24" width="14" height="6" rx="2" fill="#10b981" opacity="0.35" />
        <rect x="38" y="36" width="20" height="8" rx="2" fill="#10b981" opacity="0.5" />
        <rect x="38" y="48" width="16" height="6" rx="2" fill="#10b981" opacity="0.35" />
      </g>
      {/* Reflection shimmer */}
      <rect x="30" y="8" width="4" height="48" fill="url(#jingjie-mirror)" opacity="0.12" />
      {/* Central processing diamond */}
      <g transform="translate(32,32)" filter="url(#jingjie-glow)">
        <rect x="-6" y="-6" width="12" height="12" rx="2" transform="rotate(45)" fill="url(#jingjie-grad)" opacity="0.85" />
      </g>
      {/* Scan line animation */}
      <line x1="4" y1="32" x2="60" y2="32" stroke="#6ee7b7" strokeWidth="0.6" opacity="0.15">
        <animate attributeName="y1" values="8;56;8" dur="4s" repeatCount="indefinite" />
        <animate attributeName="y2" values="8;56;8" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.3;0.15" dur="4s" repeatCount="indefinite" />
      </line>
    </svg>
  )
}

/** Get illustration component by realm ID */
export function getRealmIllustration(realmId: string): ((props: RealmIllustrationProps) => React.JSX.Element) | null {
  switch (realmId) {
    case 'tianyu': return TianyuIllustration
    case 'shenyu': return ShenyuIllustration
    case 'jingjie': return JingjieIllustration
    default: return null
  }
}
