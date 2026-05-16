import { NextRequest, NextResponse } from "next/server"
import { generateBadgeSvg } from "@/lib/badge"
import { db } from "@/lib/db"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const toolSlug = slug.replace(/\.svg$/, "")

  const tool = await db.tool.findUnique({
    where: { slug: toolSlug },
    select: { name: true },
  })

  const svg = generateBadgeSvg(tool?.name ?? toolSlug)

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
