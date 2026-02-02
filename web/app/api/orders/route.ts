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
        const { items, paymentProof, subtotal, total, addressId, shippingDetails } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in order" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Generate Order Number
        const orderCount = await prisma.order.count()
        const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`

        let validAddressId = addressId

        // Create Address from Shipping Details if provided
        if (shippingDetails) {
            const newAddress = await prisma.address.create({
                data: {
                    userId: user.id,
                    label: "Dirección de Envío",
                    name: shippingDetails.name,
                    phone: shippingDetails.phone,
                    address: shippingDetails.address,
                    city: shippingDetails.city,
                    state: shippingDetails.state,
                    zipCode: shippingDetails.zipCode || "0000",
                    isDefault: false // Don't override default unless requested
                }
            })
            validAddressId = newAddress.id
        } else if (!validAddressId) {
            // Fallback to default address if exists
            const defaultAddress = await prisma.address.findFirst({
                where: { userId: user.id, isDefault: true }
            })
            if (defaultAddress) {
                validAddressId = defaultAddress.id
            } else {
                // Final fallback if no address provided at all (should not happen with new UI)
                return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
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
