import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Star, ArrowLeft, Truck, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { BuyButton } from "@/components/shop/BuyButton"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // Fetch product from Supabase using Prisma
    const product: any = await prisma.product.findUnique({
        where: { id }
    })

    if (!product) {
        notFound()
    }

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
            <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft size={16} /> Volver al catálogo
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Gallery Section */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 flex items-center justify-center border shadow-sm aspect-square relative overflow-hidden group">
                        <div className="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <svg className="w-32 h-32 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-24 h-24 bg-white dark:bg-slate-900 rounded-xl border cursor-pointer hover:border-violet-500 transition-colors flex items-center justify-center shrink-0">
                                <div className="w-8 h-8 bg-slate-100 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info Section */}
                <div>
                    <div className="mb-2">
                        <span className="text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-3 py-1 rounded-full">
                            {product.isNew ? 'Nuevo Ingreso' : 'En Stock'}
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-50">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={18} fill={s <= Math.round(product.rating || 0) ? "currentColor" : "none"} className={s > Math.round(product.rating || 0) ? "text-slate-200" : ""} />
                            ))}
                        </div>
                        <span className="text-sm text-slate-500 font-medium">{product.reviewCount} reseñas verificadas</span>
                    </div>

                    <div className="flex items-end gap-3 mb-8">
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">${product.price.toString()}</div>
                        {product.comparePrice && (
                            <div className="text-lg text-slate-400 line-through mb-1">${product.comparePrice.toString()}</div>
                        )}
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-lg">
                        {product.description}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {product.specs && Object.entries(product.specs as object).map(([key, value]) => (
                            <div key={key} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">{key}</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-200 capitalize">{String(value)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 mb-8">
                        <div className="flex gap-4">
                            <BuyButton className="w-full text-base h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25">
                                Agregar al Carrito
                            </BuyButton>
                            <BuyButton variant="outline" className="w-full text-base h-12 rounded-xl border-slate-300 dark:border-slate-700">
                                Comprar Ahora
                            </BuyButton>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <Truck size={18} />
                            <span>Envío gratis a todo el país</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={18} />
                            <span>Garantía de 12 meses</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
