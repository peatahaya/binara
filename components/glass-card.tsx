"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  className?: string
  children: React.ReactNode
  clickable?: boolean
  delay?: number
}

export function GlassCard({ className, children, clickable, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={clickable ? { scale: 1.02, y: -2 } : { y: -2 }}
      className={cn(
        "card-premium p-6",
        className
      )}
    >
      {children}
    </motion.div>
  )
}
