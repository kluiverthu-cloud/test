import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
                category: true,
                brand: true,
            }
        })

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error: any) {
        return NextResponse.json({ error: "Error fetching product" }, { status: 500 })
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    try {
        const body = await request.json()
        const { name, slug, description, price, stock, categoryId, brandId, images, specs, isNew, isFeatured, isActive } = body

        const product = await prisma.product.update({
            where: { id: params.id },
            data: {
                name,
                slug,
                description,
                price,
                stock,
                categoryId,
                brandId,
                images: images || [],
                specs: specs || {},
                isNew: !!isNew,
                isFeatured: !!isFeatured,
                isActive: isActive !== undefined ? isActive : undefined
            }
        })

        return NextResponse.json(product)
    } catch (error: any) {
        return NextResponse.json({ error: "Error updating product", details: error.message }, { status: 500 })
    }
}
