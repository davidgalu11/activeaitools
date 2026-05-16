"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

export function NewsletterForm() {
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    console.log("Newsletter signup:", data.get("email"))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="text-sm text-primary font-medium">
        Thanks! We&apos;ll be in touch.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        name="email"
        placeholder="you@example.com"
        required
        className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      <Button type="submit" size="sm">Subscribe</Button>
    </form>
  )
}
