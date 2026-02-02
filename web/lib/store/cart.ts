import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    image?: string
    quantity: number
    maxStock: number
}

interface CartState {
    items: CartItem[]
    isOpen: boolean
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    setIsOpen: (isOpen: boolean) => void
    totalItems: () => number
    totalPrice: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (item) => set((state) => {
                const existingItem = state.items.find((i) => i.id === item.id)
                if (existingItem) {
                    return {
                        items: state.items.map((i) =>
                            i.id === item.id
                                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxStock) }
                                : i
                        ),
                        isOpen: true
                    }
                }
                return { items: [...state.items, item], isOpen: true }
            }),
            removeItem: (id) => set((state) => ({
                items: state.items.filter((i) => i.id !== id)
            })),
            updateQuantity: (id, quantity) => set((state) => ({
                items: state.items.map((i) =>
                    i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) } : i
                )
            })),
            clearCart: () => set({ items: [] }),
            setIsOpen: (isOpen) => set({ isOpen }),
            totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            totalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
        }),
        {
            name: 'xylotech-cart',
        }
    )
)
