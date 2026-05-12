# Avatar Upload to Cloudinary

## Overview
Users can now upload profile pictures directly from their local device. Images are automatically uploaded to Cloudinary and the URL is saved to the database.

## Features Implemented

### Frontend
- File input for selecting images from local device
- Image preview before saving
- File validation:
  - Only image files allowed (JPG, PNG, GIF, etc.)
  - Maximum file size: 5MB
- Upload progress indicator
- Error handling with toast notifications
- Automatic avatar update in profile

### Backend
- Multer middleware for file handling
- Cloudinary integration for image storage
- Automatic image optimization
- Secure file upload with authentication
- Error handling and validation

## Setup Instructions

### 1. Install Dependencies
```bash
cd airbnb-api
npm install
```

This will install:
- `multer` - File upload middleware
- `cloudinary` - Image hosting service

### 2. Verify Cloudinary Credentials
Make sure your `.env` file has:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

You already have these configured!

### 3. Restart Backend
```bash
npm run dev
```

## How to Use

### Upload Avatar
1. Go to `/profile` page
2. Click "Choose File" in the Profile Picture section
3. Select an image from your device
4. Wait for upload to complete (shows "Uploading...")
5. Preview appears automatically
6. Click "Save Changes" to save profile

### File Requirements
- **Formats**: JPG, PNG, GIF, WebP, etc.
- **Max Size**: 5MB
- **Recommended**: Square images (1:1 ratio) for best appearance

## API Endpoint

### Upload Avatar
```
POST /api/v1/users/upload-avatar
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- file: <image file>

Response:
{
  "message": "Avatar uploaded successfully",
  "url": "https://res.cloudinary.com/..."
}
```

## Technical Details

### Frontend Flow
1. User selects file
2. Frontend validates file type and size
3. File is sent to backend via FormData
4. Backend uploads to Cloudinary
5. Cloudinary URL is returned
6. Frontend displays preview
7. User saves profile with new avatar URL

### Backend Flow
1. Multer receives file in memory
2. File is validated (type, size)
3. File buffer is streamed to Cloudinary
4. Cloudinary returns secure URL
5. URL is returned to frontend
6. Frontend saves URL to database via updateProfile

### Cloudinary Storage
- Folder: `airbnb/avatars`
- Public ID: `avatar_{userId}_{timestamp}`
- Automatic optimization and CDN delivery

## Error Handling

### Frontend Errors
- "Please select an image file" - Non-image file selected
- "File size must be less than 5MB" - File too large
- "Failed to upload avatar" - Server error

### Backend Errors
- 401 Unauthorized - No authentication token
- 400 Bad Request - No file provided
- 500 Server Error - Cloudinary upload failed

## Security Features
- Authentication required for upload
- File type validation (images only)
- File size limit (5MB)
- Secure Cloudinary credentials
- CORS enabled for frontend

## Testing

1. **Sign up** and create account
2. **Go to profile** (`/profile`)
3. **Upload avatar**:
   - Try valid image (JPG, PNG)
   - Try invalid file (PDF, text)
   - Try large file (>5MB)
4. **Verify upload**:
   - Preview shows image
   - Image persists after page refresh
   - Image appears in navbar profile menu

## Troubleshooting

### Upload fails with 500 error
- Check Cloudinary credentials in `.env`
- Verify CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET
- Check backend console for detailed error

### Image not showing after upload
- Check browser console for errors
- Verify Cloudinary URL is valid
- Check CORS settings

### File size error
- Maximum is 5MB
- Compress image before uploading
- Use online image compressor

## Future Enhancements
- Drag and drop file upload
- Image cropping before upload
- Multiple image upload
- Image gallery for listings
- Automatic image optimization
