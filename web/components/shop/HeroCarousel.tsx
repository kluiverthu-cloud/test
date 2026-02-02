"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const banners = [
    "/banners/banner1.png",
    "/banners/banner2.png"
]

export function HeroCarousel() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const prev = () => setCurrent((curr) => (curr === 0 ? banners.length - 1 : curr - 1))
    const next = () => setCurrent((curr) => (curr + 1) % banners.length)

    return (
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-3xl mb-8 group">
            {banners.map((src, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                    <img
                        src={src}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}

            {/* Overlay Branding */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 md:px-24">
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(139,92,246,0.5)] mb-2">
                    <span className="text-violet-500">XYLO</span>TECH
                </h1>
                <p className="text-slate-200 text-lg md:text-xl font-medium max-w-xl drop-shadow-md">
                    Tecnología de vanguardia para tu estilo de vida digital.
                </p>
            </div>

            {/* Controls */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white hover:bg-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prev}
            >
                <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white hover:bg-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={next}
            >
                <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-violet-500 w-8" : "bg-white/50 hover:bg-white"
                            }`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </div>
    )
}
