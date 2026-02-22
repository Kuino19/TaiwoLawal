import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Book {
    $id: string; // Appwrite ID
    title: string;
    description: string;
    price: number;
    image_url: string;
    type: 'digital' | 'physical';
}

export interface CartItem extends Book {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (book: Book) => void;
    removeItem: (bookId: string) => void;
    updateQuantity: (bookId: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (book) => {
                const items = get().items;
                const existingItem = items.find((item) => item.$id === book.$id);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.$id === book.$id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, { ...book, quantity: 1 }] });
                }
            },
            removeItem: (bookId) => {
                set({
                    items: get().items.filter((item) => item.$id !== bookId),
                });
            },
            updateQuantity: (bookId, quantity) => {
                set({
                    items: get().items.map((item) =>
                        item.$id === bookId ? { ...item, quantity: Math.max(0, quantity) } : item
                    ).filter(item => item.quantity > 0)
                });
            },
            clearCart: () => set({ items: [] }),
            total: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
