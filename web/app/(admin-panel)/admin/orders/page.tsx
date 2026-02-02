import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, User, Calendar, CreditCard } from "lucide-react"

const statusMap: Record<string, { label: string, color: string }> = {
    'PENDING': { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' },
    'CONFIRMED': { label: 'Confirmado', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' },
    'PROCESSING': { label: 'Procesando', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200' },
    'SHIPPED': { label: 'Enviado', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200' },
    'DELIVERED': { label: 'Entregado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' },
    'CANCELLED': { label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' },
}

export default async function AdminOrdersPage() {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/orders`, {
        cache: 'no-store'
    })
    const orders = await response.json()

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
                <p className="text-muted-foreground">Monitorea y gestiona las órdenes de compra de tus clientes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Pedidos</p>
                        <p className="text-2xl font-bold">{orders.length}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
                            <TableHead className="font-bold">ID / Fecha</TableHead>
                            <TableHead className="font-bold">Cliente</TableHead>
                            <TableHead className="font-bold">Estado</TableHead>
                            <TableHead className="font-bold">Método</TableHead>
                            <TableHead className="font-bold text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length > 0 ? orders.map((order: any) => (
                            <TableRow key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-mono text-xs text-violet-600 font-bold uppercase">{order.orderNumber}</span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900 dark:text-slate-100">{order.user.name}</span>
                                        <span className="text-xs text-muted-foreground">{order.user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusMap[order.status]?.color || 'bg-slate-100'}`}>
                                        {statusMap[order.status]?.label || order.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 text-xs font-medium">
                                        <div className="flex items-center gap-2">
                                            <CreditCard size={14} className="text-slate-400" />
                                            {order.paymentMethod === 'QR_PAYMENT' ? 'Pago QR' : order.paymentMethod}
                                        </div>
                                        {order.paymentProof && (
                                            <a
                                                href={order.paymentProof}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-violet-600 hover:underline flex items-center gap-1"
                                            >
                                                Ver Comprobante
                                            </a>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                                    ${parseFloat(order.total).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    No hay pedidos registrados aún.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
