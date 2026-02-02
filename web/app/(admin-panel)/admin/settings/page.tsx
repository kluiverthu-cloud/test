"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { Upload, Save, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Image from "next/image"

export default function SettingsPage() {
    const [qrPreview, setQrPreview] = useState("/uploads/shop-qr.png")
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)
        formData.append("customName", "shop-qr.png") // Force fixed name for simplicity

        setLoading(true)
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (res.ok) {
                const data = await res.json()
                // Force cache bust
                setQrPreview(`${data.url}?t=${Date.now()}`)
                toast.success("Código QR actualizado correctamente")
            } else {
                toast.error("Error al subir el archivo")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error de conexión")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Configuración</h1>
                <p className="text-muted-foreground">Gestiona los ajustes de tu tienda y métodos de pago.</p>
            </div>

            <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <QrCode className="h-5 w-5 text-violet-600" />
                        Configuración de Pagos QR
                    </CardTitle>
                    <CardDescription>
                        Sube la imagen del Código QR que verán tus clientes al momento de pagar.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative group w-48 h-48 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                            <Image
                                src={qrPreview}
                                alt="QR Code Preview"
                                width={192}
                                height={192}
                                className="object-cover w-full h-full"
                                onError={() => setQrPreview("")} // Fallback if no image
                                unoptimized
                            />
                            {!qrPreview && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    Sin imagen
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 flex-1">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="qr-upload">Actualizar Imagen QR</Label>
                                <Input
                                    id="qr-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={loading}
                                    ref={fileInputRef}
                                />
                                <p className="text-xs text-muted-foreground">Soporta JPG, PNG, WEBP.</p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border text-sm text-slate-600 dark:text-slate-400">
                                <p>ℹ️ Esta imagen aparecerá automáticamente en el proceso de checkout cuando el cliente elija pagar con QR.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
