import prisma from "../config/prisma.js";
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const parseId = (v) => {
    const s = Array.isArray(v) ? v[0] : v;
    return s || null;
};
const parsePage = (page, limit) => {
    const p = Math.max(1, parseInt(String(page || "1"), 10) || 1);
    const l = Math.max(1, parseInt(String(limit || "10"), 10) || 10);
    return { page: p, limit: l, skip: (p - 1) * l };
};
export const getAllBookings = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const { page: p, limit: l, skip } = parsePage(page, limit);
        const [data, total] = await Promise.all([
            prisma.booking.findMany({
                skip,
                take: l,
                include: {
                    user: { select: { name: true } },
                    listing: { select: { title: true, location: true } },
                },
            }),
            prisma.booking.count(),
        ]);
        res.json({ data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } });
    }
    catch (error) {
        next(error);
    }
};
export const getBookingById = async (req, res, next) => {
    try {
        const id = parseId(req.params.id);
        if (id === null)
            return res.status(400).json({ message: "Invalid booking id" });
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { user: true, listing: true },
        });
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });
        res.json(booking);
    }
    catch (error) {
        next(error);
    }
};
export const createBooking = async (req, res, next) => {
    try {
        const { userId, listingId, checkIn, checkOut, guests } = req.body;
        if (!userId || !listingId || !checkIn || !checkOut || !guests) {
            return res.status(400).json({ message: "Missing required fields: userId, listingId, checkIn, checkOut, guests" });
        }
        const [user, listing] = await Promise.all([
            prisma.user.findUnique({ where: { id: userId } }),
            prisma.listing.findUnique({ where: { id: listingId } }),
        ]);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (!listing)
            return res.status(404).json({ message: "Listing not found" });
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / MS_PER_DAY);
        const total = nights * listing.pricePerNight;
        const booking = await prisma.booking.create({
            data: {
                userId,
                listingId,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                guests: Number(guests),
                total,
            },
        });
        res.status(201).json(booking);
    }
    catch (error) {
        next(error);
    }
};
export const deleteBooking = async (req, res, next) => {
    try {
        const id = parseId(req.params.id);
        if (id === null)
            return res.status(400).json({ message: "Invalid booking id" });
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });
        await prisma.booking.delete({ where: { id } });
        res.status(200).json({ message: "Booking cancelled" });
    }
    catch (error) {
        next(error);
    }
};
