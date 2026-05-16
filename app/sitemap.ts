import type { MetadataRoute } from "next"
import { db } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://activeaitools.com"

  const [tools, categories] = await Promise.all([
    db.tool.findMany({
      where: { status: "APPROVED" },
      select: { slug: true, updatedAt: true },
    }),
    db.category.findMany({ select: { slug: true } }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${appUrl}/tools`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${appUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${appUrl}/pricing`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${appUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
  ]

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${appUrl}/tools/${tool.slug}`,
    lastModified: tool.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${appUrl}/categories/${cat.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...toolRoutes, ...categoryRoutes]
}
