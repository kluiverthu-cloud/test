"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Search, Home, ShoppingCart, Heart, Bell, Settings, Menu, Info, Phone, Download, LogOut, User as UserIcon, LayoutDashboard, LogIn } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
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
        <div className={cn("pb-12 h-screen border-r bg-[#020617] text-white border-slate-800", className)}>
            <ScrollArea className="h-full py-8 pl-6 pr-6">
                <div className="mb-6" />

                <div className="mb-12">
                    <h3 className="mb-4 px-2 text-sm font-semibold tracking-tight text-slate-400 uppercase">
                        Categories
                    </h3>
                    <div className="space-y-4">
                        <Link
                            href="/products"
                            className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "w-full justify-start font-normal text-lg h-12 hover:bg-white/10 hover:text-white px-4",
                                !new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('categoryId') && "bg-white/10 text-white"
                            )}
                        >
                            <span className="mr-2">Todos</span>
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/products?categoryId=${cat.id}`}
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    "w-full justify-start font-normal text-lg h-12 hover:bg-white/10 hover:text-white px-4",
                                    new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('categoryId') === cat.id && "bg-white/10 text-white"
                                )}
                            >
                                <span className="mr-2">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 mt-auto">
                    <h3 className="mb-2 px-2 text-sm font-semibold tracking-tight text-slate-400 uppercase">
                        Menu
                    </h3>
                    <NavLink icon={<ShoppingCart size={22} />} href="/cart" label="Carrito" />

                    {session?.user && (
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-xl h-12 text-lg hover:bg-white/10 hover:text-white text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => signOut({ callbackUrl: '/auth' })}
                        >
                            <LogOut size={22} />
                            Cerrar Sesión
                        </Button>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}



function NavLink({ href, label, icon, active }: { href: string, label: string, icon: React.ReactNode, active?: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start gap-3 rounded-xl h-12 text-lg hover:bg-white/10 hover:text-white",
                active && "bg-white/10 text-white"
            )}
        >
            {icon}
            {label}
        </Link>
    )
}
