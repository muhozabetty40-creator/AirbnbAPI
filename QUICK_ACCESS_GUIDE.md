# Quick Access Guide - Listing & Booking Pages

## ✅ Files Created/Updated

### Pages Created
1. **AddListingPage** - `src/pages/AddListingPage.tsx`
   - Route: `/add-listing`
   - For: Hosts only
   - Features: Image upload, form validation, property details

2. **BookingPage** - `src/pages/BookingPage.tsx`
   - Route: `/book/:id`
   - For: Guests only
   - Features: Date selection, price breakdown, booking confirmation

### Files Updated
1. **App.tsx** - Added routes for both pages
2. **DashboardPage.tsx** - Fixed "Add listing" button to point to `/add-listing`
3. **Navbar.tsx** - Already has "Add Listing" in profile dropdown (for hosts)
4. **api.ts** - Extended createListing method to support new fields

---

## 🚀 How to Access

### Add Listing Page (For Hosts)
**Option 1: From Dashboard**
- Go to Dashboard
- Click "Add listing" in the sidebar

**Option 2: From Navbar**
- Click profile icon (top right)
- Click "Add Listing" (only visible for hosts)

**Option 3: Direct URL**
- Navigate to: `http://localhost:5173/add-listing`

### Booking Page (For Guests)
**Option 1: From Listings**
- Browse listings on home page
- Click on a listing
- Click "Book Now" button (if available)

**Option 2: Direct URL**
- Navigate to: `http://localhost:5173/book/{listingId}`

---

## 📋 Form Fields

### Add Listing Form
**Required Fields:**
- Title
- Description
- Location
- Price per Night
- Max Guests

**Optional Fields:**
- Property Image (drag & drop)
- Bedrooms
- Bathrooms
- Property Type (Apartment, House, Villa, Cabin)
- Amenities (comma-separated)

### Booking Form
**Required Fields:**
- Check-in Date
- Check-out Date
- Number of Guests

**Auto-calculated:**
- Total Price (with 10% service fee)
- Number of Nights

---

## 🔐 Role-Based Access

### Add Listing Page
- ✅ Accessible by: **HOST** role only
- ❌ Guests see: "Access Denied" message with link to profile

### Booking Page
- ✅ Accessible by: **GUEST** role only
- ❌ Hosts see: Error message redirecting to home

---

## 🎨 UI Features

### AddListingPage
- Organized form sections with visual hierarchy
- Drag-and-drop image upload with preview
- Image validation (max 5MB, images only)
- Loading states during submission
- Cancel button for easy exit
- Toast notifications for success/errors

### BookingPage
- Property details display with image
- Sticky booking form (stays visible while scrolling)
- Real-time price calculations
- Date validation (check-out after check-in)
- Guest count validation
- Price breakdown showing:
  - Nightly rate × nights
  - Service fee (10%)
  - Total price
- Minimum date set to today (prevents past bookings)

---

## 🔗 API Endpoints Used

### Listings
- `POST /listings` - Create new listing
- `GET /listings/:id` - Get listing details

### Bookings
- `POST /bookings` - Create new booking

### File Upload
- `POST /users/upload-avatar` - Upload image to Cloudinary

---

## ✨ Testing Checklist

- [ ] Host can access `/add-listing`
- [ ] Host can upload property image
- [ ] Host can fill and submit listing form
- [ ] Listing appears on home page after creation
- [ ] Guest can access `/book/:id`
- [ ] Guest can select dates and guests
- [ ] Price calculates correctly
- [ ] Guest can submit booking
- [ ] Booking appears in dashboard
- [ ] Non-hosts see access denied on `/add-listing`
- [ ] Non-guests see error on `/book/:id`

---

## 🐛 Troubleshooting

**"Add Listing button not working?"**
- Make sure you're logged in as a HOST
- Check that you're on the Dashboard or Navbar profile menu
- Try direct URL: `/add-listing`

**"Can't book a property?"**
- Make sure you're logged in as a GUEST
- Check that you have a valid listing ID
- Try direct URL: `/book/{listingId}`

**"Image upload failing?"**
- Check file size (max 5MB)
- Ensure it's an image file (jpg, png, etc.)
- Check Cloudinary credentials in backend .env

**"Booking not saving?"**
- Verify all required fields are filled
- Check that check-out date is after check-in
- Check guest count doesn't exceed property max
- Check browser console for error messages

---

## 📝 Notes

- Both pages are fully protected with role-based access
- Images are uploaded to Cloudinary
- Prices are calculated in real-time
- All forms have validation
- Toast notifications provide user feedback
- Pages are responsive and mobile-friendly
