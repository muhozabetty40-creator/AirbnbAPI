# 🚀 Quick Reference Guide - Airbnb Booking Platform

## 📌 Project Overview

**Full-stack Airbnb-like booking platform** with user authentication, listing management, booking system, messaging, and notifications.

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + Prisma
- **Database:** PostgreSQL/MySQL
- **Deployment:** Ready for production

---

## 🎯 Quick Start

### Backend Setup
```bash
cd airbnb-api
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend Setup
```bash
cd airbnb-ui
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔑 Test Credentials

### Guest Account
```
Email: guest@example.com
Password: password123
Role: GUEST
```

### Host Account
```
Email: host@example.com
Password: password123
Role: HOST
```

### Admin Account
```
Email: admin@example.com
Password: password123
Role: ADMIN
```

---

## 📍 Key Routes

### Public Routes
| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/listings` | Browse listings |
| `/listings/:id` | Listing detail |
| `/login` | Login page |
| `/signup` | Sign up page |

### Protected Routes
| Route | Purpose | Role |
|-------|---------|------|
| `/profile` | Edit profile | All |
| `/book/:id` | Book listing | Guest |
| `/add-listing` | Create listing | Host |
| `/dashboard` | Dashboard | All |
| `/dashboard/bookings` | My bookings | All |
| `/dashboard/listings` | My listings | Host |
| `/dashboard/messages` | Messages | All |
| `/dashboard/wallet` | Earnings | Host |

---

## 🔌 API Endpoints Quick Reference

### Authentication
```
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/logout
```

### Listings
```
GET /api/v1/listings
GET /api/v1/listings/:id
POST /api/v1/listings
PUT /api/v1/listings/:id
DELETE /api/v1/listings/:id
```

### Bookings
```
GET /api/v1/bookings
POST /api/v1/bookings
PUT /api/v1/bookings/:id/approve
PUT /api/v1/bookings/:id/cancel
```

### Messages
```
POST /api/v1/messages
GET /api/v1/messages
GET /api/v1/messages/conversations
```

### Notifications
```
GET /api/v1/notifications
PUT /api/v1/notifications/:id/read
DELETE /api/v1/notifications/:id
```

---

## 🎨 Color Palette

```
Primary Orange:    #ff5724
Light Orange:      #ffe0cc
Medium Orange:     #ffb399
Dark Text:         #1a1a1a
Light Background:  #f7f8fa
White:             #ffffff
Border:            #e5e7eb
```

---

## 📁 Project Structure

```
Booking/
├── airbnb-api/                 # Backend
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── routes/             # API routes
│   │   ├── middlewares/        # Auth, validation
│   │   ├── config/             # Database config
│   │   └── index.ts            # Server entry
│   └── prisma/
│       └── schema.prisma       # Database schema
│
├── airbnb-ui/                  # Frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── features/           # Feature modules
│   │   ├── shared/             # Shared components
│   │   ├── api.ts              # API service
│   │   └── App.tsx             # Main app
│   └── public/                 # Static files
│
└── Documentation files
```

---

## 🔐 Authentication Flow

1. User signs up → Account created
2. User logs in → JWT token generated
3. Token stored in localStorage
4. Token sent with each API request
5. Backend validates token
6. User logged out → Token removed

---

## 📊 Database Models

### User
```typescript
{
  id: string
  email: string
  username: string
  name: string
  phone: string
  role: 'GUEST' | 'HOST' | 'ADMIN'
  password: string (hashed)
  avatar?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}
```

### Listing
```typescript
{
  id: string
  userId: string
  title: string
  description: string
  location: string
  pricePerNight: number
  guests: number
  bedrooms?: number
  bathrooms?: number
  type: string
  amenities: string[]
  image: string
  createdAt: Date
  updatedAt: Date
}
```

### Booking
```typescript
{
  id: string
  userId: string
  listingId: string
  checkIn: Date
  checkOut: Date
  guests: number
  total: number
  status: 'pending' | 'confirmed' | 'cancelled'
  approvedAt?: Date
  cancelledAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

---

## 🎯 Feature Checklist

### Authentication
- ✅ Login
- ✅ Sign up
- ✅ Logout
- ✅ Profile management

### Listings
- ✅ Create listing
- ✅ Edit listing
- ✅ Delete listing
- ✅ View listings
- ✅ Search listings

### Bookings
- ✅ Create booking
- ✅ View bookings
- ✅ Approve booking (Host)
- ✅ Cancel booking
- ✅ Status tracking

### Messaging
- ✅ Send message
- ✅ Receive message
- ✅ View conversations
- ✅ Mark as read

### Notifications
- ✅ View notifications
- ✅ Mark as read
- ✅ Delete notification
- ✅ Unread count

### UI/UX
- ✅ Dark mode
- ✅ Responsive design
- ✅ Orange color scheme
- ✅ Loading states
- ✅ Error handling

---

## 🧪 Common Testing Scenarios

### Test Booking Flow
1. Login as GUEST
2. Browse listings
3. Click on listing
4. Fill booking form
5. Submit booking
6. Check dashboard/bookings

### Test Host Approval
1. Login as HOST
2. Go to dashboard/bookings
3. Find PENDING booking
4. Click approve
5. Verify status changed to CONFIRMED

### Test Messaging
1. Login as GUEST
2. Go to dashboard/messages
3. Send message to HOST
4. Login as HOST
5. Verify message received

### Test Dark Mode
1. Click moon icon in navbar
2. Verify colors inverted
3. Refresh page
4. Verify dark mode persists

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
# Check database connection
# Check .env file
npm run dev
```

### Frontend won't load
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### API calls failing
```bash
# Check backend is running
# Check API_BASE_URL in .env
# Check network tab in DevTools
# Check browser console for errors
```

### Database issues
```bash
# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed
```

---

## 📚 Important Files

### Backend
- `airbnb-api/src/index.ts` - Server entry point
- `airbnb-api/prisma/schema.prisma` - Database schema
- `airbnb-api/src/routes/v1/index.ts` - Route registration
- `airbnb-api/.env` - Environment variables

### Frontend
- `airbnb-ui/src/App.tsx` - Main app component
- `airbnb-ui/src/api.ts` - API service
- `airbnb-ui/src/App.css` - Global styles
- `airbnb-ui/.env` - Environment variables

---

## 🔗 Important Links

### GitHub
- Repository: https://github.com/muhozabetty40-creator/AirbnbAPI

### Documentation
- Feature Verification: `FEATURE_VERIFICATION_REPORT.md`
- Testing Guide: `TESTING_CHECKLIST.md`
- Complete Summary: `COMPLETE_VERIFICATION_SUMMARY.md`

---

## 💡 Tips & Tricks

### Frontend
- Use `@workspace` to include all related files
- Use `@file` to include specific files
- Check browser DevTools for API responses
- Use React DevTools for component debugging

### Backend
- Check server logs for errors
- Use Postman to test API endpoints
- Check database with Prisma Studio: `npx prisma studio`
- Use console.log for debugging

### General
- Always check .env files are configured
- Verify database is running
- Check network tab for API calls
- Clear browser cache if issues persist

---

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review error messages
3. Check browser console
4. Check server logs
5. Review code comments

---

## ✅ Verification Checklist

Before deployment:
- [ ] All features tested
- [ ] All links working
- [ ] No console errors
- [ ] No broken images
- [ ] Responsive on mobile
- [ ] Dark mode working
- [ ] Color scheme correct
- [ ] API endpoints responding
- [ ] Database connected
- [ ] Environment variables set

---

**Version:** 1.0.0  
**Status:** Production Ready ✅  
**Last Updated:** 2024
