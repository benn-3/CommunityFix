# Troubleshooting Guide

## Dashboard Issues

### Problem: Dashboard not working for all three roles

**Possible causes:**
1. **No data in database** - The dashboards need issues to display
2. **API errors** - Check browser console (F12) for errors
3. **Authentication issues** - User not properly logged in

**Solutions:**

#### 1. Check Browser Console
Press `F12` and look at the Console tab for any red errors.

#### 2. Verify You're Logged In
- Check if you see your name/email in the sidebar
- Try logging out and logging back in

#### 3. Create Test Data
If dashboards are empty:
1. Login as a **Citizen**
2. Go to `/report` and create a test issue
3. Add a title, description, and category
4. Submit

#### 4. Check Each Dashboard:

**Citizen Dashboard (`/dashboard`):**
- Should show: Open Issues, In Progress, Resolved counts
- Should list recent issues

**Worker Dashboard (`/worker`):**
- Shows only issues assigned to you
- If empty, ask an admin to assign you an issue
- Can update status and add resolution notes

**Admin Dashboard (`/admin`):**
- Has 4 tabs: Overview, Issues, Workers, Categories
- Overview shows analytics
- Issues tab lets you approve/reject/assign
- Workers tab shows all workers
- Categories tab manages issue categories

---

## Image Display Issues

### Problem: Images not showing

**Possible causes:**
1. **Cloudinary not configured** - Check `.env` file
2. **Invalid image URLs** - Images uploaded before Cloudinary setup
3. **CORS issues** - Cloudinary blocking requests

**Solutions:**

#### 1. Verify Cloudinary Setup
Check `server/.env` has:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 2. Test Image Upload
1. Go to `/report`
2. Try uploading a new image
3. Check browser console for upload errors
4. Submit the issue
5. View the issue detail page - image should appear

#### 3. Check Cloudinary Dashboard
1. Go to [https://cloudinary.com/console](https://cloudinary.com/console)
2. Look for `communityfix` folder
3. Verify images are there

#### 4. Check Browser Console
When viewing an issue with images:
- Press F12
- Look for "Image failed to load" messages
- Check the image URL in the error

---

## Quick Diagnostic Steps

### Step 1: Check if server is running
- Server terminal should show: `Server running on port 5000`
- No errors about MongoDB connection

### Step 2: Check if client is running  
- Client terminal should show: `Local: http://localhost:5174/`
- No compilation errors

### Step 3: Test the flow
1. **Register** a new user (any role)
2. **Login** with those credentials
3. **Navigate** to appropriate dashboard
4. **Check console** for errors (F12)

### Step 4: Check MongoDB
- Ensure MongoDB is running
- Check connection string in `.env`

---

## Common Error Messages

### "Failed to load resource: 400"
- Invalid credentials or missing data
- Check what you're sending vs what API expects

### "Failed to load resource: 401"  
- Not authenticated
- Login again

### "Failed to load resource: 403"
- Wrong role (e.g., trying to access admin page as citizen)
- Login with correct role

### "Failed to load resource: 500"
- Server error
- Check server terminal for stack trace

### "Network Error"
- Server not running
- Wrong API URL
- CORS issue

---

## Need More Help?

Share:
1. **Browser console errors** (F12 → Console tab)
2. **Server terminal output** (any errors shown)
3. **What you're trying to do** (e.g., "viewing admin dashboard")
4. **Your user role** (citizen/worker/admin)
