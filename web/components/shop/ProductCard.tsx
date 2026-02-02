import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ProductCardProps {
    product: {
        id: string
        name: string
        price: number
        comparePrice?: number | null
        images: string[]
        rating: number
        reviewCount: number
        slug: string
    }
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.id}`} className="block h-full">
            <Card className="h-full border-transparent shadow-none hover:border-primary/30 border hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-900 group rounded-2xl">
                <CardContent className="p-4 flex flex-col h-full">
                    <div className="mb-4">
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">{product.name}</h3>
                        <p className="text-violet-600 dark:text-violet-400 font-bold text-sm">Bs {product.price}</p>
                    </div>

                    <div className="aspect-square relative flex items-center justify-center mb-6 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-slate-300">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        {/* Rating removed per request */}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
