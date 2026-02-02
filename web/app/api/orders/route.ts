import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { items, paymentProof, subtotal, total, addressId } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in order" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Generate Order Number (Simple logic)
        const orderCount = await prisma.order.count()
        const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`

        // Create Default Address if not provided (Simplification for MVP)
        // In a real app, we would validate addressId or create one.
        // For now, let's look for a default address or create a dummy one if none exists?
        // Actually, let's assume address/profile is handled separately or just use a placeholder address relation if required.
        // Schema says Reference to Address is required.
        // We will create a dummy default address for the user if they don't have one, just to make it work.

        let validAddressId = addressId

        if (!validAddressId) {
            const defaultAddress = await prisma.address.findFirst({
                where: { userId: user.id }
            })
            if (defaultAddress) {
                validAddressId = defaultAddress.id
            } else {
                const newAddress = await prisma.address.create({
                    data: {
                        userId: user.id,
                        label: "Principal",
                        name: user.name || "Usuario",
                        phone: "0000000000",
                        address: "Dirección Principal",
                        city: "Ciudad",
                        state: "Estado",
                        zipCode: "0000"
                    }
                })
                validAddressId = newAddress.id
            }
        }

        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: user.id,
                addressId: validAddressId,
                status: "PENDING",
                subtotal,
                total,
                paymentMethod: "QR_PAYMENT",
                paymentProof: paymentProof || null,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        total: item.price * item.quantity
                    }))
                }
            }
        })

        // Update stocks
        for (const item of items) {
            await prisma.product.update({
                where: { id: item.id },
                data: { stock: { decrement: item.quantity } }
            })
        }

        return NextResponse.json(order, { status: 201 })

    } catch (error: any) {
        console.error("Order creation error:", error)
        return NextResponse.json({ error: "Error creating order", details: error.message }, { status: 500 })
    }
}
