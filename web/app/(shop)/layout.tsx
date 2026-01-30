import { Sidebar } from "@/components/shop/Sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row bg-slate-50/30 dark:bg-slate-950">
            {/* Mobile Header */}
            <div className="md:hidden p-4 border-b flex items-center gap-4 bg-background sticky top-0 z-10">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon"><Menu /></Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <Sidebar />
                    </SheetContent>
                </Sheet>
                <div className="font-bold">BasicTechShop</div>
            </div>

            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:block w-72 shrink-0 border-r-0" />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
