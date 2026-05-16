import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLinkIcon, ArrowUpIcon, ShieldCheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  tool: {
    id: string
    slug: string
    name: string
    tagline: string
    logoUrl?: string | null
    pricingModel: "FREE" | "FREEMIUM" | "PAID"
    tier: "FREE" | "FEATURED" | "SPONSOR"
    upvotes: number
    badgeVerified: boolean
    categories: { category: { slug: string; name: string } }[]
  }
  featured?: boolean
  className?: string
}

const pricingLabels: Record<string, string> = {
  FREE: "Free",
  FREEMIUM: "Freemium",
  PAID: "Paid",
}

const pricingVariants: Record<string, "outline" | "secondary" | "default"> = {
  FREE: "secondary",
  FREEMIUM: "outline",
  PAID: "outline",
}

export function ToolCard({ tool, featured = false, className }: ToolCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        featured && "ring-1 ring-primary/20 bg-gradient-to-br from-card to-primary/5",
        className
      )}
    >
      {featured && (
        <div className="absolute -top-px left-4">
          <span className="inline-flex items-center rounded-b-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground uppercase tracking-wide">
            Featured
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Logo */}
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
          <Image
            src={tool.logoUrl ?? `https://api.dicebear.com/7.x/shapes/svg?seed=${tool.slug}`}
            alt={`${tool.name} logo`}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href={`/tools/${tool.slug}`}
              className="font-semibold text-sm leading-tight hover:text-primary transition-colors line-clamp-1"
            >
              {tool.name}
            </Link>
            {tool.badgeVerified && (
              <ShieldCheckIcon className="size-3.5 text-primary shrink-0" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {tool.tagline}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={pricingVariants[tool.pricingModel]} className="text-[10px] h-4 px-1.5">
            {pricingLabels[tool.pricingModel]}
          </Badge>
          {tool.categories.slice(0, 2).map(({ category }) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 text-muted-foreground text-xs shrink-0">
          <ArrowUpIcon className="size-3" />
          <span>{tool.upvotes}</span>
        </div>
      </div>
    </div>
  )
}
