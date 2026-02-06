# 🔐 Authentication Setup Guide

## Overview
Your Patient Tracker now has login functionality to protect patient data!

## Setup Instructions

### 1. Environment Variables
The authentication credentials are stored in `.env.local` file (already created).

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT:** Change these credentials before deploying to production!

### 2. How to Change Credentials

Edit the `.env.local` file:
```env
ADMIN_USERNAME=your-username-here
ADMIN_PASSWORD=your-secure-password-here
```

### 3. Security Notes

- The `.env.local` file is **NOT** committed to Git (it's in .gitignore)
- Generate a strong `NEXTAUTH_SECRET` for production
- Use a strong password (mix of letters, numbers, and symbols)
- Never share your `.env.local` file

### 4. How It Works

1. **Login Page**: Users must login at `/login` before accessing patient data
2. **Protected Routes**: All pages except login require authentication
3. **Session**: Users stay logged in for 24 hours
4. **Logout**: Click the 🚪 Logout button in the navigation

### 5. Testing

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. You'll be redirected to the login page
4. Login with the default credentials
5. Access all patient data securely!

### 6. For Production Deployment

Before deploying to Vercel or other platforms:

1. **Generate a secure NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
   Or visit: https://generate-secret.vercel.app/32

2. **Add environment variables** in your hosting platform:
   - `NEXTAUTH_URL` - Your production URL
   - `NEXTAUTH_SECRET` - Generated secret
   - `ADMIN_USERNAME` - Your chosen username
   - `ADMIN_PASSWORD` - Your secure password

3. **Consider using a database** for user management in production instead of environment variables

## Features Implemented

✅ Login page with colorful dental theme
✅ Session management (24-hour sessions)
✅ Auto-redirect to login if not authenticated
✅ Logout functionality
✅ Protected routes
✅ Toast notifications for login success/failure
✅ Loading states

## Future Enhancements

Consider adding:
- Multiple user support with a database
- Password reset functionality
- User profile management
- Role-based access (admin, viewer, etc.)
- Two-factor authentication

---

Need help? Check the NextAuth.js documentation: https://next-auth.js.org/
