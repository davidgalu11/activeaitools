"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  WrenchIcon,
  PlusCircleIcon,
  UserIcon,
  CreditCardIcon,
  ZapIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboardIcon, exact: true },
  { href: "/dashboard/my-tools", label: "My tools", icon: WrenchIcon },
  { href: "/dashboard/submit", label: "Submit new", icon: PlusCircleIcon },
  { href: "/dashboard/account", label: "Account", icon: UserIcon },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCardIcon },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 hidden lg:flex flex-col border-r bg-card min-h-screen">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ZapIcon className="size-4 text-primary" />
          <span className="text-sm">ActiveAI Tools</span>
        </Link>
      </div>
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
