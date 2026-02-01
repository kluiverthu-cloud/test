import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, name, password } = body

        if (!email || !name || !password) {
            return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'CUSTOMER' // Por defecto son clientes
            }
        })

        const { password: _, ...userWithoutPassword } = user
        return NextResponse.json(userWithoutPassword, { status: 201 })
    } catch (error: any) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Error al registrar usuario", details: error.message }, { status: 500 })
    }
}
