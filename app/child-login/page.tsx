import { ChildLoginForm } from "@/components/auth/child-login-form"
import { Logo } from "@/components/logo"

export default function ChildLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <Logo className="h-12 w-12" />
          <h1 className="text-2xl font-bold">KidSafe</h1>
          <p className="text-muted-foreground">Child Login</p>
        </div>
        <ChildLoginForm />
      </div>
    </div>
  )
}
