"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import crypto from "crypto"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { generateBadgeCode } from "@/lib/badge"

export async function incrementClicks(toolId: string) {
  await db.tool.update({
    where: { id: toolId },
    data: { clicks: { increment: 1 } },
  })
}

export async function toggleUpvote(toolId: string, isLoggedIn: boolean) {
  if (!isLoggedIn) {
    const tool = await db.tool.findUnique({ where: { id: toolId }, select: { slug: true } })
    redirect(`/login?callbackUrl=/tools/${tool?.slug}`)
  }

  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id

  const existing = await db.upvote.findUnique({
    where: { userId_toolId: { userId, toolId } },
  })

  if (existing) {
    await db.upvote.delete({ where: { id: existing.id } })
    await db.tool.update({ where: { id: toolId }, data: { upvotes: { decrement: 1 } } })
  } else {
    await db.upvote.create({ data: { userId, toolId } })
    await db.tool.update({ where: { id: toolId }, data: { upvotes: { increment: 1 } } })
  }

  revalidatePath(`/tools`)
}

const submitToolSchema = z.object({
  name: z.string().min(1).max(100),
  websiteUrl: z.string().url(),
  tagline: z.string().min(1).max(140),
  description: z.string().min(10),
  pricingModel: z.enum(["FREE", "FREEMIUM", "PAID"]),
  logoUrl: z.string().url().optional().or(z.literal("")),
  screenshotUrl: z.string().url().optional().or(z.literal("")),
  categories: z.array(z.string()).min(1).max(3),
})

export type SubmitToolState = {
  success?: boolean
  error?: string
  toolSlug?: string
  badgeCode?: string
}

export async function submitTool(
  prevState: SubmitToolState,
  formData: FormData
): Promise<SubmitToolState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "You must be signed in to submit a tool." }

  const raw = {
    name: formData.get("name"),
    websiteUrl: formData.get("websiteUrl"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    pricingModel: formData.get("pricingModel"),
    logoUrl: formData.get("logoUrl") || "",
    screenshotUrl: formData.get("screenshotUrl") || "",
    categories: formData.getAll("categories"),
  }

  const parsed = submitToolSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { error: `${firstError.path.join(".")}: ${firstError.message}` }
  }

  const { name, websiteUrl, tagline, description, pricingModel, logoUrl, screenshotUrl, categories } = parsed.data

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const uniqueSlug = `${slug}-${crypto.randomBytes(3).toString("hex")}`
  const badgeCode = generateBadgeCode()

  try {
    const categoryRecords = await db.category.findMany({
      where: { id: { in: categories } },
      select: { id: true },
    })

    const tool = await db.tool.create({
      data: {
        slug: uniqueSlug,
        name,
        websiteUrl,
        tagline,
        description,
        pricingModel: pricingModel as "FREE" | "FREEMIUM" | "PAID",
        logoUrl: logoUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${uniqueSlug}`,
        screenshotUrl: screenshotUrl || null,
        badgeCode,
        submittedById: session.user.id,
        status: "PENDING",
        tier: "FREE",
        categories: {
          create: categoryRecords.map((c) => ({ categoryId: c.id })),
        },
      },
    })

    revalidatePath("/dashboard/my-tools")
    return { success: true, toolSlug: tool.slug, badgeCode }
  } catch (err) {
    if ((err as { code?: string }).code === "P2002") {
      return { error: "A tool with this name already exists." }
    }
    return { error: "Failed to create tool. Please try again." }
  }
}

export async function deleteTool(toolId: string): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const tool = await db.tool.findUnique({
    where: { id: toolId },
    select: { submittedById: true },
  })

  if (!tool || tool.submittedById !== session.user.id) {
    return { error: "Not found or unauthorized" }
  }

  await db.tool.delete({ where: { id: toolId } })
  revalidatePath("/dashboard/my-tools")
  return {}
}
