# Quick Setup - Avatar Upload

## What's New
✅ Users can upload profile pictures from local device
✅ Images automatically saved to Cloudinary
✅ Avatar preview in profile page
✅ Avatar appears in navbar profile menu

## Installation

### Backend
```bash
cd airbnb-api
npm install
npm run dev
```

### Frontend
```bash
cd airbnb-ui
npm run dev
```

## Test It Out

1. **Sign up** at `http://localhost:5173/signup`
2. **Go to profile** at `http://localhost:5173/profile`
3. **Upload avatar**:
   - Click "Choose File"
   - Select an image (JPG, PNG, GIF)
   - Wait for upload
   - See preview
   - Click "Save Changes"
4. **Verify**:
   - Avatar shows in profile page
   - Avatar shows in navbar (top right)
   - Avatar persists after refresh

## Files Changed

### Frontend
- `src/api.ts` - Added uploadAvatar method
- `src/pages/ProfilePage.tsx` - Added file upload UI

### Backend
- `package.json` - Added multer, cloudinary
- `src/config/cloudinary.ts` - Cloudinary setup
- `src/config/multer.ts` - Multer setup
- `src/controllers/users.controller.ts` - Added uploadAvatar endpoint
- `src/routes/v1/users.routes.ts` - Added upload route

## Cloudinary Credentials
Your `.env` already has:
```
CLOUDINARY_CLOUD_NAME=daclsmxjn
CLOUDINARY_API_KEY=635674611814717
CLOUDINARY_API_SECRET=-oxNwP3b3M35gIx7yyYZlg-ChPI
```

## Troubleshooting

**Upload fails?**
- Check backend is running on port 5000
- Check Cloudinary credentials in `.env`
- Check browser console for errors

**Image not showing?**
- Refresh page
- Check Cloudinary URL in browser console
- Verify image uploaded to Cloudinary dashboard

**File too large?**
- Maximum 5MB
- Compress image first
- Try smaller image

## Next Steps
- Add image cropping
- Add drag & drop upload
- Add image gallery for listings
