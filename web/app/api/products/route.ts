import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const categoryId = searchParams.get("categoryId")

        const where: any = {}
        if (categoryId) {
            where.categoryId = categoryId
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                category: true,
                brand: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        return NextResponse.json(products)
    } catch (error: any) {
        console.error("Error fetching products:", error)
        return NextResponse.json({ error: "Error fetching products", details: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, slug, description, price, stock, categoryId, brandId, images, specs, isNew, isFeatured } = body

        const product = await prisma.product.create({
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
            }
        })

        return NextResponse.json(product, { status: 201 })
    } catch (error: any) {
        console.error("Error creating product:", error)
        return NextResponse.json({ error: "Error creating product", details: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
        }

        await prisma.product.delete({
            where: { id }
        })

        return NextResponse.json({ message: "Product deleted successfully" })
    } catch (error: any) {
        console.error("Error deleting product:", error)
        return NextResponse.json({ error: "Error deleting product", details: error.message }, { status: 500 })
    }
}
