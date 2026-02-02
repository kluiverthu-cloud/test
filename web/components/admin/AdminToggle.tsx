"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Store } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminToggle() {
    const { data: session } = useSession()
    const pathname = usePathname()

    if (session?.user?.role !== 'ADMIN') {
        return null
    }

    const isInAdmin = pathname?.startsWith('/admin')

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Link href={isInAdmin ? "/products" : "/admin/products"}>
                <Button
                    size="lg"
                    className="h-14 w-14 rounded-full shadow-2xl bg-violet-600 hover:bg-violet-700 text-white"
                    title={isInAdmin ? "Ver Tienda" : "Panel Admin"}
                >
                    {isInAdmin ? <Store size={24} /> : <LayoutDashboard size={24} />}
                </Button>
            </Link>
        </div>
    )
}
