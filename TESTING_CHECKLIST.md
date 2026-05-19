# Quick Testing Checklist

## 🧪 Testing Instructions

### Prerequisites
1. Backend running on `http://localhost:5000`
2. Frontend running on `http://localhost:5173`
3. Database seeded with test data

---

## 🔐 Authentication Testing

### Login
- [ ] Navigate to `/login`
- [ ] Enter valid credentials
- [ ] Verify redirect to home page
- [ ] Check token stored in localStorage
- [ ] Verify user info displayed in navbar

### Sign Up
- [ ] Navigate to `/signup`
- [ ] Fill form with new user details
- [ ] Select role (GUEST/HOST)
- [ ] Submit form
- [ ] Verify redirect to login
- [ ] Login with new credentials

### Logout
- [ ] Click profile avatar in navbar
- [ ] Click "Logout"
- [ ] Verify redirect to login page
- [ ] Verify token removed from localStorage

---

## 🏠 Home Page Testing

- [ ] Navigate to `/`
- [ ] Verify listings displayed
- [ ] Verify orange color scheme
- [ ] Check responsive design on mobile
- [ ] Verify dark mode toggle works
- [ ] Check navigation menu

---

## 📋 Listings Page Testing

### Browse Listings
- [ ] Navigate to `/listings`
- [ ] Verify all listings load
- [ ] Check pagination works
- [ ] Verify search functionality
- [ ] Check filters work

### Listing Detail
- [ ] Click on any listing
- [ ] Verify listing details display
- [ ] Check image loads
- [ ] Verify amenities list
- [ ] Check property details (beds, baths, guests)

### Guest Booking Form
- [ ] Login as GUEST
- [ ] Click on listing
- [ ] Verify booking form displays
- [ ] Fill check-in date
- [ ] Fill check-out date
- [ ] Select guest count
- [ ] Verify price calculation
- [ ] Click "Confirm Booking"
- [ ] Verify booking created

### Host Restriction
- [ ] Login as HOST
- [ ] Click on own listing
- [ ] Verify booking form NOT displayed
- [ ] Verify message "Only guests can book listings"

### Admin Restriction
- [ ] Login as ADMIN
- [ ] Click on any listing
- [ ] Verify booking form NOT displayed

---

## ➕ Add Listing Testing (Host Only)

- [ ] Login as HOST
- [ ] Navigate to `/add-listing`
- [ ] Fill all required fields
- [ ] Upload property image
- [ ] Verify image preview
- [ ] Click "Publish Listing"
- [ ] Verify success message
- [ ] Verify redirect to dashboard

### Image Validation
- [ ] Try to publish without image
- [ ] Verify error message
- [ ] Upload image > 5MB
- [ ] Verify error message
- [ ] Upload non-image file
- [ ] Verify error message

---

## 📊 Dashboard Testing

### Guest Dashboard
- [ ] Login as GUEST
- [ ] Navigate to `/dashboard`
- [ ] Verify GuestDashboard displays
- [ ] Check sidebar menu items:
  - [ ] Dashboard
  - [ ] My Bookings
  - [ ] Messages
- [ ] Verify statistics display

### Host Dashboard
- [ ] Login as HOST
- [ ] Navigate to `/dashboard`
- [ ] Verify HostDashboard displays
- [ ] Check sidebar menu items:
  - [ ] Dashboard
  - [ ] My Listings
  - [ ] My Bookings
  - [ ] Earnings
  - [ ] Messages
- [ ] Verify statistics display

### Admin Dashboard
- [ ] Login as ADMIN
- [ ] Navigate to `/dashboard`
- [ ] Verify AdminDashboard displays
- [ ] Check sidebar shows only "Dashboard"

---

## 📅 Bookings Management Testing

### View Bookings
- [ ] Navigate to `/dashboard/bookings`
- [ ] Verify bookings list displays
- [ ] Check status filters (PENDING, CONFIRMED, PAID)
- [ ] Filter by status
- [ ] Verify correct bookings shown

### Host Approve Booking
- [ ] Login as HOST
- [ ] Go to `/dashboard/bookings`
- [ ] Find PENDING booking
- [ ] Click "Approve" button
- [ ] Verify status changes to CONFIRMED
- [ ] Verify approvedAt timestamp set

### Cancel Booking
- [ ] Login as GUEST
- [ ] Go to `/dashboard/bookings`
- [ ] Find booking to cancel
- [ ] Click "Cancel" button
- [ ] Verify status changes to CANCELLED
- [ ] Verify cancelledAt timestamp set

---

## 🏘️ My Listings Testing (Host Only)

- [ ] Login as HOST
- [ ] Navigate to `/dashboard/listings`
- [ ] Verify all host's listings display
- [ ] Click edit on listing
- [ ] Modify listing details
- [ ] Save changes
- [ ] Verify changes saved
- [ ] Click delete on listing
- [ ] Verify listing removed

---

## 💬 Messages Testing

### Send Message
- [ ] Login as GUEST
- [ ] Navigate to `/dashboard/messages`
- [ ] Find recipient
- [ ] Type message
- [ ] Click send
- [ ] Verify message sent

