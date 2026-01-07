import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCart = create(
    persist(
        (set, get) => ({
            items: [],

            // Add item to cart
            addItem: (product, quantity = 1) => {
                const items = get().items;
                const existingItemIndex = items.findIndex(
                    item => item.product._id === product._id || item.product.id === product.id
                );

                if (existingItemIndex > -1) {
                    // Update quantity if item already exists
                    const newItems = [...items];
                    newItems[existingItemIndex].quantity += quantity;
                    set({ items: newItems });
                } else {
                    // Add new item
                    set({
                        items: [...items, {
                            product,
                            quantity
                        }]
                    });
                }
            },

            // Update item quantity
            updateQuantity: (productId, quantity) => {
                const items = get().items;
                const newItems = items.map(item => {
                    if (item.product._id === productId || item.product.id === productId) {
                        return { ...item, quantity: Math.max(1, quantity) };
                    }
                    return item;
                });
                set({ items: newItems });
            },

            // Remove item from cart
            removeItem: (productId) => {
                const items = get().items;
                set({
                    items: items.filter(
                        item => item.product._id !== productId && item.product.id !== productId
                    )
                });
            },

            // Clear cart
            clearCart: () => {
                set({ items: [] });
            },

            // Get cart totals
            getCartTotal: () => {
                const items = get().items;
                return items.reduce((total, item) => {
                    return total + (item.product.price * item.quantity);
                }, 0);
            },

            // Get total items count
            getItemsCount: () => {
                const items = get().items;
                return items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);

export default useCart;
