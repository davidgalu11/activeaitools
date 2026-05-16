import { Suspense } from "react"
import { SignInCard } from "@/components/auth/sign-in-card"

export default function LoginPage() {
  return (
    <Suspense>
      <SignInCard mode="signin" />
    </Suspense>
  )
}
