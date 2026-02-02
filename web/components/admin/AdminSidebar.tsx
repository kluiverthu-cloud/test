"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    Settings,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const adminRoutes = [
    {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        href: "/admin/products",
        label: "Productos",
        icon: Package,
    },
    {
        href: "/admin/orders",
        label: "Pedidos",
        icon: ShoppingCart,
    },
    {
        href: "/admin/settings",
        label: "Configuración",
        icon: Settings,
    },
]

export function AdminSidebar({ className }: { className?: string }) {
    const pathname = usePathname()

    return (
        <div className={cn("hidden border-r bg-slate-900 text-slate-100 md:block w-64 h-screen shrink-0", className)}>
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b border-slate-800 px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <span className="text-violet-500 text-xl font-bold">Admin</span>Panel
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {adminRoutes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                            >
                                <span className={cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
                                    pathname === route.href ? "bg-slate-800 text-white" : "text-slate-400"
                                )}>
                                    <route.icon className="h-4 w-4" />
                                    {route.label}
                                </span>
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t border-slate-800">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-slate-400 hover:text-white hover:bg-slate-800">
                        <LogOut size={16} /> Cerrar Sesión
                    </Button>
                </div>
            </div>
        </div>
    )
}
