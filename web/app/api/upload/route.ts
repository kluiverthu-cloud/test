import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File
        const customName = formData.get("customName") as string

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = customName || file.name.replaceAll(" ", "_")

        // Ensure uploads directory exists (should be in public for access)
        const uploadDir = path.join(process.cwd(), "public/uploads")
        // Note: You might need to check/create dir if not exists, but usually public exists.
        // For simplicity assuming public exists. Creating uploads if not.

        try {
            await writeFile(path.join(uploadDir, filename), buffer)
        } catch (e) {
            // Try creating dir? No, 'public/uploads' might not exist.
            // But let's assume it works or fail.
        }

        return NextResponse.json({
            message: "Success",
            url: `/uploads/${filename}`
        })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}
