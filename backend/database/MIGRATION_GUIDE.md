# Supabase Migration Guide

## 🎯 Overview

This guide will help you complete the migration from MongoDB to Supabase PostgreSQL.

## ✅ Completed Steps

- [x] Created PostgreSQL schema (`backend/database/schema.sql`)
- [x] Installed `@supabase/supabase-js` package
- [x] Created Supabase configuration (`backend/config/supabase.js`)
- [x] Updated `.env.example` with Supabase variables

## 📋 Required Manual Steps

### Step 1: Run SQL Schema in Supabase

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open the file `backend/database/schema.sql`
5. Copy ALL the SQL code
6. Paste it into the Supabase SQL Editor
7. Click **Run** to execute the schema
8. Verify all tables were created in **Table Editor**

### Step 2: Create Storage Bucket for Product Images

1. In Supabase dashboard, go to **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Bucket name: `product-images`
4. Make it **Public** (check the public box)
5. Click **Create bucket**
6. Click on the bucket → **Policies**
7. Add these policies:
   - **SELECT**: Allow public read access
   - **INSERT**: Allow authenticated users (for admin uploads)
   - **DELETE**: Allow authenticated users (for admin)

### Step 3: Create .env File

1. In `backend` folder, create a new file named `.env`
2. Copy content from `.env.example`
3. Update these values:
   ```env
   SUPABASE_URL=https://ulopddoahcmklgdzewyp.supabase.co
   SUPABASE_SERVICE_KEY=your_actual_service_role_key_here
   SUPABASE_ANON_KEY=sb_publishable_SyfpszXXgEVFqiEu8tntkw_PBvx1-Xk
   ```

**Where to find your service role key:**
- Supabase Dashboard → Settings → API
- Scroll to "Project API keys"
- Click "Reveal" next to "service_role" key
- Copy and paste into `.env`

### Step 4: Install Dependencies

```bash
cd backend
npm install
```

## ⚠️ Important Notes

### About the Migration

This is a **partial migration**. I've created:
- ✅ Complete PostgreSQL schema
- ✅ Supabase configuration
- ✅ Updated dependencies

### What Still Needs to Be Done

Due to the size of this migration, the following files need to be updated to use PostgreSQL instead of MongoDB:

**Critical Files** (Need complete rewrite):
1. `controllers/authController.js` - Use Supabase Auth
2. `controllers/productController.js` - Use SQL queries
3. `controllers/adminController.js` - Use SQL queries
4. `controllers/cartController.js` - Use SQL queries
5. `controllers/orderController.js` - Use SQL queries
6. `middleware/auth.js` - Verify Supabase JWT
7. `middleware/upload.js` - Use Supabase Storage
8. `server.js` - Remove MongoDB connection

**Approach Options:**

### Option A: Continue Full Migration (Recommended)
I can continue rewriting all controllers and middleware to use Supabase. This will take significant time but will give you a fully functional Supabase-based backend.

### Option B: Hybrid Approach
Keep the current MongoDB backend running and create a new Supabase-based admin panel separately. This allows you to test Supabase without breaking existing functionality.

### Option C: Manual Migration
I provide you with example code for each controller, and you complete the migration at your own pace.

## 🚀 Next Steps

**Choose your preferred approach:**

1. **Full Migration**: I'll continue and rewrite all backend code for Supabase
2. **Stop Here**: You'll complete the migration manually using the schema and config I've created
3. **Hybrid**: Create a separate Supabase admin panel while keeping MongoDB for now

## 📊 Migration Progress

- [x] Database Schema (100%)
- [x] Configuration (100%)
- [ ] Authentication (0%)
- [ ] Product Management (0%)
- [ ] Cart & Orders (0%)
- [ ] File Upload (0%)
- [ ] Admin Panel Integration (0%)

## 🔗 Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

## ❓ Questions?

Let me know which approach you'd like to take, and I'll proceed accordingly!
