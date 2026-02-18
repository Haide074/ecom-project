# ShopVibe - Modern eCommerce Platform

A full-stack eCommerce platform built with the MERN stack (MongoDB, Express, React, Node.js) featuring a stunning, modern UI with premium design aesthetics.

## 🚀 Features

### Backend
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose ODM
- ✅ JWT authentication & authorization
- ✅ Role-based access control (Admin/Customer)
- ✅ Product management with variants & images
- ✅ Shopping cart functionality
- ✅ Order processing
- ✅ Coupon system
- ✅ Activity logging for admin actions
- ✅ Rate limiting & security middleware
- ✅ Input validation
- ✅ Error handling

### Frontend
- ✅ Modern React with Vite
- ✅ React Router for navigation
- ✅ Zustand for state management
- ✅ React Query for data fetching
- ✅ Framer Motion for animations
- ✅ Lucide React icons
- ✅ Responsive design
- ✅ Premium UI with gradients & glassmorphism
- ✅ Smooth animations & transitions

## 📁 Project Structure

```
web-project/
├── backend/
│   ├── config/          # Database & configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── seeders/         # Database seeders
│   ├── utils/           # Utility functions
│   ├── .env.example     # Environment variables template
│   ├── package.json
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── store/       # Zustand stores
    │   ├── App.jsx      # Main app component
    │   ├── index.css    # Global styles & design system
    │   └── main.jsx     # Entry point
    ├── .env             # Environment variables
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_ACCESS_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
# ... other variables
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already created with:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🎨 Design System

The project features a comprehensive design system with:

- **Color Palette**: Vibrant gradients and modern HSL colors
- **Typography**: Inter for body text, Playfair Display for headings
- **Spacing**: Consistent spacing scale
- **Components**: Reusable button, card, and input styles
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first responsive design

## 📝 Default Credentials

After seeding the database, you can use these credentials:

### Admin Account
- Email: `admin@store.com`
- Password: `Admin@123456`

### Test User Account
- Email: `john@example.com`
- Password: `User@123456`

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:slug` - Get product by slug
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/activity-logs` - Get activity logs

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Deploy the backend directory
3. Run database migrations/seeders

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable: `VITE_API_URL=your-backend-url`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 🎉 Acknowledgments

- Design inspiration from modern eCommerce platforms
- Icons from Lucide React
- Fonts from Google Fonts

---

**Built with ❤️ using the MERN stack**
