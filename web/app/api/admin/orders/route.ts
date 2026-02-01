import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                address: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return NextResponse.json(orders)
    } catch (error: any) {
        console.error("Error fetching admin orders:", error)
        return NextResponse.json({ error: "Error fetching orders", details: error.message }, { status: 500 })
    }
}
