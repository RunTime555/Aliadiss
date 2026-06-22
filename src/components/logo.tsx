import React from "react";

export function AliAddissLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shopping cart orange */}
      <path
        d="M15 20 L20 20 L32 58 L72 58 L80 30 L28 30"
        stroke="#F57C00"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Cart wheels */}
      <circle cx="40" cy="70" r="6" fill="#F57C00" />
      <circle cx="65" cy="70" r="6" fill="#F57C00" />
      {/* Letter A (black triangle shape) */}
      <path
        d="M38 55 L52 22 L66 55 L60 55 L52 35 L44 55 Z"
        fill="#1A1A1A"
      />
      <rect x="43" y="44" width="18" height="6" fill="#1A1A1A" />
    </svg>
  );
}

export function LogoFull({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <AliAddissLogo size={36} />
      <div>
        <div
          className="font-bold text-[17px] leading-tight"
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            color: dark ? "#FFFFFF" : "#1A1A1A",
          }}
        >
          AliAddiss
        </div>
        <div
          className="text-[10px] font-medium leading-tight tracking-wide"
          style={{ color: dark ? "rgba(255,255,255,0.55)" : "#9B9B9B" }}
        >
          Verified Tech Marketplace
        </div>
      </div>
    </div>
  );
}
