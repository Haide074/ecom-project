import { create } from 'zustand';

const useToast = create((set) => ({
    toasts: [],

    addToast: (toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: toast.type || 'info', // success, error, warning, info
            message: toast.message,
            duration: toast.duration || 3000,
        };

        set((state) => ({
            toasts: [...state.toasts, newToast],
        }));

        // Auto remove after duration
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }));
        }, newToast.duration);

        return id;
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    },

    // Helper methods
    success: (message, duration) => {
        return useToast.getState().addToast({ type: 'success', message, duration });
    },

    error: (message, duration) => {
        return useToast.getState().addToast({ type: 'error', message, duration });
    },

    warning: (message, duration) => {
        return useToast.getState().addToast({ type: 'warning', message, duration });
    },

    info: (message, duration) => {
        return useToast.getState().addToast({ type: 'info', message, duration });
    },
}));

export default useToast;
