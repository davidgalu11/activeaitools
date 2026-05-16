import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about ActiveAI Tools and our mission.",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-6">About ActiveAI Tools</h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          ActiveAI Tools is a curated directory of artificial intelligence software. Our mission is
          simple: help people find the right AI tool for any job, faster.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The AI landscape moves quickly. New tools appear daily, categories blur, and it can be
          overwhelming to keep up. We review every submission, maintain clear categories, and surface
          the tools that are actually worth your time.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-10">
          If you&apos;ve built an AI tool, we&apos;d love to feature it. Standard listings are free.
          Featured and sponsor placements are available for teams that want more visibility.
        </p>
      </div>
      <Button size="lg" asChild>
        <Link href="/dashboard/submit">Submit your AI tool</Link>
      </Button>
    </div>
  )
}
