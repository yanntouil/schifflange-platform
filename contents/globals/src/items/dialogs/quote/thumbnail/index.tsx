import React from "react"

export const Thumbnail: React.FC = () => {
  return (
    <svg viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      {/* Background */}
      <rect width="180" height="120" fill="#F7F8FA" />

      {/* Document icon */}
      <rect x="65" y="25" width="50" height="60" rx="4" fill="white" stroke="#E1E4E8" strokeWidth="1" />

      {/* Text lines in document */}
      <rect x="73" y="35" width="34" height="3" rx="1" fill="#959DA5" />
      <rect x="73" y="42" width="30" height="2" rx="1" fill="#C9CED3" />
      <rect x="73" y="47" width="32" height="2" rx="1" fill="#C9CED3" />
      <rect x="73" y="52" width="28" height="2" rx="1" fill="#C9CED3" />

      {/* List dots */}
      <circle cx="75" cy="60" r="1" fill="#959DA5" />
      <rect x="79" y="59" width="24" height="2" rx="1" fill="#C9CED3" />
      <circle cx="75" cy="65" r="1" fill="#959DA5" />
      <rect x="79" y="64" width="20" height="2" rx="1" fill="#C9CED3" />

      {/* More text */}
      <rect x="73" y="71" width="32" height="2" rx="1" fill="#C9CED3" />
      <rect x="73" y="76" width="26" height="2" rx="1" fill="#C9CED3" />

      {/* Label */}
      <text
        x="90"
        y="100"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="10"
        fontWeight="500"
        textAnchor="middle"
        fill="#6B7280"
      >
        Rich Text
      </text>
    </svg>
  )
}