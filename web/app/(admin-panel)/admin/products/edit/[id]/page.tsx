"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, Upload, X, Trash, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [categories, setCategories] = useState<any[]>([])
    const [brands, setBrands] = useState<any[]>([])

    // File upload
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        slug: "", // Will be auto-generated or kept hidden
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        brandId: "",
        isNew: false,
        isFeatured: false,
        isActive: true,
        specs: "{}"
    })
    const [images, setImages] = useState<string[]>([])

    useEffect(() => {
        setFetching(true)
        Promise.all([
            fetch('/api/categories').then(res => res.json()),
            fetch('/api/brands').then(res => res.json()),
            fetch(`/api/products/${params.id}`).then(res => {
                if (!res.ok) throw new Error("Product not found")
                return res.json()
            })
        ]).then(([cats, brs, product]) => {
            setCategories(cats)
            setBrands(brs)

            setFormData({
                name: product.name,
                slug: product.slug,
                description: product.description || "",
                price: product.price,
                stock: product.stock,
                categoryId: product.categoryId,
                brandId: product.brandId,
                isNew: product.isNew,
                isFeatured: product.isFeatured,
                isActive: product.isActive,
                specs: JSON.stringify(product.specs || {}, null, 2)
            })
            setImages(product.images || [])
            setFetching(false)
        }).catch(err => {
            console.error("Error loading data:", err)
            toast.error("Error cargando el producto")
            router.push('/admin/products')
        })
    }, [params.id, router])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Auto-slug from name if needed (hidden field update)
        if (name === "name") {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
            setFormData(prev => ({ ...prev, name: value, slug }))
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        const newImages: string[] = []

        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData()
                formData.append("file", files[i])

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                })

                if (res.ok) {
                    const data = await res.json()
                    newImages.push(data.url)
                }
            }
            setImages(prev => [...prev, ...newImages])
            toast.success(`${newImages.length} imágenes subidas`)
        } catch (error) {
            console.error(error)
            toast.error("Error al subir imágenes")
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const removeImage = (url: string) => {
        setImages(images.filter(img => img !== url))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images,
                // Simplify specs or empty
                specs: {}
            }

            const res = await fetch(`/api/products/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            })

            if (res.ok) {
                toast.success("Producto actualizado correctamente")
                router.push('/admin/products')
                router.refresh()
            } else {
                const err = await res.json()
                toast.error(`Error: ${err.details || err.error}`)
            }
        } catch (error) {
            console.error("Update error:", error)
            toast.error("Ocurrió un error al actualizar.")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return <div className="p-8 text-center flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div></div>
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/products">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Editar Producto</h1>
                    <p className="text-muted-foreground">Modifica los detalles del producto.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Producto</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        {/* Slug hidden */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <textarea
                                id="description"
                                name="description"
                                rows={6}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Imágenes</h3>
                            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                <Plus className="h-4 w-4 mr-2" />
                                {uploading ? "Subiendo..." : "Subir Imágenes"}
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />
                        </div>

                        {images.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-400">
                                <Upload className="mx-auto h-10 w-10 mb-2 opacity-50" />
                                <p className="text-sm">No hay imágenes. Sube algunas fotos del producto.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded-xl border overflow-hidden bg-slate-50">
                                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(img)}
                                            className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        {idx === 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-1 text-center font-medium backdrop-blur-sm">
                                                Principal
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">La primera imagen será la principal.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm space-y-4">
                        <h3 className="font-semibold">Inventario y Precio</h3>
                        <div className="space-y-2">
                            <Label htmlFor="price">Precio (Bs)</Label>
                            <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm space-y-4">
                        <h3 className="font-semibold">Clasificación</h3>
                        <div className="space-y-2">
                            <Label htmlFor="categoryId">Categoría</Label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brandId">Marca</Label>
                            <select
                                id="brandId"
                                name="brandId"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.brandId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm space-y-4">
                        <h3 className="font-semibold">Opciones</h3>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isNew"
                                checked={formData.isNew}
                                onCheckedChange={(checked) => setFormData(p => ({ ...p, isNew: !!checked }))}
                            />
                            <Label htmlFor="isNew">Es nuevo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onCheckedChange={(checked) => setFormData(p => ({ ...p, isFeatured: !!checked }))}
                            />
                            <Label htmlFor="isFeatured">Destacado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData(p => ({ ...p, isActive: !!checked }))}
                            />
                            <Label htmlFor="isActive">Activo (Visible)</Label>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white" disabled={loading}>
                        {loading ? (
                            <>
                                <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div> Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" /> Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
