'use client';

import { cn } from '@/lib/utils';

const SHIMMER_STYLES = `
.shimmer {
  -webkit-mask-image: linear-gradient(
    -75deg,
    #000 30%,
    rgba(0, 0, 0, 0.15) 50%,
    #000 70%
  );
  -webkit-mask-size: 200%;
  animation: shimmer 5s infinite;
}

@keyframes shimmer {
  from {
    -webkit-mask-position: 150%;
  }
  to {
    -webkit-mask-position: -50%;
  }
}
`;

export interface ShimmerProps {
  children: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

export function Shimmer({
  children,
  as: Component = 'p',
  className,
}: ShimmerProps) {
  return (
    <>
      <style>{SHIMMER_STYLES}</style>
      <Component className={cn('shimmer', className)}>{children}</Component>
    </>
  );
}
