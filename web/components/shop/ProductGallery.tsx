"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
    images: string[]
    productName: string
}

export function ProductGallery({ images = [], productName }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0] || "")

    if (!images || images.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 flex items-center justify-center border shadow-sm aspect-square relative overflow-hidden">
                <div className="flex items-center justify-center w-full h-full bg-slate-50 text-slate-200">
                    <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 flex items-center justify-center border shadow-sm aspect-square relative overflow-hidden group">
                <img
                    src={selectedImage}
                    alt={productName}
                    className="w-full h-full object-contain transition-all duration-300 animate-in fade-in zoom-in-95"
                    key={selectedImage} // Force re-render/animation on change
                />
            </div>
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedImage(img)}
                            className={cn(
                                "w-24 h-24 bg-white dark:bg-slate-900 rounded-xl border cursor-pointer transition-all flex items-center justify-center shrink-0 overflow-hidden",
                                selectedImage === img ? "border-violet-600 ring-2 ring-violet-600/20" : "hover:border-violet-500"
                            )}
                        >
                            <img src={img} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
