import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (user, token) => set({ user, token, isAuthenticated: true }),

            logout: () => set({ user: null, token: null, isAuthenticated: false }),

            updateUser: (user) => set({ user }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find(item =>
                    (item.product._id === product._id && product._id) ||
                    (item.product.id === product.id && product.id)
                );

                if (existingItem) {
                    set({
                        items: items.map(item =>
                            ((item.product._id === product._id && product._id) ||
                                (item.product.id === product.id && product.id))
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, { product, quantity }] });
                }
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter(item =>
                        item.product._id !== productId && item.product.id !== productId
                    )
                });
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                } else {
                    set({
                        items: get().items.map(item =>
                            (item.product._id === productId || item.product.id === productId)
                                ? { ...item, quantity }
                                : item
                        ),
                    });
                }
            },

            clearCart: () => set({ items: [] }),

            getCartTotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                );
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            wishlist: [],

            toggleWishlist: (product) => {
                const currentWishlist = get().wishlist;
                const isItemInWishlist = currentWishlist.some(item =>
                    (item._id === product._id && product._id) ||
                    (item.id === product.id && product.id)
                );

                if (isItemInWishlist) {
                    set({
                        wishlist: currentWishlist.filter(item =>
                            item._id !== product._id && item.id !== product.id
                        )
                    });
                    return false; // Removed
                } else {
                    set({ wishlist: [...currentWishlist, product] });
                    return true; // Added
                }
            },

            isInWishlist: (productId) => {
                return get().wishlist.some(item =>
                    item._id === productId || item.id === productId
                );
            },

            clearWishlist: () => set({ wishlist: [] }),
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
