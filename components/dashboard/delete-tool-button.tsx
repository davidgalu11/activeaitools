"use client"

import * as React from "react"
import { useTransition } from "react"
import { Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteTool } from "@/lib/actions"

export function DeleteToolButton({
  toolId,
  toolName,
}: {
  toolId: string
  toolName: string
}) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm(`Delete "${toolName}"? This cannot be undone.`)) return
    startTransition(async () => {
      await deleteTool(toolId)
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="text-muted-foreground hover:text-destructive"
      aria-label={`Delete ${toolName}`}
    >
      <Trash2Icon className="size-4" />
    </Button>
  )
}
