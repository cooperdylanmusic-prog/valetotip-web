'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export function AnimatedTipPage({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'contents' }}>
      {children}
    </motion.div>
  );
}

export function TipItem({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div variants={item} style={style}>
      {children}
    </motion.div>
  );
}

export function PulsingQR({ src }: { src: string }) {
  return (
    <motion.img
      src={src}
      alt="QR code"
      animate={{ boxShadow: ['0 0 12px rgba(201,168,76,0.3)', '0 0 28px rgba(201,168,76,0.65)', '0 0 12px rgba(201,168,76,0.3)'] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: '200px', height: '200px', borderRadius: '12px', border: '3px solid rgba(201,168,76,0.4)' }}
    />
  );
}
