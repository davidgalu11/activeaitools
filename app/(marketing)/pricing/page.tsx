import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { CheckIcon, ZapIcon, StarIcon, RocketIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for listing your AI tool.",
}

const tiers = [
  {
    name: "Free",
    price: "$0",
    icon: ZapIcon,
    description: "Standard listing after editorial review",
    cta: "Submit free",
    href: "/dashboard/submit",
    featured: false,
    features: [
      "Standard listing in /tools and category pages",
      "Visible to all visitors",
      "Upvotes from the community",
      "Embeddable badge",
      "Basic analytics",
    ],
  },
  {
    name: "Featured",
    price: "$49",
    priceNote: "one-time",
    icon: StarIcon,
    description: "Get noticed with prominent placement",
    cta: "Get featured",
    href: "/dashboard/submit",
    featured: true,
    features: [
      "Everything in Free",
      "Featured grid on homepage",
      "Featured placement in category pages",
      "30 days of featured visibility",
      "Verified badge",
      "Priority review",
    ],
  },
  {
    name: "Sponsor",
    price: "$199",
    priceNote: "/month",
    icon: RocketIcon,
    description: "Maximum exposure across the directory",
    cta: "Become a sponsor",
    href: "/dashboard/submit",
    featured: false,
    features: [
      "Everything in Featured",
      "Top placement in all relevant categories",
      "Homepage hero rotation",
      "Monthly newsletter mention",
      "Analytics dashboard",
      "Dedicated support",
    ],
  },
]

const faqs = [
  {
    q: "How long does editorial review take?",
    a: "Free listings are typically reviewed within 2–3 business days. Featured and Sponsor submissions are prioritized and reviewed within 24 hours.",
  },
  {
    q: "What counts as an AI tool?",
    a: "Any software product that uses AI/ML as a core part of its functionality. This includes chatbots, image generators, code assistants, automation tools, and more.",
  },
  {
    q: "Can I upgrade from Free to Featured later?",
    a: "Yes. You can upgrade any approved listing from your dashboard at any time by clicking 'Upgrade' on the tool.",
  },
  {
    q: "Do Featured listings auto-renew?",
    a: "No. Featured is a one-time payment for 30 days of featured placement. After 30 days, your tool remains in the directory as a standard listing.",
  },
  {
    q: "What is the Sponsor newsletter mention?",
    a: "Sponsor tools are featured in our weekly email digest, which goes to thousands of subscribers interested in AI tools.",
  },
]

export default function PricingPage() {
  const stripeEnabled = !!process.env.STRIPE_SECRET_KEY

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Submit your AI tool for free. Upgrade for featured placement and more visibility.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {tiers.map((tier) => {
          const Icon = tier.icon
          const isDisabled = !stripeEnabled && tier.name !== "Free"

          return (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                tier.featured
                  ? "border-primary shadow-lg ring-1 ring-primary"
                  : "border-border"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-b-md bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="size-5 text-primary" />
                  <h2 className="text-lg font-semibold">{tier.name}</h2>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.priceNote && (
                    <span className="text-muted-foreground text-sm">{tier.priceNote}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckIcon className="size-4 text-primary mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {isDisabled ? (
                <Button variant="outline" disabled className="w-full">
                  Coming soon
                </Button>
              ) : (
                <Button
                  variant={tier.featured ? "default" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b pb-6">
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Ready to list your tool?</p>
          <Button size="lg" asChild>
            <Link href="/dashboard/submit">Submit your AI tool</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
