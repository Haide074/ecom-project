import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAdmin = create(
    persist(
        (set) => ({
            // Filters
            productFilters: {
                search: '',
                category: '',
                status: '',
                stockLevel: '', // low, medium, high
                priceRange: { min: '', max: '' },
            },

            orderFilters: {
                search: '',
                status: '',
                paymentStatus: '',
                dateRange: { start: '', end: '' },
            },

            // Preferences
            preferences: {
                itemsPerPage: 10,
                dashboardPeriod: 30,
                tableColumns: {
                    products: ['image', 'name', 'category', 'price', 'stock', 'status', 'featured', 'actions'],
                    orders: ['orderNumber', 'customer', 'amount', 'status', 'paymentStatus', 'date', 'actions'],
                },
            },

            // Actions
            setProductFilters: (filters) => set((state) => ({
                productFilters: { ...state.productFilters, ...filters },
            })),

            resetProductFilters: () => set({
                productFilters: {
                    search: '',
                    category: '',
                    status: '',
                    stockLevel: '',
                    priceRange: { min: '', max: '' },
                },
            }),

            setOrderFilters: (filters) => set((state) => ({
                orderFilters: { ...state.orderFilters, ...filters },
            })),

            resetOrderFilters: () => set({
                orderFilters: {
                    search: '',
                    status: '',
                    paymentStatus: '',
                    dateRange: { start: '', end: '' },
                },
            }),

            setPreferences: (prefs) => set((state) => ({
                preferences: { ...state.preferences, ...prefs },
            })),

            setTableColumns: (table, columns) => set((state) => ({
                preferences: {
                    ...state.preferences,
                    tableColumns: {
                        ...state.preferences.tableColumns,
                        [table]: columns,
                    },
                },
            })),
        }),
        {
            name: 'admin-storage',
        }
    )
);

export default useAdmin;
