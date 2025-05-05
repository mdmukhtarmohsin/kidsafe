import { Shield } from "lucide-react"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`bg-primary text-primary-foreground rounded-lg flex items-center justify-center ${className}`}>
      <Shield className="w-full h-full p-1" />
    </div>
  )
}
