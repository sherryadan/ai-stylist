"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export default function StaggerItem({
  children,
  className,
}: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
