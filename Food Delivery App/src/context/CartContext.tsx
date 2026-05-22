import { createContext, useContext, useState } from 'react';
import { ReactNode } from 'react';

type CartItem = { id: string; name: string; price: number; qty: number };

type CartContextType = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'qty'>) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    total: number;
};

const CartContext = createContext<CartContextType>({
    items: [],
    addItem: () => {},
    removeItem: () => {},
    clearCart: () => {},
    total: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    function addItem(item: Omit<CartItem, 'qty'>) {
        setItems((prev) => {
            const found = prev.find((i) => i.id === item.id);
            if (found)
                return prev.map((i) =>
                    i.id === item.id ? { ...i, qty: i.qty + 1 } : i
                );
            return [...prev, { ...item, qty: 1 }];
        });
    }

    function removeItem(id: string) {
        setItems((prev) => {
            const found = prev.find((i) => i.id === id);
            if (!found) return prev;
            if (found.qty === 1) return prev.filter((i) => i.id !== id);
            return prev.map((i) =>
                i.id === id ? { ...i, qty: i.qty - 1 } : i
            );
        });
    }

    function clearCart() {
        setItems([]);
    }

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, clearCart, total }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
