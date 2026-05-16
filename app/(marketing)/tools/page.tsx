import * as React from "react"
import type { Metadata } from "next"
import { db } from "@/lib/db"
import { ToolCard } from "@/components/tools/tool-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FilterIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Browse AI Tools",
  description: "Explore hundreds of AI tools across every category.",
}

interface SearchParams {
  category?: string
  pricing?: string
  sort?: string
  page?: string
  tier?: string
}

const PAGE_SIZE = 24

async function getTools(params: SearchParams) {
  const page = Math.max(1, parseInt(params.page ?? "1"))
  const skip = (page - 1) * PAGE_SIZE

  const categoryFilter = params.category ? params.category.split(",") : undefined
  const pricingFilter = params.pricing
    ? (params.pricing.toUpperCase().split(",") as ("FREE" | "FREEMIUM" | "PAID")[])
    : undefined
  const tierFilter = params.tier
    ? (params.tier.toUpperCase().split(",") as ("FREE" | "FEATURED" | "SPONSOR")[])
    : undefined

  const orderBy =
    params.sort === "popular"
      ? { upvotes: "desc" as const }
      : params.sort === "az"
        ? { name: "asc" as const }
        : { publishedAt: "desc" as const }

  const where = {
    status: "APPROVED" as const,
    ...(categoryFilter && {
      categories: { some: { category: { slug: { in: categoryFilter } } } },
    }),
    ...(pricingFilter && { pricingModel: { in: pricingFilter } }),
    ...(tierFilter && { tier: { in: tierFilter } }),
  }

  const [tools, total, categories] = await Promise.all([
    db.tool.findMany({
      where,
      take: PAGE_SIZE,
      skip,
      orderBy,
      include: { categories: { include: { category: true } } },
    }),
    db.tool.count({ where }),
    db.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { tools: { where: { tool: { status: "APPROVED" } } } } } },
    }),
  ])

  return { tools, total, categories, page, totalPages: Math.ceil(total / PAGE_SIZE) }
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { tools, total, categories, page, totalPages } = await getTools(params)

  const selectedCategories = params.category?.split(",").filter(Boolean) ?? []
  const selectedPricing = params.pricing?.split(",").filter(Boolean) ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-56 shrink-0">
          <div className="sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <FilterIcon className="size-4 text-muted-foreground" />
              <h2 className="font-medium">Filters</h2>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sort</h3>
              <div className="space-y-1">
                {[
                  { value: "recent", label: "Most recent" },
                  { value: "popular", label: "Most popular" },
                  { value: "az", label: "A–Z" },
                ].map((opt) => (
                  <Link
                    key={opt.value}
                    href={`/tools?${new URLSearchParams({ ...params, sort: opt.value }).toString()}`}
                    className={`block text-sm px-2 py-1 rounded-md transition-colors ${
                      (params.sort ?? "recent") === opt.value
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Pricing</h3>
              <div className="space-y-2">
                {[
                  { value: "free", label: "Free" },
                  { value: "freemium", label: "Freemium" },
                  { value: "paid", label: "Paid" },
                ].map((opt) => {
                  const isSelected = selectedPricing.includes(opt.value)
                  const newPricing = isSelected
                    ? selectedPricing.filter((p) => p !== opt.value)
                    : [...selectedPricing, opt.value]
                  return (
                    <Link
                      key={opt.value}
                      href={`/tools?${new URLSearchParams({ ...params, pricing: newPricing.join(","), page: "1" }).toString()}`}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className={`size-4 rounded border flex items-center justify-center ${isSelected ? "bg-primary border-primary" : "border-input"}`}>
                        {isSelected && <span className="text-primary-foreground text-[10px]">✓</span>}
                      </div>
                      <span className={isSelected ? "font-medium" : "text-muted-foreground"}>{opt.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Categories</h3>
              <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.slug)
                  const newCats = isSelected
                    ? selectedCategories.filter((c) => c !== cat.slug)
                    : [...selectedCategories, cat.slug]
                  return (
                    <Link
                      key={cat.id}
                      href={`/tools?${new URLSearchParams({ ...params, category: newCats.join(","), page: "1" }).toString()}`}
                      className="flex items-center justify-between text-sm px-2 py-0.5 rounded-md hover:bg-muted transition-colors"
                    >
                      <span className={isSelected ? "font-medium text-foreground" : "text-muted-foreground"}>
                        {cat.name}
                      </span>
                      <span className="text-muted-foreground text-xs">{cat._count.tools}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {total} tool{total !== 1 ? "s" : ""} found
            </p>
            {(selectedCategories.length > 0 || selectedPricing.length > 0) && (
              <Link href="/tools" className="text-sm text-primary hover:underline">
                Clear filters
              </Link>
            )}
          </div>

          {tools.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    featured={tool.tier !== "FREE"}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/tools?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}>
                        Previous
                      </Link>
                    </Button>
                  )}
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/tools?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}>
                        Next
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No tools match your filters.</p>
              <Button variant="outline" asChild>
                <Link href="/tools">Clear filters</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
