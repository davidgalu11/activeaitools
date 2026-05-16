import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "AI Tool Categories",
  description: "Browse AI tools by category.",
}

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { tools: { where: { tool: { status: "APPROVED" } } } },
      },
    },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">Browse AI tools organized by category.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col items-start rounded-xl border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all hover:-translate-y-0.5"
          >
            {cat.icon && (
              <span className="text-2xl mb-3">{cat.icon}</span>
            )}
            <h2 className="font-semibold text-sm group-hover:text-primary transition-colors">
              {cat.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {cat._count.tools} tool{cat._count.tools !== 1 ? "s" : ""}
            </p>
            {cat.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{cat.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
