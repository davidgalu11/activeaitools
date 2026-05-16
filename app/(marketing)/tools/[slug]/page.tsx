import * as React from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ShieldCheckIcon, CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ToolCard } from "@/components/tools/tool-card"
import { VisitButton } from "@/components/tools/visit-button"
import { UpvoteButton } from "@/components/tools/upvote-button"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

async function getTool(slug: string) {
  return db.tool.findUnique({
    where: { slug, status: "APPROVED" },
    include: {
      categories: { include: { category: true } },
      submittedBy: { select: { name: true } },
    },
  })
}

async function getSimilarTools(toolId: string, categoryIds: string[]) {
  return db.tool.findMany({
    where: {
      status: "APPROVED",
      id: { not: toolId },
      categories: { some: { categoryId: { in: categoryIds } } },
    },
    take: 4,
    orderBy: { upvotes: "desc" },
    include: { categories: { include: { category: true } } },
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) return {}

  return {
    title: tool.name,
    description: tool.tagline,
    openGraph: {
      title: tool.name,
      description: tool.tagline,
      images: tool.screenshotUrl ? [tool.screenshotUrl] : [],
    },
  }
}

const pricingLabels: Record<string, string> = {
  FREE: "Free",
  FREEMIUM: "Freemium",
  PAID: "Paid",
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [tool, session] = await Promise.all([getTool(slug), auth()])

  if (!tool) notFound()

  const categoryIds = tool.categories.map((c) => c.categoryId)
  const similarTools = await getSimilarTools(tool.id, categoryIds)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Hero block */}
          <div className="flex flex-col sm:flex-row gap-4 items-start mb-8">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border bg-muted">
              <Image
                src={tool.logoUrl ?? `https://api.dicebear.com/7.x/shapes/svg?seed=${tool.slug}`}
                alt={`${tool.name} logo`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{tool.name}</h1>
                {tool.badgeVerified && (
                  <ShieldCheckIcon className="size-5 text-primary" title="Badge verified" />
                )}
                {tool.tier !== "FREE" && (
                  <Badge variant="default" className="text-xs">
                    {tool.tier === "SPONSOR" ? "Sponsor" : "Featured"}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{tool.tagline}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <Badge variant="outline">{pricingLabels[tool.pricingModel]}</Badge>
              </div>
            </div>

            <div className="flex gap-2 sm:ml-auto">
              <VisitButton toolId={tool.id} websiteUrl={tool.websiteUrl} />
              <UpvoteButton
                toolId={tool.id}
                upvotes={tool.upvotes}
                isLoggedIn={!!session?.user}
              />
            </div>
          </div>

          {/* Screenshot */}
          {tool.screenshotUrl && (
            <div className="mb-8 overflow-hidden rounded-xl border">
              <Image
                src={tool.screenshotUrl}
                alt={`${tool.name} screenshot`}
                width={1280}
                height={720}
                className="w-full object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Description */}
          <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">{tool.description}</p>
          </div>

          {/* Similar tools */}
          {similarTools.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Similar tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarTools.map((t) => (
                  <ToolCard key={t.id} tool={t} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-20 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {tool.categories.map(({ category }) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium hover:bg-accent transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Meta */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="size-4" />
                <span>
                  Added{" "}
                  {tool.publishedAt
                    ? new Date(tool.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "recently"}
                </span>
              </div>
              {tool.badgeVerified && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <ShieldCheckIcon className="size-4" />
                  <span>Badge verified</span>
                </div>
              )}
            </div>

            {/* Share */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Share</h3>
              <div className="flex gap-2">
                <a
                  href={`https://x.com/intent/tweet?text=Check out ${tool.name} on ActiveAI Tools&url=${process.env.NEXT_PUBLIC_APP_URL}/tools/${tool.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground border rounded-md px-3 py-1.5 transition-colors"
                >
                  Share on X
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