### Receive Message
- [ ] Login as different user
- [ ] Navigate to `/dashboard/messages`
- [ ] Verify message received
- [ ] Click to read
- [ ] Verify marked as read

### Conversations
- [ ] Verify conversation list displays
- [ ] Click on conversation
- [ ] Verify message history loads

---

## 💰 Wallet/Earnings Testing (Host Only)

- [ ] Login as HOST
- [ ] Navigate to `/dashboard/wallet`
- [ ] Verify earnings display
- [ ] Verify wallet balance
- [ ] Enter withdrawal amount
- [ ] Click withdraw
- [ ] Verify withdrawal processed
- [ ] Verify balance updated

---

## 👤 Profile Testing

- [ ] Navigate to `/profile`
- [ ] Verify current profile info displays
- [ ] Edit name
- [ ] Edit bio
- [ ] Upload avatar
- [ ] Click save
- [ ] Verify changes saved
- [ ] Verify avatar updated in navbar

---

## 🔔 Notifications Testing

- [ ] Login as authenticated user
- [ ] Click notifications bell in navbar
- [ ] Verify notifications panel opens
- [ ] Check unread count badge
- [ ] Click notification to mark as read
- [ ] Verify unread count decreases
- [ ] Click delete on notification
- [ ] Verify notification removed

---

## ❤️ Saved Listings Testing (Guest Only)

- [ ] Login as GUEST
- [ ] Navigate to `/listings`
- [ ] Click heart icon on listing
- [ ] Verify heart fills with orange
- [ ] Click heart icon in navbar
- [ ] Verify saved listings panel opens
- [ ] Verify listing appears in saved list
- [ ] Click remove button
- [ ] Verify listing removed

---

## 🌙 Dark Mode Testing

- [ ] Click moon icon in navbar
- [ ] Verify page inverts colors
- [ ] Refresh page
- [ ] Verify dark mode persists
- [ ] Click sun icon
- [ ] Verify colors return to normal
- [ ] Refresh page
- [ ] Verify light mode persists

---

## 📱 Responsive Design Testing

### Mobile (< 480px)
- [ ] Test on mobile device or browser
- [ ] Verify hamburger menu appears
- [ ] Click menu to open/close
- [ ] Verify navigation items visible
- [ ] Check listings grid (2 columns)
- [ ] Verify buttons are clickable
- [ ] Check form inputs are usable

### Tablet (480px - 768px)
- [ ] Test on tablet or browser
- [ ] Verify layout adjusts
- [ ] Check listings grid (3-4 columns)
- [ ] Verify navigation works
- [ ] Check dashboard sidebar

### Desktop (> 768px)
- [ ] Test on desktop
- [ ] Verify full layout displays
- [ ] Check listings grid (7 columns)
- [ ] Verify all features visible

---

## 🎨 Color Scheme Verification

- [ ] Verify all buttons are orange (#ff5724)
- [ ] Check all icons are orange
- [ ] Verify no red/pink colors visible
- [ ] Check badges are light orange (#ffe0cc)
- [ ] Verify hover states use medium orange (#ffb399)
- [ ] Check text is dark (#1a1a1a)

---

## 🔗 Link Verification

### Navigation Links
- [ ] Home link works
- [ ] Listings link works
- [ ] Add Listing link works (Host)
- [ ] Dashboard link works
- [ ] Profile link works
- [ ] Logout link works

### Dashboard Links
- [ ] Dashboard overview link works
- [ ] My Bookings link works
- [ ] My Listings link works (Host)
- [ ] Messages link works
- [ ] Wallet link works (Host)
- [ ] Edit Profile link works

### Listing Links
- [ ] Listing detail link works
- [ ] Back button works
- [ ] Booking form submits

---

## ⚠️ Error Handling Testing

### Form Validation
- [ ] Submit empty login form
- [ ] Verify error message
- [ ] Submit invalid email
- [ ] Verify error message
- [ ] Submit weak password
- [ ] Verify error message

### Booking Validation
- [ ] Try to book with check-out before check-in
- [ ] Verify error message
- [ ] Try to book with 0 guests
- [ ] Verify error message
- [ ] Try to book with guests > capacity
- [ ] Verify error message

### 404 Page
- [ ] Navigate to invalid route
- [ ] Verify 404 page displays
- [ ] Click back button
- [ ] Verify redirect works

---

## 📊 Performance Testing

- [ ] Check page load time (< 3 seconds)
- [ ] Verify smooth animations
- [ ] Check no console errors
- [ ] Verify no memory leaks
- [ ] Test with slow network (DevTools)

---

## ✅ Final Verification

- [ ] All features working
- [ ] All links functional
- [ ] No console errors
- [ ] No broken images
- [ ] Responsive on all devices
- [ ] Color scheme consistent
- [ ] Dark mode working
- [ ] Notifications working
- [ ] Messages working
- [ ] Bookings working
- [ ] Listings working
- [ ] Profile working
- [ ] Wallet working (Host)

**Status: READY FOR DEPLOYMENT** ✅
