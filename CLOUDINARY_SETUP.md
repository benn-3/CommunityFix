# Cloudinary Image Upload Setup

## 📸 How to Configure Cloudinary

Cloudinary is now integrated for direct image uploads. Follow these steps to set it up:

### 1. Create a Cloudinary Account
1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. After signing in, you'll be taken to your dashboard

### 2. Get Your Credentials
On your Cloudinary dashboard, you'll find:
- **Cloud Name**
- **API Key**
- **API Secret**

### 3. Add Credentials to .env File
In `server/.env`, add these lines:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Replace the placeholder values with your actual Cloudinary credentials.

### 4. Restart the Server
After adding the credentials, restart your server:
```bash
npm run dev
```

## 🎯 Features Implemented

### For Users:
- **Drag & Drop Upload**: Users can drag and drop images or click to browse
- **Multiple Images**: Upload up to 5 images per issue
- **Image Preview**: See thumbnails before submitting
- **File Validation**: Only accepts JPEG, PNG, GIF, WebP (max 5MB each)
- **Auto Upload**: Images are uploaded to Cloudinary automatically
- **Remove Images**: Click the X button to remove unwanted images

### Technical Details:
- Images are stored in Cloudinary's `communityfix` folder
- Automatic image optimization (max 1000x1000px)
- Secure uploads with authentication required
- Memory-efficient streaming upload

## 🔒 Security
- Only authenticated users can upload images
- File type validation on both client and server
- File size limits enforced
- Cloudinary credentials stored securely in environment variables

## 📝 API Endpoints
- `POST /upload/upload` - Upload single image
- `POST /upload/upload-multiple` - Upload multiple images (max 5)

Both endpoints require authentication and return the Cloudinary URL(s).
