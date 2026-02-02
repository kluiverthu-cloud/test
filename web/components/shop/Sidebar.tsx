"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Search, Home, ShoppingCart, Heart, Bell, Settings, Menu, Info, Phone, Download, LogOut, User as UserIcon, LayoutDashboard, LogIn } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [categories, setCategories] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data)
                } else {
                    // Silently fail to empty array if data is invalid
                    setCategories([])
                }
            })
            .catch(err => {
                console.error("Error loading categories:", err)
                setCategories([])
            })
    }, [])

    // Don't show sidebar on auth page
    if (pathname === '/auth') return null

    return (
        <div className={cn("pb-12 h-screen border-r bg-background", className)}>
            <ScrollArea className="h-full py-6 pl-6 pr-6">
                <div className="mb-6 flex items-center gap-2 font-bold text-xl px-2">
                    <span className="text-primary">*</span> XyloTech
                </div>

                <div className="mb-8">
                    <h3 className="mb-2 px-2 text-sm font-semibold tracking-tight">
                        Categories
                    </h3>
                    <div className="space-y-1">
                        <Link href="/products">
                            <Button variant="ghost" className={cn("w-full justify-start font-normal", !new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('categoryId') && "bg-slate-100 dark:bg-slate-800")}>
                                <span className="mr-2">Todos</span>
                            </Button>
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/products?categoryId=${cat.id}`}>
                                <Button variant="ghost" className="w-full justify-start font-normal">
                                    <span className="mr-2">{cat.name}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="space-y-1">
                    <NavLink icon={<ShoppingCart size={20} />} href="/cart" label="Carrito" />
                </div>
            </ScrollArea>
        </div>
    )
}

function NavLink({ href, label, icon, active }: { href: string, label: string, icon: React.ReactNode, active?: boolean }) {
    return (
        <Link href={href}>
            <Button variant={active ? "secondary" : "ghost"} className={cn("w-full justify-start gap-3 rounded-xl", active && "bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/50 dark:text-violet-100")}>
                {icon}
                {label}
            </Button>
        </Link>
    )
}
