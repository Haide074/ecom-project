/**
 * useTheme Hook
 * Fetches and applies theme settings dynamically
 */

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useTheme = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['theme'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/theme`);
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const theme = data?.data?.theme;

    // Apply theme colors to CSS variables
    useEffect(() => {
        if (theme) {
            applyTheme(theme);
        }
    }, [theme]);

    const applyTheme = (themeData) => {
        if (!themeData) return;

        const root = document.documentElement;

        // Apply colors
        if (themeData.colors) {
            if (themeData.colors.primary) {
                root.style.setProperty('--color-primary', themeData.colors.primary);
            }
            if (themeData.colors.secondary) {
                root.style.setProperty('--color-secondary', themeData.colors.secondary);
            }
            if (themeData.colors.accent) {
                root.style.setProperty('--color-accent', themeData.colors.accent);
            }
        }

        // Apply background
        if (themeData.background) {
            if (themeData.background.useGradient && themeData.background.gradient) {
                root.style.setProperty('--bg-main', themeData.background.gradient);
            } else if (themeData.background.color) {
                root.style.setProperty('--bg-main', themeData.background.color);
            }
        }

        // Apply header colors
        if (themeData.header) {
            if (themeData.header.backgroundColor) {
                root.style.setProperty('--header-bg', themeData.header.backgroundColor);
            }
            if (themeData.header.textColor) {
                root.style.setProperty('--header-text', themeData.header.textColor);
            }
        }

        // Apply footer colors
        if (themeData.footer) {
            if (themeData.footer.backgroundColor) {
                root.style.setProperty('--footer-bg', themeData.footer.backgroundColor);
            }
            if (themeData.footer.textColor) {
                root.style.setProperty('--footer-text', themeData.footer.textColor);
            }
        }
    };

    return {
        theme,
        isLoading,
        error,
        refetch,
        applyTheme,
    };
};

export default useTheme;
