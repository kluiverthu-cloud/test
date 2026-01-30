import { ProductCard } from "@/components/shop/ProductCard"
import { products } from "@/lib/mock-data"

export default function ProductsPage() {
    return (
        <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
                {/* Replicating products to fill grid for demo */}
                {products.map((product) => (
                    <ProductCard key={`${product.id}-copy`} product={{ ...product, id: `${product.id}-copy` }} />
                ))}
            </div>
        </div>
    )
}
