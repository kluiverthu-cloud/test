"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCartStore, CartItem } from "@/lib/store/cart"
import { toast } from "sonner"

export function BuyButton({
    product,
    variant = "default",
    children,
    className
}: {
    product: CartItem,
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive",
    children: React.ReactNode,
    className?: string
}) {
    const addItem = useCartStore(state => state.addItem)
    const router = useRouter()

    const handleAction = () => {
        addItem(product)
        toast.success("Producto agregado al carrito")
        router.push("/cart")
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
