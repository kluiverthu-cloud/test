import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Star, ArrowLeft, Truck, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { BuyButton } from "@/components/shop/BuyButton"
import { ProductGallery } from "@/components/shop/ProductGallery"

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
                {/* Image Gallery Section */}
                {/* Image Gallery Section */}
                <ProductGallery images={product.images} productName={product.name} />

                {/* Product Info Section */}
                <div>
                    <div className="mb-2">
                        <span className="text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-3 py-1 rounded-full">
                            {product.isNew ? 'Nuevo Ingreso' : 'En Stock'}
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-50">{product.name}</h1>

                    <div className="flex items-end gap-3 mb-8">
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">Bs {product.price.toString()}</div>
                        {product.comparePrice && (
                            <div className="text-lg text-slate-400 line-through mb-1">Bs {product.comparePrice.toString()}</div>
                        )}
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-lg">
                        {product.description}
                    </p>

                    {/* Specs Grid Removed from UI per request? Or just from Admin? 
                        User said "quita tambien esa parte de abajo de especificaciones" in Admin context.
                        For shop, he said "quiero que se vean en el panel de compradores" referring to images.
                        I will check if he wanted specs removed from shop.
                        "quita tambien esa parte de abajo de especificaciones" -> likely Admin form.
                        I'll keep them here for now unless specified.
                    */}

                    <div className="flex flex-col gap-3 mb-8">
                        <div className="flex gap-4">
                            <BuyButton
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    price: typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price),
                                    image: product.images?.[0] || "",
                                    quantity: 1,
                                    maxStock: product.stock
                                }}
                                className="w-full text-base h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25">
                                Agregar al Carrito
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
