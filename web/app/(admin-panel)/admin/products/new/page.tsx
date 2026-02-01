"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const [brands, setBrands] = useState<any[]>([])

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        brandId: "",
        isNew: true,
        isFeatured: false,
        specs: "{}"
    })
    const [images, setImages] = useState<string[]>([])
    const [newImageUrl, setNewImageUrl] = useState("")

    useEffect(() => {
        // Load dependencies
        Promise.all([
            fetch('/api/categories').then(res => res.json()),
            fetch('/api/brands').then(res => res.json())
        ]).then(([cats, brs]) => {
            setCategories(cats)
            setBrands(brs)
        })
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => {
            const updated = { ...prev, [name]: value }
            // Auto-slugify name if slug is empty or was auto-generated
            if (name === "name" && (!prev.slug || prev.slug === prev.name.toLowerCase().replace(/ /g, "-"))) {
                updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
            }
            return updated
        })
    }

    const addImage = () => {
        if (newImageUrl && !images.includes(newImageUrl)) {
            setImages([...images, newImageUrl])
            setNewImageUrl("")
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
                specs: JSON.parse(formData.specs)
            }

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            })

            if (res.ok) {
                router.push('/admin/products')
                router.refresh()
            } else {
                const err = await res.json()
                alert(`Error: ${err.details || err.error}`)
            }
        } catch (error) {
            console.error("Submit error:", error)
            alert("Ocurrió un error al procesar el formulario. Verifica el formato de Specs (JSON).")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/products">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Nuevo Producto</h1>
                    <p className="text-muted-foreground">Añade un nuevo artículo al catálogo de XyloTech.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Producto</Label>
                            <Input id="name" name="name" placeholder="Ej: Monitor Gamer 4K" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input id="slug" name="slug" placeholder="monitor-gamer-4k" value={formData.slug} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Describe las características principales..."
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm space-y-4">
                        <h3 className="font-semibold text-lg">Imágenes</h3>
                        <div className="flex gap-2">
                            <Input placeholder="URL de la imagen (de momento)" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                            <Button type="button" onClick={addImage} variant="secondary">
                                <Upload className="h-4 w-4 mr-2" /> Añadir
                            </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-xl border overflow-hidden bg-slate-50">
                                    <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(img)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm space-y-4">
                        <h3 className="font-semibold text-lg">Especificaciones (JSON)</h3>
                        <textarea
                            name="specs"
                            rows={4}
                            className="w-full font-mono text-xs rounded-md border border-input bg-slate-50 dark:bg-slate-950 px-3 py-2"
                            value={formData.specs}
                            onChange={handleInputChange}
                        ></textarea>
                        <p className="text-xs text-muted-foreground">Ej: {"{ \"ram\": \"16GB\", \"cpu\": \"i7\" }"}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm space-y-4">
                        <h3 className="font-semibold">Inventario y Precio</h3>
                        <div className="space-y-2">
                            <Label htmlFor="price">Precio ($)</Label>
                            <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" value={formData.price} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock inicial</Label>
                            <Input id="stock" name="stock" type="number" placeholder="0" value={formData.stock} onChange={handleInputChange} required />
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
                            <Label htmlFor="isNew" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Es nuevo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onCheckedChange={(checked) => setFormData(p => ({ ...p, isFeatured: !!checked }))}
                            />
                            <Label htmlFor="isFeatured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Destacado</Label>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white" disabled={loading}>
                        {loading ? "Guardando..." : (
                            <>
                                <Save className="h-4 w-4 mr-2" /> Guardar Producto
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
