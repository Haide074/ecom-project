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
            image: {
                url: String,
                publicId: String,
                alt: {
                    type: String,
                    default: 'Banner image',
                },
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
            primaryButtonLink: {
                type: String,
                default: '/products',
            },
            secondaryButtonText: {
                type: String,
                default: 'Find Your Routine',
            },
            secondaryButtonLink: {
                type: String,
                default: '/products',
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
                default: 'Hero image',
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
                image: {
                    url: String,
                    publicId: String,
                    alt: String,
                },
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
            contactAddress: {
                type: String,
                default: '123 Skincare Ave, Beauty City, BC 12345',
            },
            quickLinks: [
                {
                    label: String,
                    link: String,
                },
            ],
            customerService: [
                {
                    label: String,
                    link: String,
                },
            ],
            backgroundColor: {
                type: String,
                default: '#1f2937',
            },
            textColor: {
                type: String,
                default: '#ffffff',
            },
        },

        // About Page Template
        about: {
            title: {
                type: String,
                default: 'About GlowNature',
            },
            subtitle: {
                type: String,
                default: 'Our Story & Mission',
            },
            content: {
                type: String,
                default: 'Founded with a passion for natural beauty, GlowNature brings you the finest skincare products crafted with pure ingredients.',
            },
            image: {
                url: String,
                publicId: String,
            },
            visionTitle: {
                type: String,
                default: 'Our Vision',
            },
            visionContent: {
                type: String,
                default: 'To empower natural beauty through sustainable and effective skincare solutions.',
            },
            stats: [
                {
                    label: String,
                    value: String,
                },
            ],
            team: [
                {
                    name: String,
                    role: String,
                    image: {
                        url: String,
                        publicId: String,
                    },
                },
            ],
            values: [
                {
                    icon: String,
                    title: String,
                    description: String,
                },
            ],
        },

        // Contact Page Template
        contact: {
            title: {
                type: String,
                default: 'Contact Us',
            },
            subtitle: {
                type: String,
                default: 'Get in Touch',
            },
            description: {
                type: String,
                default: 'We\'d love to hear from you. Reach out to us with any questions about our products or your orders.',
            },
            email: {
                type: String,
                default: '',
            },
            phone: {
                type: String,
                default: '',
            },
            address: {
                type: String,
                default: '',
            },
            mapUrl: {
                type: String,
                default: '',
            },
            showBusinessHours: {
                type: Boolean,
                default: true,
            },
            businessHours: [
                {
                    day: String,
                    time: String,
                },
            ],
            trustBadges: [
                {
                    icon: String,
                    text: String,
                },
            ],
            quickActions: [
                {
                    icon: String,
                    label: String,
                    link: String,
                },
            ],
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

        // Homepage Settings
        homepage: {
            featuredProductsCount: {
                type: Number,
                default: 8,
            },
            showFeaturedProducts: {
                type: Boolean,
                default: true,
            },
        },

        // Product Grid Settings
        productGrid: {
            pcPerRow: {
                type: Number,
                default: 4,
            },
            mobilePerRow: {
                type: Number,
                default: 2,
            },
        },

        // CTA Section Settings
        cta: {
            enabled: {
                type: Boolean,
                default: true,
            },
            title: {
                type: String,
                default: 'Begin Your Glow Journey',
            },
            description: {
                type: String,
                default: 'Join thousands who’ve discovered their perfect skincare routine. Natural beauty starts here.',
            },
            buttonText: {
                type: String,
                default: 'Shop Collection',
            },
            buttonLink: {
                type: String,
                default: '/products',
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
