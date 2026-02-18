# Supabase Storage Setup Guide

## Quick Setup for Hybrid Approach

You're using **MongoDB for data** and **Supabase Storage for images**. This is the best of both worlds!

## ✅ What's Been Done

- [x] Kept MongoDB for all structured data (users, products, orders, etc.)
- [x] Added Supabase client for storage only
- [x] Created storage helper (`backend/config/storage.js`)
- [x] Updated product controller to use Supabase Storage
- [x] Updated environment configuration

## 📋 Setup Steps

### Step 1: Create Supabase Storage Bucket

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Storage** (left sidebar)
4. Click **Create a new bucket**
5. Settings:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Check this box
   - Click **Create bucket**

### Step 2: Configure Bucket Policies

1. Click on the `product-images` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Add these policies:

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
```

**Policy 3: Authenticated Delete**
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
```

### Step 3: Create .env File

1. In `backend` folder, create `.env` file
2. Add your credentials:

```env
# Server
NODE_ENV=development
PORT=5000

# MongoDB (local or Atlas)
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Supabase Storage (for images only)
SUPABASE_URL=https://ulopddoahcmklgdzewyp.supabase.co
SUPABASE_SERVICE_KEY=your_actual_service_role_key_here
SUPABASE_ANON_KEY=sb_publishable_SyfpszXXgEVFqiEu8tntkw_PBvx1-Xk

# JWT
JWT_ACCESS_SECRET=dev_secret_key_12345
JWT_REFRESH_SECRET=dev_refresh_key_67890
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:5173
```

**Get your service role key:**
- Supabase Dashboard → Settings → API
- Find "service_role" key
- Click "Reveal" and copy it

### Step 4: Install Dependencies & Start

```bash
cd backend
npm install
npm start
```

## 🎯 How It Works

- **MongoDB**: Stores all data (users, products, orders, categories, etc.)
- **Supabase Storage**: Stores only files (product images, banners, etc.)
- **No database migration needed** - your existing MongoDB models work as-is!

## ✨ Benefits

✅ Keep your existing MongoDB setup
✅ Get reliable, fast image storage from Supabase
✅ No complex migration
✅ Best of both worlds!

## 🚀 Next Steps

1. Complete the 3 setup steps above
2. Start your backend: `npm start`
3. Test image uploads in the admin panel
4. Images will be stored in Supabase, data in MongoDB!
