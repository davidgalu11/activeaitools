import { Suspense } from "react"
import { SignInCard } from "@/components/auth/sign-in-card"

export default function SignupPage() {
  return (
    <Suspense>
      <SignInCard mode="signup" />
    </Suspense>
  )
}
