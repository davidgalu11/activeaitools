import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCardIcon } from "lucide-react"

export const metadata: Metadata = { title: "Billing" }

const stripeEnabled = !!process.env.STRIPE_SECRET_KEY

export default function BillingPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-8">Billing</h1>

      {stripeEnabled ? (
        <>
          <section className="mb-8">
            <h2 className="font-semibold mb-4">Active subscriptions</h2>
            <div className="rounded-xl border p-6 text-center text-muted-foreground">
              <p className="text-sm">No active subscriptions.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/pricing">View plans</Link>
              </Button>
            </div>
          </section>

          <section>
            <h2 className="font-semibold mb-4">Manage billing</h2>
            <Button variant="outline" className="gap-2">
              <CreditCardIcon className="size-4" />
              Open billing portal
            </Button>
          </section>
        </>
      ) : (
        <div className="rounded-xl border p-8 text-center">
          <Badge variant="secondary" className="mb-4">Coming soon</Badge>
          <h2 className="font-semibold mb-2">Billing not yet configured</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Stripe isn&apos;t set up in this environment. Free tier submissions work without payment.
          </p>
          <Button asChild>
            <Link href="/pricing">View pricing plans</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
