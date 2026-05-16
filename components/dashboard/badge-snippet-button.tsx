"use client"

import * as React from "react"
import { CodeIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://activeaitools.com"

export function BadgeSnippetButton({
  toolSlug,
  badgeCode,
}: {
  toolSlug: string
  badgeCode: string
}) {
  const [copied, setCopied] = React.useState(false)

  const snippet = `<a href="${appUrl}/tools/${toolSlug}" target="_blank" rel="noopener">
  <img src="${appUrl}/api/badge/${toolSlug}.svg"
       alt="Listed on ActiveAI Tools"
       data-badge-token="${badgeCode}"
       width="200" height="54" />
</a>`

  const copy = async () => {
    await navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={copy}
      className="text-muted-foreground"
      aria-label="Copy badge snippet"
    >
      {copied ? <CheckIcon className="size-4 text-primary" /> : <CodeIcon className="size-4" />}
    </Button>
  )
}
