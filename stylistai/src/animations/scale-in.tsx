"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ScaleIn({
  children,
  delay = 0,
  className,
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
