"use client"

import * as React from "react"
import { useTransition } from "react"
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleUpvote } from "@/lib/actions"

interface UpvoteButtonProps {
  toolId: string
  upvotes: number
  isLoggedIn: boolean
}

export function UpvoteButton({ toolId, upvotes, isLoggedIn }: UpvoteButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [localUpvotes, setLocalUpvotes] = React.useState(upvotes)

  const handleUpvote = () => {
    if (!isLoggedIn) {
      // Will redirect on server
      startTransition(async () => {
        await toggleUpvote(toolId, false)
      })
      return
    }
    setLocalUpvotes((v) => v + 1)
    startTransition(async () => {
      await toggleUpvote(toolId, true)
    })
  }

  return (
    <Button
      variant="outline"
      onClick={handleUpvote}
      disabled={isPending}
      className="gap-2"
    >
      <ArrowUpIcon className="size-4" />
      {localUpvotes}
    </Button>
  )
}
