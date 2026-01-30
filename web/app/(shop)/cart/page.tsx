import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react"

export default function CartPage() {
    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Tu Carrito de Compras</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {/* Cart Item Mock */}
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border shadow-sm">
                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold text-sm md:text-base mb-1">Laptop Gaming ASUS ROG Strix G16</h3>
                                    <p className="text-xs text-muted-foreground mb-2">Specs: i9, 32GB RAM, RTX 4070</p>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="font-bold text-violet-600 text-lg">$1899.99</div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border rounded-lg bg-slate-50 dark:bg-slate-800">
                                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-l-lg"><Minus size={14} /></button>
                                            <span className="text-sm font-semibold px-3 min-w-[2rem] text-center">1</span>
                                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-r-lg"><Plus size={14} /></button>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full">
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border sticky top-8 shadow-sm">
                        <h3 className="font-semibold mb-6 text-lg">Resumen del Pedido</h3>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">$3799.98</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Envío</span>
                                <span className="text-green-600 font-medium">Gratis</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Impuestos estimados</span>
                                <span className="font-medium">$380.00</span>
                            </div>
                            <div className="border-t border-dashed my-4"></div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>$4179.98</span>
                            </div>
                        </div>
                        <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-6 text-base shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02]">
                            Proceder al Pago <ArrowRight className="ml-2" size={18} />
                        </Button>
                        <div className="mt-4 text-xs text-center text-muted-foreground">
                            Pago 100% seguro garantizado
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
