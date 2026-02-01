import { ProductCard } from "@/components/shop/ProductCard"
import { products } from "@/lib/mock-data"


export default async function ProductsPage() {
    // Fetch products from our brand new API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products`, {
        cache: 'no-store' // Keep it fresh
    })
    const products = await response.json()

    return (
        <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.length > 0 ? (
                    products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                        No se encontraron productos en la base de datos.
                    </div>
                )}
            </div>
        </div>
    )
}
