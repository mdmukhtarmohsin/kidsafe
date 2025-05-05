import { SignupForm } from "@/components/auth/signup-form"
import { Logo } from "@/components/logo"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <Logo className="h-12 w-12" />
          <h1 className="text-2xl font-bold">KidSafe</h1>
          <p className="text-muted-foreground">Create your parent account</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
