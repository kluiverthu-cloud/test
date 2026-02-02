import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Package, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    // 1. Get real counts and stats
    const [productCount, orderCount, revenueResult, recentSales] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({
            _sum: { total: true },
            where: {
                status: {
                    in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]
                }
            }
        }),
        prisma.order.findMany({
            where: {
                status: {
                    in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]
                }
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        })
    ])

    const totalRevenue = revenueResult._sum.total ? Number(revenueResult._sum.total) : 0

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Resumen general de tu tienda.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Bs {totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Ingresos confirmados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderCount}</div>
                        <p className="text-xs text-muted-foreground">Pedidos realizados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Productos</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productCount}</div>
                        <p className="text-xs text-muted-foreground">En catálogo</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <div className="grid gap-4 md:gap-8 lg:grid-cols-1">
                <Card className="xl:col-span-1">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Ventas Recientes</CardTitle>
                            <CardDescription>Últimas transacciones confirmadas.</CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="/admin/orders">
                                Ver Todo <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentSales.length > 0 ? (
                            <div className="space-y-8">
                                {recentSales.map((order) => (
                                    <div key={order.id} className="flex items-center">
                                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-indigo-700 uppercase">
                                            {order.user.name.substring(0, 2)}
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{order.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{order.user.email}</p>
                                        </div>
                                        <div className="ml-auto font-medium">+Bs {Number(order.total).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No hay ventas confirmadas recientes.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

