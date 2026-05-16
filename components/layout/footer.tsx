import * as React from "react"
import Link from "next/link"
import { ZapIcon } from "lucide-react"
import { db } from "@/lib/db"
import { ThemeToggle } from "@/components/theme-toggle"

async function getTopCategories() {
  try {
    return await db.category.findMany({
      take: 6,
      include: { _count: { select: { tools: true } } },
      orderBy: { tools: { _count: "desc" } },
    })
  } catch {
    return []
  }
}

export async function Footer() {
  const categories = await getTopCategories()

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold mb-3">
              <ZapIcon className="size-5 text-primary" />
              <span>ActiveAI Tools</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover the best AI tools across every category, all in one place.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                X
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Product</h3>
            <ul className="space-y-2">
              {[
                { href: "/tools", label: "Browse" },
                { href: "/categories", label: "Categories" },
                { href: "/dashboard/submit", label: "Submit Tool" },
                { href: "/pricing", label: "Pricing" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                ["AI Chat", "Image Generation", "Writing", "Code", "Productivity", "Design"].map(
                  (name) => (
                    <li key={name}>
                      <span className="text-sm text-muted-foreground">{name}</span>
                    </li>
                  )
                )
              )}
            </ul>
          </div>

          {/* Col 4: Company */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "mailto:hello@activeaitools.com", label: "Contact" },
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ActiveAI Tools. Built with Next.js, Prisma & Tailwind CSS.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}
