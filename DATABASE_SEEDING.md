# Database Seeding Guide

## Overview
The seed script populates your database with sample data including users, listings with images, and bookings.

## What Gets Seeded

### Users (5 total)
- **2 Hosts:**
  - Alice Johnson (alice@example.com)
  - Bob Williams (bob@example.com)
- **3 Guests:**
  - Charlie Reed (charlie@example.com)
  - Dana Lee (dana@example.com)
  - Ethan Miller (ethan@example.com)

### Listings (10 total with images)
1. **Luxury Downtown Apartment** - New York, NY ($180/night)
   - 1 bed, 1 bath, 3 guests
   - Image: Modern apartment

2. **Spacious Family House** - Austin, TX ($220/night)
   - 3 beds, 2 baths, 5 guests
   - Image: Beautiful family home

3. **Luxury Lake Villa** - Lake Tahoe, CA ($420/night)
   - 4 beds, 3 baths, 8 guests
   - Image: Stunning lake villa

4. **Cozy Forest Cabin** - Asheville, NC ($150/night)
   - 2 beds, 1 bath, 4 guests
   - Image: Forest cabin

5. **Beachfront Paradise** - Miami, FL ($280/night)
   - 3 beds, 2 baths, 6 guests
   - Image: Beach house

6. **Modern Urban Loft** - Los Angeles, CA ($200/night)
   - 1 bed, 1 bath, 2 guests
   - Image: Modern loft

7. **Mountain Retreat Villa** - Denver, CO ($350/night)
   - 4 beds, 2 baths, 7 guests
   - Image: Mountain villa

8. **Charming City Apartment** - San Francisco, CA ($190/night)
   - 1 bed, 1 bath, 2 guests
   - Image: City apartment

9. **Historic Victorian House** - Boston, MA ($240/night)
   - 3 beds, 2 baths, 4 guests
   - Image: Victorian house

10. **Tropical Island Cabin** - Hawaii, HI ($380/night)
    - 2 beds, 2 baths, 5 guests
    - Image: Tropical cabin

### Bookings (3 total)
- Charlie → Luxury Downtown Apartment
- Dana → Spacious Family House
- Ethan → Luxury Lake Villa

## How to Run the Seed

### Step 1: Navigate to Backend Directory
```bash
cd airbnb-api
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Set Up Environment Variables
Make sure your `.env` file has:
```
DATABASE_URL="postgresql://user:password@localhost:5432/booking_db"
```

### Step 4: Run Migrations (if not already done)
```bash
npx prisma migrate dev
```

### Step 5: Run the Seed Script
```bash
npx prisma db seed
```

Or if that doesn't work:
```bash
node prisma/seed.ts
```

### Step 6: Verify the Seed
Check your database to confirm:
- 5 users created
- 10 listings with images
- 3 bookings created

## Images Used
All images are from Unsplash (free, high-quality stock photos):
- Apartments: Modern apartment interiors
- Houses: Beautiful family homes
- Villas: Luxury properties
- Cabins: Cozy forest and tropical settings
- Beach: Beachfront properties

## Testing the Data

### 1. Login as Host
- Email: `alice@example.com`
- Password: (set during registration)
- Role: HOST

### 2. Login as Guest
- Email: `charlie@example.com`
- Password: (set during registration)
- Role: GUEST

### 3. View Listings
- Go to home page
- See all 10 listings with images
- Click on any listing to view details

### 4. Create Booking
- Login as guest
- Click on a listing
- Click "Book Now"
- Select dates and confirm

## Resetting the Database

If you want to clear and reseed:

```bash
# Reset database (deletes all data)
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new one
# 3. Run all migrations
# 4. Run the seed script
```

## Troubleshooting

### "Seed script not found"
Make sure you're in the `airbnb-api` directory and the `prisma/seed.ts` file exists.

### "Database connection failed"
Check your `DATABASE_URL` in `.env` and ensure PostgreSQL is running.

### "Images not loading"
The images are from Unsplash CDN. If they don't load, check your internet connection or the Unsplash service status.

### "Duplicate key error"
The seed script uses `upsert` to handle duplicates. If you get errors, run `npx prisma migrate reset` to clear the database first.

## Next Steps

After seeding:
1. Start the backend: `npm run dev`
2. Start the frontend: `cd ../airbnb-ui && npm run dev`
3. Visit `http://localhost:5173`
4. Browse the listings with images
5. Test booking functionality
