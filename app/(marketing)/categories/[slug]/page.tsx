import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ToolCard } from "@/components/tools/tool-card"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 24

async function getCategory(slug: string) {
  return db.category.findUnique({ where: { slug } })
}

async function getCategoryTools(categoryId: string, sort = "recent", page = 1) {
  const skip = (page - 1) * PAGE_SIZE
  const orderBy =
    sort === "popular"
      ? { upvotes: "desc" as const }
      : sort === "az"
        ? { name: "asc" as const }
        : { publishedAt: "desc" as const }

  const where = {
    status: "APPROVED" as const,
    categories: { some: { categoryId } },
  }

  const [featured, tools, total] = await Promise.all([
    db.tool.findMany({
      where: { ...where, tier: { in: ["FEATURED", "SPONSOR"] } },
      take: 4,
      orderBy: { tier: "desc" },
      include: { categories: { include: { category: true } } },
    }),
    db.tool.findMany({
      where,
      take: PAGE_SIZE,
      skip,
      orderBy,
      include: { categories: { include: { category: true } } },
    }),
    db.tool.count({ where }),
  ])

  return { featured, tools, total, totalPages: Math.ceil(total / PAGE_SIZE) }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return {}
  return {
    title: `${category.name} AI Tools`,
    description: category.description ?? `Discover the best ${category.name} AI tools.`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; page?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const category = await getCategory(slug)
  if (!category) notFound()

  const page = Math.max(1, parseInt(sp.page ?? "1"))
  const sort = sp.sort ?? "recent"

  const { featured, tools, total, totalPages } = await getCategoryTools(category.id, sort, page)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        {category.icon && <div className="text-4xl mb-3">{category.icon}</div>}
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">{total} approved tools</p>
      </div>

      {/* Featured tools in this category */}
      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Featured</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((tool) => (
              <ToolCard key={tool.id} tool={tool} featured />
            ))}
          </div>
        </section>
      )}

      {/* Sort */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-muted-foreground">Sort:</span>
        {[
          { value: "recent", label: "Recent" },
          { value: "popular", label: "Popular" },
          { value: "az", label: "A–Z" },
        ].map((opt) => (
          <Link
            key={opt.value}
            href={`/categories/${slug}?sort=${opt.value}`}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${
              sort === opt.value
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-muted"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {tools.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {page > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/categories/${slug}?sort=${sort}&page=${page - 1}`}>Previous</Link>
                </Button>
              )}
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/categories/${slug}?sort=${sort}&page=${page + 1}`}>Next</Link>
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>No tools in this category yet.</p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/submit">Submit the first one</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
