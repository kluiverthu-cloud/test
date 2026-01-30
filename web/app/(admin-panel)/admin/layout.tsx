import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
            <AdminSidebar />

            <div className="flex flex-col flex-1 sm:gap-4 sm:py-4 sm:pl-14 md:pl-0">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline" className="sm:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 sm:max-w-xs bg-slate-900 border-r-slate-800">
                            <AdminSidebar className="block w-full border-r-0" />
                        </SheetContent>
                    </Sheet>

                    <div className="relative ml-auto flex-1 md:grow-0">
                        {/* Search or breadcrumbs could go here */}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </div>
                </header>

                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
