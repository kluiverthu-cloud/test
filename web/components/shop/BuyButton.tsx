"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function BuyButton({
    variant = "default",
    children,
    className
}: {
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive",
    children: React.ReactNode,
    className?: string
}) {
    const { data: session } = useSession()
    const router = useRouter()

    const handleAction = () => {
        if (!session) {
            router.push("/auth")
            return
        }

        // Aquí iría la lógica de agregar al carrito o comprar
        alert("En desarrollo: Agregando al carrito...")
    }

    return (
        <Button
            size="lg"
            variant={variant}
            className={className}
            onClick={handleAction}
        >
            {children}
        </Button>
    )
}
