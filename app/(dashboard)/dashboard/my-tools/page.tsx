import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteToolButton } from "@/components/dashboard/delete-tool-button"
import { BadgeSnippetButton } from "@/components/dashboard/badge-snippet-button"
import { PlusCircleIcon, ShieldCheckIcon } from "lucide-react"

export const metadata: Metadata = { title: "My Tools" }

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  APPROVED: "default",
  PENDING: "secondary",
  REJECTED: "destructive",
}

const statusLabels: Record<string, string> = {
  APPROVED: "Approved",
  PENDING: "Pending",
  REJECTED: "Rejected",
}

export default async function MyToolsPage() {
  const session = await auth()
  const userId = session!.user!.id!

  const tools = await db.tool.findMany({
    where: { submittedById: userId },
    orderBy: { createdAt: "desc" },
    include: { categories: { include: { category: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My tools</h1>
        <Button asChild>
          <Link href="/dashboard/submit">
            <PlusCircleIcon className="size-4" />
            Submit new
          </Link>
        </Button>
      </div>

      {tools.length === 0 ? (
        <div className="rounded-xl border p-12 text-center">
          <p className="text-muted-foreground mb-4">You haven&apos;t submitted any tools yet.</p>
          <Button asChild>
            <Link href="/dashboard/submit">Submit your first tool</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Upvotes</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell>
                    <div>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {tool.name}
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-1">{tool.tagline}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[tool.status]}>
                      {statusLabels[tool.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm capitalize">{tool.tier.toLowerCase()}</span>
                  </TableCell>
                  <TableCell>{tool.views}</TableCell>
                  <TableCell>{tool.upvotes}</TableCell>
                  <TableCell>
                    {tool.badgeVerified ? (
                      <ShieldCheckIcon className="size-4 text-primary" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Not verified</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <BadgeSnippetButton
                        toolSlug={tool.slug}
                        badgeCode={tool.badgeCode}
                      />
                      <DeleteToolButton toolId={tool.id} toolName={tool.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
