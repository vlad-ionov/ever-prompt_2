# Avatar & Logout Fix

## Issues Fixed

### 1. Avatar Image Not Updating
**Problem:** Avatar images stored in Supabase weren't being displayed after upload.

**Solution:** 
- Updated `app/routes/api.auth.profile.ts` to use Supabase Admin API to update user metadata
- Changed avatar upload to store images as base64 strings in user metadata
- Now uses `user_metadata.avatar_url` to store the image data

### 2. Logout Redirect
**Problem:** After logout, users weren't redirected to the landing page.

**Solution:** 
- Updated `app/contexts/AuthContext.tsx` to add `window.location.href = "/"` after signOut
- Now automatically redirects to the landing page after successful logout

## Files Modified

1. **app/routes/api.auth.profile.ts**
   - Now uses Admin API with service role key to update user metadata
   - Properly fetches updated user data after metadata update

2. **app/contexts/AuthContext.tsx**
   - Added redirect to home page after logout
   - Redirect happens after session is cleared

3. **app/components/UserSettingsDialog.tsx**
   - Changed avatar upload to use base64 encoding instead of edge function
   - Stores image directly in user metadata as base64 string
   - Simpler and more reliable than file upload service

## How Avatar Works Now

1. User uploads image (max 2MB, image files only)
2. Image is converted to base64 string
3. Base64 string is stored in `user_metadata.avatar_url` via Admin API
4. Profile is refreshed to show new avatar
5. Avatar displays using the base64 data URI

## Testing

1. Go to Settings
2. Click "Upload Photo"
3. Select an image file
4. Avatar should update immediately
5. Logout should redirect to landing page (/)

