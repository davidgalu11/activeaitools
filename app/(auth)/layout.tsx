import Link from "next/link"
import { ZapIcon } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <Link href="/" className="flex items-center gap-2 font-semibold mb-8">
        <ZapIcon className="size-5 text-primary" />
        <span className="text-lg">ActiveAI Tools</span>
      </Link>
      {children}
      <p className="mt-6 text-xs text-muted-foreground text-center max-w-xs">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">Terms</Link>
        {" "}and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
      </p>
    </div>
  )
}
