/**
 * Theme Settings Model
 * Stores customizable theme settings for the website
 */

import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema(
    {
        // Header Settings
        header: {
            logo: {
                text: {
                    type: String,
                    default: 'GlowNature',
                },
                icon: {
                    type: String,
                    default: 'sparkles', // lucide-react icon name
                },
                image: {
                    url: String,
                    publicId: String,
                },
            },
            navigation: [
                {
                    label: String,
                    link: String,
                    order: Number,
                },
            ],
            backgroundColor: {
                type: String,
                default: '#ffffff',
            },
            textColor: {
                type: String,
                default: '#1f2937',
            },
        },

        // Website Favicon
        favicon: {
            url: String,
            publicId: String,
        },

        // Banner Section
        banner: {
            enabled: {
                type: Boolean,
                default: false,
            },
            text: {
                type: String,
                default: 'Special Offer: Get 20% off on your first order!',
            },
            buttonText: {
                type: String,
                default: 'Shop Now',
            },
            buttonLink: {
                type: String,
                default: '/products',
            },
            backgroundColor: {
                type: String,
                default: '#7c3aed',
            },
            textColor: {
                type: String,
                default: '#ffffff',
            },
        },

        // Hero/Main Section Settings
        hero: {
            title: {
                type: String,
                default: 'Radiant Skin',
            },
            subtitle: {
                type: String,
                default: 'Naturally Yours',
            },
            description: {
                type: String,
                default: 'Premium skincare crafted with nature\'s finest ingredients. Reveal your skin\'s natural glow.',
            },
            primaryButtonText: {
                type: String,
                default: 'Explore Products',
            },
            secondaryButtonText: {
                type: String,
                default: 'Find Your Routine',
            },
            backgroundGradient: {
                type: String,
                default: 'linear-gradient(135deg, #fef5f8 0%, #f0f4f8 100%)',
            },
        },

        // Hero Image
        heroImage: {
            url: String,
            publicId: String,
            alt: {
                type: String,
                default: 'Hero banner image',
            },
        },

        // Hero Stats (100% Natural, 50K+ Reviews, etc.)
        heroStats: [
            {
                value: String,
                label: String,
                icon: String,
                order: Number,
            },
        ],

        // Background Settings
        background: {
            color: {
                type: String,
                default: '#ffffff',
            },
            gradient: {
                type: String,
                default: 'linear-gradient(135deg, #fef5f8 0%, #f0f4f8 100%)',
            },
            useGradient: {
                type: Boolean,
                default: false,
            },
        },

        // TikTok Videos Section
        tiktokVideos: [
            {
                url: String,
                title: String,
                order: Number,
            },
        ],

        // Features Section
        features: [
            {
                icon: String, // lucide-react icon name
                title: String,
                description: String,
                order: Number,
            },
        ],

        // Footer Settings
        footer: {
            companyName: {
                type: String,
                default: 'GlowNature',
            },
            tagline: {
                type: String,
                default: 'Your premium destination for quality skincare products.',
            },
            socialLinks: {
                facebook: String,
                instagram: String,
                twitter: String,
                youtube: String,
            },
            contactEmail: {
                type: String,
                default: 'support@glownature.com',
            },
            contactPhone: {
                type: String,
                default: '(555) 123-4567',
            },
            backgroundColor: {
                type: String,
                default: '#1f2937',
            },
            textColor: {
                type: String,
                default: '#ffffff',
            },
        },

        // Color Scheme
        colors: {
            primary: {
                type: String,
                default: 'hsl(350, 35%, 75%)', // Rose
            },
            secondary: {
                type: String,
                default: 'hsl(270, 30%, 70%)', // Lavender
            },
            accent: {
                type: String,
                default: 'hsl(160, 35%, 75%)', // Mint
            },
        },

        // WhatsApp Settings
        whatsapp: {
            enabled: {
                type: Boolean,
                default: true,
            },
            phoneNumber: {
                type: String,
                default: '',
            },
            message: {
                type: String,
                default: 'Hi! I\'m interested in your product. Can you provide more details?',
            },
            buttonText: {
                type: String,
                default: 'Chat with us',
            },
        },

        // Checkout Settings
        checkout: {
            shippingPrice: {
                type: Number,
                default: 0,
            },
            fields: {
                name: {
                    enabled: { type: Boolean, default: true },
                    required: { type: Boolean, default: true },
                },
                email: {
                    enabled: { type: Boolean, default: true },
                    required: { type: Boolean, default: true },
                },
                phone: {
                    enabled: { type: Boolean, default: true },
                    required: { type: Boolean, default: true },
                },
                address: {
                    enabled: { type: Boolean, default: true },
                    required: { type: Boolean, default: true },
                },
                city: {
                    enabled: { type: Boolean, default: true },
                    required: { type: Boolean, default: false },
                },
                province: {
                    enabled: { type: Boolean, default: true },
                    required: { type: Boolean, default: false },
                },
                zipCode: {
                    enabled: { type: Boolean, default: true },
                    required: { type: Boolean, default: false },
                },
                country: {
                    enabled: { type: Boolean, default: true },
                    required: { type: Boolean, default: false },
                },
            },
        },

        // Active Status
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure only one active theme at a time
themeSchema.pre('save', async function (next) {
    if (this.isActive) {
        await mongoose.model('Theme').updateMany(
            { _id: { $ne: this._id } },
            { isActive: false }
        );
    }
    next();
});

const Theme = mongoose.model('Theme', themeSchema);

export default Theme;
