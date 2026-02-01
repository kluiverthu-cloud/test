"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export function DeleteProductButton({ productId }: { productId: string }) {
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
            return
        }

        try {
            const res = await fetch(`/api/products?id=${productId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                router.refresh()
            } else {
                alert("Error al eliminar el producto")
            }
        } catch (error) {
            console.error("Delete error:", error)
        }
    }

    return (
        <DropdownMenuItem className="text-red-600 focus:text-red-600" onSelect={(e) => {
            e.preventDefault()
            handleDelete()
        }}>
            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
        </DropdownMenuItem>
    )
}
