import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const MAX_ATTEMPTS = 10

const attemptCache = new Map<string, { count: number; windowStart: number }>()

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body?.toolId) {
    return NextResponse.json({ error: "toolId required" }, { status: 400 })
  }

  const { toolId } = body

  // Rate limit per tool
  const now = Date.now()
  const existing = attemptCache.get(toolId)
  if (existing) {
    if (now - existing.windowStart < RATE_LIMIT_WINDOW_MS) {
      if (existing.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Try again later." },
          { status: 429 }
        )
      }
      existing.count++
    } else {
      attemptCache.set(toolId, { count: 1, windowStart: now })
    }
  } else {
    attemptCache.set(toolId, { count: 1, windowStart: now })
  }

  const tool = await db.tool.findUnique({
    where: { id: toolId, submittedById: session.user.id },
    select: { id: true, websiteUrl: true, badgeCode: true, slug: true },
  })

  if (!tool) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(tool.websiteUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "ActiveAITools-BadgeVerifier/1.0" },
    })
    clearTimeout(timeoutId)

    const text = await response.text().then((t) => t.slice(0, 2 * 1024 * 1024))

    const found = text.includes(`data-badge-token="${tool.badgeCode}"`)

    if (found) {
      await db.tool.update({
        where: { id: tool.id },
        data: { badgeVerified: true },
      })
      return NextResponse.json({ verified: true })
    } else {
      return NextResponse.json({
        verified: false,
        reason: "Badge snippet not found on the page",
      })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({
      verified: false,
      reason: `Could not fetch your site: ${message}`,
    })
  }
}
