'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export function AnimatedPage({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{ display: 'contents' }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div variants={item} style={style}>
      {children}
    </motion.div>
  );
}

export function AnimatedButton({
  children,
  onClick,
  style,
  type = 'button',
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201,168,76,0.4)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      style={style}
    >
      {children}
    </motion.button>
  );
}

export function AnimatedLogo({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}
