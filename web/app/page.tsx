import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RootPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Bienvenido a XyloTech
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
                Tu tienda de confianza para productos de computación.
            </p>
            <Link href="/products">
                <Button size="lg" className="font-semibold">
                    Ver Catálogo de Productos
                </Button>
            </Link>
        </div>
    );
}
