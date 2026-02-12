"use client";

import React, { useEffect } from "react";

interface ShimmerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  duration?: number;
  spread?: number;
}

// Inject the keyframes once globally
let keyframesInjected = false;

function injectKeyframes() {
  if (keyframesInjected || typeof document === "undefined") return;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes shimmer-diagonal {
      0% {
        background-position: 0% 100%;
      }
      100% {
        background-position: 100% 0%;
      }
    }
  `;
  document.head.appendChild(style);
  keyframesInjected = true;
}

export function Shimmer({
  className,
  as: Component = "span",
  duration = 2,
  spread = 2,
  children,
  style,
  ...props
}: ShimmerProps) {
  useEffect(() => {
    injectKeyframes();
  }, []);

  const dynamicSpread =
    spread + (typeof children === "string" ? children.length * 0.05 : 0);

  const shimmerStyle: React.CSSProperties = {
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    backgroundImage: `linear-gradient(
      -45deg,
      currentColor 0%,
      currentColor ${40 - dynamicSpread}%,
      white ${50 - dynamicSpread / 2}%,
      white ${50 + dynamicSpread / 2}%,
      currentColor ${60 + dynamicSpread}%,
      currentColor 100%
    )`,
    backgroundSize: "300% 300%",
    animation: `shimmer-diagonal ${duration}s linear infinite`,
    ...style,
  };

  return (
    <Component className={className} style={shimmerStyle} {...props}>
      {children}
    </Component>
  );
}

export default Shimmer;
