import * as React from "react"
import type { Metadata } from "next"
import { db } from "@/lib/db"
import { SubmitForm } from "@/components/submission/submit-form"

export const metadata: Metadata = { title: "Submit a Tool" }

export default async function SubmitPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Submit your AI tool</h1>
        <p className="text-muted-foreground mt-1">
          Free listings are reviewed within 2–3 business days.
        </p>
      </div>
      <SubmitForm categories={categories} />
    </div>
  )
}
