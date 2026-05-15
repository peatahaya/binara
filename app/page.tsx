"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { PageIntro } from "@/components/landing/page-intro"
import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { SolutionSection } from "@/components/landing/solution-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { CtaSection } from "@/components/landing/cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-2xl" style={{ fontFamily: "var(--font-fraunces)", color: "white" }}>
            binara
          </span>
          <Link
            href="/login"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Zaloguj się
          </Link>
        </div>
      </nav>

      <PageIntro>
        <main>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroSection />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProblemSection />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <SolutionSection />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <HowItWorksSection />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <CtaSection />
          </motion.div>
        </main>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <LandingFooter />
        </motion.div>
      </PageIntro>
    </div>
  )
}
