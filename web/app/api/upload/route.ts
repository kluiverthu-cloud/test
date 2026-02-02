import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File
        const customName = formData.get("customName") as string

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 })
        }

        const buffer = await file.arrayBuffer()
        const filename = customName || `proof_${Date.now()}_${file.name.replaceAll(" ", "_")}`

        // Upload to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('uploads')
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: true
            })

        if (error) {
            console.error("Supabase storage error:", error)
            return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 })
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('uploads')
            .getPublicUrl(filename)

        return NextResponse.json({
            message: "Success",
            url: publicUrl
        })
    } catch (error: any) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed " + error.message }, { status: 500 })
    }
}
