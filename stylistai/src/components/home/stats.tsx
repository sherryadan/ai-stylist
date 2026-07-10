"use client";

import { useEffect, useState, useRef } from "react";
import FadeIn from "@/animations/fade-in";

function AnimatedStat({
  target,
  suffix,
  prefix = "",
  label,
  display,
}: {
  target: number;
  suffix: string;
  prefix?: string;
  label: string;
  display?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl sm:text-5xl font-bold gradient-text">
        {display || `${prefix}${count}${suffix}`}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-12 md:py-20 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <AnimatedStat target={10} suffix="K+" label="Outfits Styled" />
            <AnimatedStat target={50} suffix="+" label="Brand Partners" />
            <AnimatedStat target={95} suffix="%" label="Accuracy" />
            <AnimatedStat target={49} suffix="" label="User Rating" display="4.9/5" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
