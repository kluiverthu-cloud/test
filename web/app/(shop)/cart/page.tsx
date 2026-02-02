"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ArrowRight, Upload, QrCode, X, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/store/cart"
import Image from "next/image"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CartPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [paymentProof, setPaymentProof] = useState<string>("")
    const [isUploading, setIsUploading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [qrImage, setQrImage] = useState("/uploads/shop-qr.png") // Default path

    const subtotal = totalPrice()
    // Simple 10% tax for demo, or 0.
    const tax = 0 // subtotal * 0.10
    const total = subtotal + tax

    const handleCheckoutInit = () => {
        if (!session) {
            router.push("/auth?callbackUrl=/cart")
        } else {
            // Check if cart is empty
            if (items.length === 0) {
                toast.error("El carrito está vacío")
                return
            }
            setIsCheckoutOpen(true)
            // Force refresh QR image to avoid cache issues
            setQrImage(`/uploads/shop-qr.png?t=${Date.now()}`)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)

        setIsUploading(true)
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (res.ok) {
                const data = await res.json()
                setPaymentProof(data.url)
                toast.success("Comprobante subido")
            } else {
                toast.error("Error al subir archivo")
            }
        } catch (error) {
            toast.error("Error de subida")
        } finally {
            setIsUploading(false)
        }
    }

    const handleConfirmOrder = async () => {
        if (!paymentProof) {
            toast.error("Por favor sube el comprobante de pago")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    subtotal,
                    total,
                    paymentProof,
                    // addressId could be selected in a previous step, ignoring for MVP
                })
            })

            if (res.ok) {
                toast.success("¡Pedido realizado con éxito!")
                clearCart()
                setIsCheckoutOpen(false)
                router.push("/admin/orders") // Or to a user profile/orders page if exists. Redirecting to admin orders for demo/user checks? No, redirect to orders page if user has one, or home.
                // Since regular user can't see admin/orders, redirect to home or a success page.
                // Assuming user has no "My Orders" page yet? I'll redirect to Home for now.
                router.push("/")
            } else {
                const err = await res.json()
                toast.error(err.error || "Error al crear pedido")
            }
        } catch (error) {
            toast.error("Error de conexión")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <Trash2 className="h-10 w-10 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
                <p className="text-muted-foreground mb-8">Parece que no has agregado nada aún.</p>
                <Button onClick={() => router.push("/")} size="lg" className="bg-violet-600 hover:bg-violet-700">
                    <ArrowRight className="mr-2 h-4 w-4" /> Ir a comprar
                </Button>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto pb-32">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                Tu Carrito <span className="bg-violet-100 text-violet-700 text-sm px-3 py-1 rounded-full">{items.length} items</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border shadow-sm transition-all hover:shadow-md">
                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative border text-slate-300">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-slate-300">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                            <circle cx="9" cy="9" r="2" />
                                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                                    <p className="text-sm text-violet-600 font-bold">${item.price}</p>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center border rounded-lg bg-slate-50 dark:bg-slate-800">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-l-lg disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-semibold px-3 min-w-[2rem] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-r-lg disabled:opacity-50"
                                            disabled={item.quantity >= item.maxStock}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <Button
                                        onClick={() => removeItem(item.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border sticky top-8 shadow-sm">
                        <h3 className="font-semibold mb-6 text-xl">Resumen</h3>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Envío</span>
                                <span className="text-green-600 font-medium">Gratis</span>
                            </div>
                            {tax > 0 && <div className="flex justify-between">
                                <span className="text-muted-foreground">Impuestos</span>
                                <span className="font-medium">${tax.toFixed(2)}</span>
                            </div>}
                            <div className="border-t border-dashed my-4"></div>
                            <div className="flex justify-between font-bold text-2xl">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button
                            onClick={handleCheckoutInit}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-6 text-lg font-bold shadow-xl shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Pagar Ahora <ArrowRight className="ml-2" size={20} />
                        </Button>
                        <div className="mt-4 flex justify-center gap-2 text-slate-400">
                            <QrCode size={16} /> <span className="text-xs">Pago seguro con QR</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Pago con QR</DialogTitle>
                        <DialogDescription>
                            Escanea el código QR para realizar el pago de <strong>${total.toFixed(2)}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center gap-6 py-4">
                        <div className="relative w-64 h-64 bg-white p-2 rounded-xl border-2 border-dashed border-violet-200 flex items-center justify-center">
                            <Image
                                src={qrImage}
                                alt="Shop QR Code"
                                width={240}
                                height={240}
                                className="object-contain"
                                unoptimized // Important for local dynamic file
                            />
                        </div>

                        <div className="w-full space-y-4">
                            <Label htmlFor="proof">Subir Comprobante</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="proof"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="flex-1"
                                    disabled={isUploading || isSubmitting}
                                />
                            </div>
                            {isUploading && <p className="text-xs text-blue-500 animate-pulse">Subiendo imagen...</p>}
                            {paymentProof && (
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg text-xs font-medium">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    Comprobante adjuntado correctamente
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-between gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsCheckoutOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="bg-violet-600 hover:bg-violet-700 flex-1"
                            onClick={handleConfirmOrder}
                            disabled={!paymentProof || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                                </>
                            ) : "Confirmar Pedido"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
