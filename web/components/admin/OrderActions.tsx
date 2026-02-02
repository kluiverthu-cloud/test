"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface OrderActionsProps {
    orderId: string
    currentStatus: string
}

export function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleConfirmPayment = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "CONFIRMED" })
            })

            if (!res.ok) throw new Error("Error al actualizar")

            toast.success("Pago confirmado correctamente")
            router.refresh()
        } catch (error) {
            toast.error("Error al confirmar el pedido")
        } finally {
            setIsLoading(false)
        }
    }

    if (currentStatus !== 'PENDING') return null

    return (
        <Button
            size="sm"
            variant="outline"
            className="h-8 gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
            onClick={handleConfirmPayment}
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Confirmar Pago
        </Button>
    )
}
