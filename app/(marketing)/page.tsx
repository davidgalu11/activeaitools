import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  ZapIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolCard } from "@/components/tools/tool-card"
import { NewsletterForm } from "@/components/landing/newsletter-form"
import { db } from "@/lib/db"

async function getLandingData() {
  try {
    const [featuredTools, recentTools, categories, topThisWeek] = await Promise.all([
      db.tool.findMany({
        where: { status: "APPROVED", tier: { in: ["FEATURED", "SPONSOR"] } },
        take: 8,
        orderBy: { tier: "desc" },
        include: { categories: { include: { category: true } } },
      }),
      db.tool.findMany({
        where: { status: "APPROVED" },
        take: 12,
        orderBy: { publishedAt: "desc" },
        include: { categories: { include: { category: true } } },
      }),
      db.category.findMany({
        take: 12,
        include: { _count: { select: { tools: { where: { tool: { status: "APPROVED" } } } } } },
        orderBy: { tools: { _count: "desc" } },
      }),
      db.tool.findMany({
        where: {
          status: "APPROVED",
          publishedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        take: 8,
        orderBy: { upvotes: "desc" },
        include: { categories: { include: { category: true } } },
      }),
    ])
    return { featuredTools, recentTools, categories, topThisWeek }
  } catch {
    return { featuredTools: [], recentTools: [], categories: [], topThisWeek: [] }
  }
}

export default async function HomePage() {
  const { featuredTools, recentTools, categories, topThisWeek } = await getLandingData()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
            <SparklesIcon className="size-3 text-primary" />
            The AI tools directory
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
            Discover the best{" "}
            <span className="text-primary">AI tools</span>{" "}
            for every use case
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Browse hundreds of AI tools across every category — from writing and coding to
            image generation and automation. Find the right tool, faster.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/dashboard/submit">
                Submit your tool
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/tools">Browse all tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featuredTools.length > 0 && (
        <section className="py-14 border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <SparklesIcon className="size-5 text-primary" />
                <h2 className="text-xl font-semibold">Featured tools</h2>
              </div>
              <Link href="/tools?tier=featured" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                See all <ArrowRightIcon className="size-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category strip */}
      {categories.length > 0 && (
        <section className="py-10 border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-base font-medium text-muted-foreground mb-4">Browse by category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium hover:bg-accent hover:border-primary/30 transition-colors"
                >
                  {cat.icon && <span>{cat.icon}</span>}
                  {cat.name}
                  <span className="text-muted-foreground text-xs">
                    {cat._count.tools}
                  </span>
                </Link>
              ))}
              <Link
                href="/categories"
                className="inline-flex items-center gap-1 rounded-full border border-dashed bg-card px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                All categories <ArrowRightIcon className="size-3" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recently added */}
      <section className="py-14 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <ZapIcon className="size-5 text-primary" />
              <h2 className="text-xl font-semibold">Recently added</h2>
            </div>
            <Link href="/tools?sort=recent" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              See all <ArrowRightIcon className="size-3" />
            </Link>
          </div>
          {recentTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>No tools yet. <Link href="/dashboard/submit" className="text-primary hover:underline">Submit the first one!</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* Top this week */}
      {topThisWeek.length > 0 && (
        <section className="py-14 border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUpIcon className="size-5 text-primary" />
              <h2 className="text-xl font-semibold">Top this week</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topThisWeek.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About teaser */}
      <section className="py-14 border-b">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Why ActiveAI Tools?</h2>
          <p className="text-muted-foreground leading-relaxed">
            We curate and verify AI tools so you don&apos;t have to sift through the noise.
            Every listing is reviewed by our team. Free to submit, featured placement available.
            Whether you&apos;re building a tech stack or just exploring what AI can do,
            this is your starting point.
          </p>
          <Button variant="outline" className="mt-6" asChild>
            <Link href="/about">Learn more</Link>
          </Button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 border-b bg-muted/30">
        <div className="mx-auto max-w-md px-4 sm:px-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Stay in the loop</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Get weekly picks of the best new AI tools, straight to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            List your AI tool today
          </h2>
          <p className="text-primary-foreground/80 mb-8 leading-relaxed">
            Reach thousands of AI enthusiasts and early adopters. Standard listings are free.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
          >
            <Link href="/dashboard/submit">
              Submit your tool
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
