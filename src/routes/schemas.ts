/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Alice
 *         email:
 *           type: string
 *           example: alice@gmail.com
 *         username:
 *           type: string
 *           example: alice123
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         avatar:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *         role:
 *           type: string
 *           enum: [GUEST, HOST, ADMIN]
 *           example: GUEST
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:30:00.000Z
 *
 *     CreateUserInput:
 *       type: object
 *       required: [name, email, username, phone]
 *       properties:
 *         name:
 *           type: string
 *           example: Alice
 *         email:
 *           type: string
 *           example: alice@gmail.com
 *         username:
 *           type: string
 *           example: alice123
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         password:
 *           type: string
 *           example: secret123
 *
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         username:
 *           type: string
 *         phone:
 *           type: string
 *         avatar:
 *           type: string
 *
 *     RegisterInput:
 *       type: object
 *       required: [name, email, username, password, phone]
 *       properties:
 *         name:
 *           type: string
 *           example: Alice
 *         email:
 *           type: string
 *           example: alice@gmail.com
 *         username:
 *           type: string
 *           example: alice123
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         password:
 *           type: string
 *           example: secret123
 *
 *     LoginInput:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: alice@gmail.com
 *         password:
 *           type: string
 *           example: secret123
 *
 *     Listing:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Cozy Apartment in Downtown
 *         description:
 *           type: string
 *           example: Beautiful apartment with great views
 *         location:
 *           type: string
 *           example: New York, NY
 *         price:
 *           type: number
 *           example: 150.00
 *         image:
 *           type: string
 *           example: https://res.cloudinary.com/demo/image/upload/apartment.jpg
 *         hostId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CreateListingInput:
 *       type: object
 *       required: [title, location, pricePerNight, guest, type, amenities, hostId]
 *       properties:
 *         title:
 *           type: string
 *           example: Cozy Apartment
 *         description:
 *           type: string
 *           example: Beautiful apartment
 *         location:
 *           type: string
 *           example: New York, NY
 *         price:
 *           type: number
 *           example: 150.00
 *         image:
 *           type: string
 *         hostId:
 *           type: integer
 *
 *     UpdateListingInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         price:
 *           type: number
 *         image:
 *           type: string
 *
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         listingId:
 *           type: integer
 *           example: 1
 *         checkInDate:
 *           type: string
 *           format: date
 *           example: "2024-02-01"
 *         checkOutDate:
 *           type: string
 *           format: date
 *           example: "2024-02-05"
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 *           example: CONFIRMED
 *         totalPrice:
 *           type: number
 *           example: 750.00
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CreateBookingInput:
 *       type: object
 *       required: [userId, listingId, checkInDate, checkOutDate]
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 *         listingId:
 *           type: integer
 *           example: 1
 *         checkInDate:
 *           type: string
 *           format: date
 *           example: "2024-02-01"
 *         checkOutDate:
 *           type: string
 *           format: date
 *           example: "2024-02-05"
 *
 *     UpdateBookingInput:
 *       type: object
 *       properties:
 *         checkInDate:
 *           type: string
 *           format: date
 *         checkOutDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 */

// Placeholder export to make this a valid module
export {};
