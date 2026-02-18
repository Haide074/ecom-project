# Media Library Upload Troubleshooting Guide

## Step-by-Step Debugging

### Step 1: Check if Backend Server is Running
The backend needs to restart to pick up the new routes. Check your backend terminal:
- You should see the server running
- Look for any error messages

**Action:** If you see errors, restart the backend:
```bash
# In backend terminal (Ctrl+C to stop, then)
npm run dev
```

### Step 2: Check Supabase Configuration

1. **Verify .env file** has the correct Supabase credentials:
   ```env
   SUPABASE_URL=https://ulopddoahcmklgdzewyp.supabase.co
   SUPABASE_SERVICE_KEY=sb_secret_N1b3f30sIshxtlEJDnBSPg_m89OAwya
   ```

2. **Check if bucket exists** in Supabase:
   - Go to https://app.supabase.com
   - Select your project
   - Go to Storage
   - **Look for a bucket called `product-images`**
   - If it doesn't exist, CREATE IT (see instructions below)

### Step 3: Create Supabase Storage Bucket (If Missing)

1. Go to Supabase Dashboard → Storage
2. Click "Create a new bucket"
3. Settings:
   - **Name**: `product-images` (EXACTLY this name)
   - **Public bucket**: ✅ **MUST CHECK THIS BOX**
   - Click "Create bucket"

4. **Set Bucket Policies** (IMPORTANT):
   - Click on the `product-images` bucket
   - Go to "Policies" tab
   - Click "New Policy" → "Create a custom policy"
   - Add these policies:

**Policy 1: Allow Public Read**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'product-images' );
```

**Policy 2: Allow Public Insert** (for file upload)
```sql
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'product-images' );
```

**Policy 3: Allow Public Delete**
```sql
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id = 'product-images' );
```

### Step 4: Test the Upload with Browser Console

1. Open Admin Panel → Media Library
2. Open Browser Developer Tools (F12)
3. Go to "Console" tab
4. Try uploading an image
5. **Look for these logs**:

**Expected Console Output:**
```
📤 Starting upload of 1 files
Adding file: myimage.jpg Size: 123456 Type: image/jpeg
🚀 Sending request to: http://localhost:5000/api/media/upload
✅ Upload response: {success: true, message: "1 image(s) uploaded successfully", ...}
📥 Fetching images from Supabase
📋 Found X files
✅ Returning X images
```

**If you see errors, they will tell you what's wrong!**

### Step 5: Check Backend Terminal Logs

When you upload, the backend terminal should show:
```
📤 Upload request received
📁 Processing 1 file(s)
⬆️ Uploading: myimage.jpg as media/xxx-xxx-xxx.jpg
✅ Uploaded: media/xxx-xxx-xxx.jpg
✅ Successfully uploaded 1 image(s)
```

**Common Error Messages:**

#### Error: "Bucket not found"
- **Problem**: The `product-images` bucket doesn't exist in Supabase
- **Solution**: Create it (see Step 3)

#### Error: "new row violates row-level security policy"
- **Problem**: Bucket policies are not set correctly
- **Solution**: Add the policies (see Step 3)

#### Error: "Supabase storage is not configured"
- **Problem**: Supabase credentials are missing or wrong
- **Solution**: Check .env file (see Step 2)

#### Error: "Failed to upload images"
- **Problem**: Multiple possible causes
- **Solution**: Check browser console for detailed error

### Step 6: Verify the API Endpoint

Open a new terminal and test the endpoint:
```bash
curl http://localhost:5000/api/media
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "images": [],
    "count": 0
  }
}
```

If you get a 404 error, the routes aren't registered. Restart the backend.

### Step 7: Manual File Upload Test

Create a test file to verify everything works:

**test-upload.html** (save anywhere and open in browser):
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Upload</title>
</head>
<body>
    <h1>Media Upload Test</h1>
    <input type="file" id="fileInput" multiple accept="image/*">
    <button onclick="upload()">Upload</button>
    <div id="result"></div>

    <script>
        async function upload() {
            const files = document.getElementById('fileInput').files;
            const formData = new FormData();
            
            for (let file of files) {
                formData.append('images', file);
            }

            try {
                const response = await fetch('http://localhost:5000/api/media/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                document.getElementById('result').innerHTML = JSON.stringify(data, null, 2);
                console.log('Response:', data);
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('result').innerHTML = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>
```

## Quick Checklist

- [ ] Backend server is running
- [ ] Supabase bucket `product-images` exists
- [ ] Bucket is set to **Public**
- [ ] Bucket policies are configured
- [ ] .env has correct Supabase credentials
- [ ] Browser console shows upload logs
- [ ] Backend terminal shows upload logs
- [ ] No CORS errors in console

## What to Share for Help

If still not working, share:
1. **Browser console logs** (when uploading)
2. **Backend terminal output** (when uploading)
3. **Screenshot of Supabase Storage** (showing buckets)
4. **Error messages** (exact text)

## Most Common Issue

**99% of the time, the issue is:**
1. The `product-images` bucket doesn't exist in Supabase
2. OR the bucket is not set to Public
3. OR the policies are not configured

**Solution:** Follow Step 3 carefully!
