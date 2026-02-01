"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Home, ShoppingCart, Heart, Bell, Settings, Menu, Info, Phone, Download } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export function Sidebar({ className }: { className?: string }) {
    const [categories, setCategories] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Error loading categories:", err))
    }, [])

    return (
        <div className={cn("pb-12 h-screen border-r bg-background", className)}>
            <ScrollArea className="h-full py-6 pl-6 pr-6">
                <div className="mb-6 flex items-center gap-2 font-bold text-xl px-2">
                    <span className="text-primary">*</span> XyloTech
                </div>

                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://ui.shadcn.com/avatars/04.png" alt="User" className="h-full w-full object-cover" />
                    </div>
                </div>

                <div className="space-y-1 mb-6">
                    <NavLink icon={<Home size={20} />} href="/" label="Home" active />
                    <NavLink icon={<ShoppingCart size={20} />} href="/cart" label="Cart" />
                    <NavLink icon={<Heart size={20} />} href="/profile/favorites" label="Favourite" />
                    <NavLink icon={<Bell size={20} />} href="/notifications" label="Notification" />
                    <NavLink icon={<Settings size={20} />} href="/settings" label="Settings" />
                </div>

                <div className="px-2 mb-6">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search" className="pl-9 rounded-xl bg-slate-50 border-0" />
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="mb-2 px-2 text-sm font-semibold tracking-tight">
                        Categories
                    </h3>
                    <div className="space-y-1">
                        {categories.map((cat) => (
                            <Button key={cat.id} variant="ghost" className="w-full justify-start font-normal">
                                <span className="mr-2">{cat.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="mb-4 px-2 text-sm font-semibold tracking-tight">Filter by</h3>

                    <div className="px-2 mb-4">
                        <label className="text-xs font-medium mb-3 block">Price</label>
                        <Slider defaultValue={[120, 2000]} max={3000} step={10} className="mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Min: $120</span>
                            <span>Max: $2000</span>
                        </div>
                    </div>

                    <div className="px-2 mb-4">
                        <label className="text-xs font-medium mb-3 block">Color</label>
                        <div className="flex gap-2">
                            {['bg-blue-200', 'bg-slate-100', 'bg-blue-600', 'bg-black', 'bg-yellow-400', 'bg-red-400', 'bg-orange-400'].map((color, i) => (
                                <div key={i} className={`h-4 w-4 rounded-full ${color} cursor-pointer border border-slate-200 hover:ring-2 ring-primary/50 transition-all`}></div>
                            ))}
                        </div>
                    </div>

                    <div className="px-2">
                        <label className="text-xs font-medium mb-3 block">Material</label>
                        <div className="flex flex-wrap gap-2">
                            {['Metal', 'Wood', 'Glass', 'Stone', 'Acrylic'].map((mat) => (
                                <Badge key={mat} variant="outline" className="font-normal cursor-pointer hover:bg-accent">{mat}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-1">
                    <NavLink href="/about" label="About" icon={<Info size={20} />} />
                    <NavLink href="/contact" label="Contact us" icon={<Phone size={20} />} />
                    <NavLink href="/app" label="Download app" icon={<Download size={20} />} />
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
