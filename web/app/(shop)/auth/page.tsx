"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Github, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            if (isLogin) {
                // Login
                const res = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false
                })

                if (res?.error) {
                    setError("Credenciales inválidas")
                } else {
                    // Force session update
                    router.refresh()

                    // Simple redirect logic - we can't fully trust getSession immediately after login without a reload
                    // But we can try to redirect based on optimized assumption or just to home/callback
                    if (searchParams.get("callbackUrl")) {
                        window.location.href = searchParams.get("callbackUrl")!
                    } else {
                        // Default to home, but force a hard reload to ensure session cookies are set
                        window.location.href = "/"
                    }
                }
            } else {
                // Register
                const res = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                })

                if (res.ok) {
                    // Success register -> auto login
                    await signIn("credentials", {
                        email: formData.email,
                        password: formData.password,
                        callbackUrl: "/"
                    })
                } else {
                    const data = await res.json()
                    setError(data.error || "Algo salió mal")
                }
            }
        } catch (err) {
            setError("Ocurrió un error inesperado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-violet-600 dark:text-violet-400 mb-2">
                        XyloTech
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {isLogin ? "Bienvenido de nuevo a tu tienda tech" : "Únete a la mejor comunidad de hardware"}
                    </p>
                </div>

                <Card className="border-none shadow-2xl shadow-violet-500/10 dark:bg-slate-900 bg-white">
                    <CardHeader>
                        <CardTitle className="text-2xl">{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</CardTitle>
                        <CardDescription>
                            {isLogin ? "Ingresa tus credenciales para continuar" : "Completa el formulario para registrarte"}
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            className="pl-10"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        className="pl-10"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm font-medium border border-red-100 dark:border-red-900/30">
                                    {error}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-lg shadow-lg shadow-violet-500/20" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : (isLogin ? "Acceder" : "Registrarse")}
                            </Button>

                            <div className="text-center w-full">
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-sm text-slate-500 hover:text-violet-600 transition-colors"
                                >
                                    {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                                </button>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                <div className="text-center text-xs text-slate-400">
                    Al continuar, aceptas nuestros términos de servicio y política de privacidad.
                </div>
            </div>
        </div>
    )
}
