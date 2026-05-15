# Listing Creation & Booking Pages Implementation

## Overview
This document outlines the implementation of two key pages for the Airbnb-like booking platform:
1. **AddListingPage** - For hosts to create property listings
2. **BookingPage** - For guests to book properties

---

## AddListingPage (`/add-listing`)

### Features
- **Image Upload** with drag-and-drop support
- **Form Sections** organized by category (Basic Info, Property Details, Pricing, Amenities)
- **Role Protection** - Only hosts (role === 'HOST') can access
- **Image Validation** - File type and size checks (max 5MB, images only)
- **Real-time Preview** - Shows uploaded image before submission
- **Comprehensive Form Fields**:
  - Title (required)
  - Description (required)
  - Location (required)
  - Price per Night (required)
  - Max Guests (required)
  - Bedrooms (optional)
  - Bathrooms (optional)
  - Property Type (Apartment, House, Villa, Cabin)
  - Amenities (comma-separated)

### Form Validation
- All required fields must be filled
- Image must be a valid image file
- Image size must not exceed 5MB
- Form shows loading state during submission

### API Integration
- Uses `apiService.uploadAvatar()` to upload image to Cloudinary
- Uses `apiService.createListing()` to create listing with all details
- Automatically includes userId from authenticated user
- Redirects to home page on success

### User Flow
1. Host navigates to `/add-listing`
2. Fills in property details
3. Optionally uploads property image
4. Submits form
5. Image is uploaded to Cloudinary (if provided)
6. Listing is created in database
7. Redirected to home page with success message

---

## BookingPage (`/book/:id`)

### Features
- **Property Details Display** with image, description, and amenities
- **Sticky Booking Form** for easy access while scrolling
- **Date Selection** with validation (check-out must be after check-in)
- **Guest Selection** with max guest limit validation
- **Price Breakdown** showing:
  - Nightly rate × number of nights
  - Service fee (10% of subtotal)
  - Total price
- **Role Protection** - Only guests (role === 'GUEST') can book
- **Real-time Calculations** - Total price updates as dates change

### Form Validation
- Check-in and check-out dates are required
- Check-out date must be after check-in date
- Guest count cannot exceed property's max guests
- Minimum date is today (prevents past bookings)

### Property Information Displayed
- Title and location
- Property type and max guests
- Bedrooms and bathrooms (if available)
- Full description
- Amenities list with checkmarks
- Host information

### Price Calculation
```
Nights = (CheckOut - CheckIn) / 24 hours
Subtotal = Nightly Rate × Nights
Service Fee = Subtotal × 10%
Total = Subtotal + Service Fee
```

### API Integration
- Uses `apiService.getListingById()` to fetch property details
- Uses `apiService.createBooking()` to create booking
- Automatically includes userId from authenticated user
- Redirects to dashboard on success

### User Flow
1. Guest navigates to `/book/:id`
2. Views property details and amenities
3. Selects check-in and check-out dates
4. Selects number of guests
5. Reviews price breakdown
6. Confirms booking
7. Redirected to dashboard with confirmation message

---

## API Endpoints Used

### Listings
- `GET /listings/:id` - Fetch single listing details
- `POST /listings` - Create new listing

### Bookings
- `POST /bookings` - Create new booking

### File Upload
- `POST /users/upload-avatar` - Upload image to Cloudinary

---

## Database Schema

### Listing Model
```prisma
model Listing {
  id            String    @id @default(uuid())
  title         String
  description   String
  location      String
  pricePerNight Float
  guests        Int
  type          String
  amenities     String[]
  image         String?           // Added for property image
  bedrooms      Int?              // Added for property details
  bathrooms     Int?              // Added for property details
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  bookings      Booking[]
  reviews       Review[]
  createdAt     DateTime  @default(now())
}
```

### Booking Model
```prisma
model Booking {
  id        String   @id @default(uuid())
  userId    String
  listingId String
  checkIn   DateTime
  checkOut  DateTime
  guests    Int
  total     Float
  status    String   @default("confirmed")
  user      User     @relation(fields: [userId], references: [id])
  listing   Listing  @relation(fields: [listingId], references: [id])
  createdAt DateTime @default(now())
}
```

---

## Frontend Components

### AddListingPage
- **Location**: `src/pages/AddListingPage.tsx`
- **Route**: `/add-listing`
- **Protected**: Yes (HOST role required)
- **Dependencies**: 
  - `react-router-dom` for navigation
  - `react-hot-toast` for notifications
  - `useAuth` hook for authentication
  - `apiService` for API calls

### BookingPage
- **Location**: `src/pages/BookingPage.tsx`
- **Route**: `/book/:id`
- **Protected**: Yes (GUEST role required)
- **Dependencies**:
  - `react-router-dom` for navigation and params
  - `react-hot-toast` for notifications
  - `useAuth` hook for authentication
  - `apiService` for API calls

---

## Styling Approach
Both pages use inline styles with:
- Consistent color scheme (#ff385c for primary actions)
- Responsive grid layouts
- Proper spacing and typography
- Visual hierarchy with font sizes and weights
- Hover and disabled states for buttons
- Loading states with opacity changes

---

## Error Handling
- Network errors are caught and displayed as toast notifications
- Validation errors prevent form submission
- Missing required fields show error messages
- Invalid dates/guests show specific error messages
- Failed API calls show user-friendly error messages

---

## Future Enhancements
1. Add image gallery for multiple property photos
2. Implement booking cancellation
3. Add review system for completed bookings
4. Implement payment processing
5. Add calendar view for availability
6. Implement search and filter for listings
7. Add favorites/wishlist functionality
8. Implement messaging between hosts and guests
