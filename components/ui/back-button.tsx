import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  href: string
}

export function BackButton({ href }: BackButtonProps) {
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href={href} className="flex items-center gap-1">
        <ChevronLeft className="h-4 w-4" />
        <span>Back</span>
      </Link>
    </Button>
  )
}
