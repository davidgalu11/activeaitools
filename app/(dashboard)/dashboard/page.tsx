import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  EyeIcon,
  ArrowUpIcon,
  ShieldCheckIcon,
  PlusCircleIcon,
} from "lucide-react"

export const metadata: Metadata = { title: "Dashboard" }

async function getUserStats(userId: string) {
  const tools = await db.tool.findMany({
    where: { submittedById: userId },
    select: { views: true, upvotes: true, badgeVerified: true, status: true },
  })

  return {
    totalViews: tools.reduce((s, t) => s + t.views, 0),
    totalUpvotes: tools.reduce((s, t) => s + t.upvotes, 0),
    badgeVerified: tools.some((t) => t.badgeVerified),
    totalTools: tools.length,
    approvedTools: tools.filter((t) => t.status === "APPROVED").length,
  }
}

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user!.id!
  const stats = await getUserStats(userId)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, {session?.user?.name?.split(" ")[0]}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/submit">
            <PlusCircleIcon className="size-4" />
            Submit new tool
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <EyeIcon className="size-4" />
              Total views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowUpIcon className="size-4" />
              Total upvotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUpvotes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tools submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTools}</div>
            <p className="text-xs text-muted-foreground">
              {stats.approvedTools} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShieldCheckIcon className="size-4" />
              Badge verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.badgeVerified ? (
                <Badge variant="default">Verified</Badge>
              ) : (
                <Badge variant="outline">Not yet</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/submit">Submit a tool</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/my-tools">View my tools</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/account">Edit account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
