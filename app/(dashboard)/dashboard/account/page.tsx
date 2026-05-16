import * as React from "react"
import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = { title: "Account" }

export default async function AccountPage() {
  const session = await auth()
  const user = session!.user!

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-8">Account</h1>

      {/* Profile */}
      <section className="mb-8">
        <h2 className="font-semibold mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="size-16">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
            <AvatarFallback className="text-lg">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" defaultValue={user.name ?? ""} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user.email ?? ""} disabled readOnly className="opacity-60" />
            <p className="text-xs text-muted-foreground">Email comes from your Google account and cannot be changed here.</p>
          </div>
          <Button>Save changes</Button>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Connected accounts */}
      <section className="mb-8">
        <h2 className="font-semibold mb-4">Connected accounts</h2>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-medium">Google</span>
          </div>
          <span className="text-xs text-muted-foreground">Connected</span>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Danger zone */}
      <section>
        <h2 className="font-semibold text-destructive mb-4">Danger zone</h2>
        <div className="rounded-lg border border-destructive/30 p-4">
          <p className="text-sm text-muted-foreground mb-4">
            Deleting your account will anonymize your data and remove your profile. Your tool listings will be unassigned.
          </p>
          <Button variant="destructive" size="sm">Delete account</Button>
        </div>
      </section>
    </div>
  )
}
