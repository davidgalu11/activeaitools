"use client"

import * as React from "react"
import { useActionState } from "react"
import { CheckCircleIcon, CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { submitTool, type SubmitToolState } from "@/lib/actions"

interface Category {
  id: string
  name: string
}

const PRICING_OPTIONS = [
  { value: "FREE", label: "Free", description: "Free to use" },
  { value: "FREEMIUM", label: "Freemium", description: "Free tier + paid plans" },
  { value: "PAID", label: "Paid", description: "Paid subscription or one-time" },
]

export function SubmitForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState<SubmitToolState, FormData>(submitTool, {})
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
  const [taglineLen, setTaglineLen] = React.useState(0)
  const [badgeCopied, setBadgeCopied] = React.useState(false)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://activeaitools.com"

  const badgeSnippet = state.toolSlug
    ? `<a href="${appUrl}/tools/${state.toolSlug}" target="_blank" rel="noopener">
  <img src="${appUrl}/api/badge/${state.toolSlug}.svg"
       alt="Listed on ActiveAI Tools"
       data-badge-token="${state.badgeCode}"
       width="200" height="54" />
</a>`
    : ""

  const copyBadge = async () => {
    await navigator.clipboard.writeText(badgeSnippet)
    setBadgeCopied(true)
    setTimeout(() => setBadgeCopied(false), 2000)
  }

  if (state.success && state.toolSlug) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <CheckCircleIcon className="size-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Tool submitted!</h2>
        <p className="text-muted-foreground mb-8">
          Your tool is now pending review. In the meantime, install the badge on your site to get
          verified.
        </p>

        <div className="text-left mb-6">
          <h3 className="font-medium mb-2">Embed this badge on your site</h3>
          <div className="relative rounded-lg bg-muted p-4 font-mono text-xs overflow-x-auto">
            <pre className="whitespace-pre-wrap break-all">{badgeSnippet}</pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={copyBadge}
            >
              {badgeCopied ? (
                <CheckCircleIcon className="size-4 text-primary" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Once the badge is live on your site, come back and click &ldquo;Verify&rdquo; in My Tools.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <a href="/dashboard/my-tools">My tools</a>
          </Button>
          <Button asChild>
            <a href="/tools">Browse tools</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Tool name *</Label>
        <Input id="name" name="name" placeholder="e.g. PromptMind AI" required />
      </div>

      {/* Website URL */}
      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Website URL *</Label>
        <Input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          placeholder="https://yourtool.com"
          required
        />
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="tagline">Tagline *</Label>
          <span className={`text-xs ${taglineLen > 140 ? "text-destructive" : "text-muted-foreground"}`}>
            {taglineLen}/140
          </span>
        </div>
        <Input
          id="tagline"
          name="tagline"
          placeholder="One sentence that explains what your tool does"
          maxLength={140}
          onChange={(e) => setTaglineLen(e.target.value.length)}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe what your tool does, who it's for, and what makes it different."
          rows={5}
          required
        />
      </div>

      {/* Pricing model */}
      <div className="space-y-2">
        <Label>Pricing model *</Label>
        <div className="grid grid-cols-3 gap-3">
          {PRICING_OPTIONS.map((opt) => (
            <label key={opt.value} className="cursor-pointer">
              <input
                type="radio"
                name="pricingModel"
                value={opt.value}
                className="sr-only peer"
                required
              />
              <div className="rounded-lg border border-border p-3 text-center peer-checked:border-primary peer-checked:bg-primary/5 transition-colors hover:bg-muted">
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Logo URL */}
      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input
          id="logoUrl"
          name="logoUrl"
          type="url"
          placeholder="https://yourtool.com/logo.png (optional)"
        />
        <p className="text-xs text-muted-foreground">
          If left blank, we&apos;ll use your favicon. PNG or SVG, square preferred.
        </p>
      </div>

      {/* Screenshot URL */}
      <div className="space-y-2">
        <Label htmlFor="screenshotUrl">Screenshot URL</Label>
        <Input
          id="screenshotUrl"
          name="screenshotUrl"
          type="url"
          placeholder="https://yourtool.com/screenshot.png (optional)"
        />
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label>Categories * (pick 1–3)</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.id)
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setSelectedCategories((prev) => prev.filter((id) => id !== cat.id))
                  } else if (selectedCategories.length < 3) {
                    setSelectedCategories((prev) => [...prev, cat.id])
                  }
                }}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>
        {selectedCategories.map((id) => (
          <input key={id} type="hidden" name="categories" value={id} />
        ))}
        {selectedCategories.length === 0 && (
          <p className="text-xs text-muted-foreground">Select at least one category.</p>
        )}
      </div>

      {/* Tier notice */}
      <div className="rounded-lg bg-muted/50 border p-4">
        <div className="flex items-start gap-3">
          <Badge variant="secondary">Free tier</Badge>
          <div className="text-sm text-muted-foreground">
            This submission is for a <strong>free standard listing</strong>.
            Want featured placement?{" "}
            <a href="/pricing" className="text-primary hover:underline">
              See pricing
            </a>.
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={pending || selectedCategories.length === 0}
      >
        {pending ? "Submitting…" : "Submit tool for review"}
      </Button>
    </form>
  )
}
