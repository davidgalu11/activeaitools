"use client"

import * as React from "react"
import { useTransition } from "react"
import { ExternalLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { incrementClicks } from "@/lib/actions"

interface VisitButtonProps {
  toolId: string
  websiteUrl: string
}

export function VisitButton({ toolId, websiteUrl }: VisitButtonProps) {
  const [, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      await incrementClicks(toolId)
    })
    window.open(websiteUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <Button onClick={handleClick} className="gap-2">
      Visit site
      <ExternalLinkIcon className="size-4" />
    </Button>
  )
}
