import prisma from "../config/prisma.js";
import { getCache, setCache } from "../config/cache.js";
export const getListingStats = async (req, res, next) => {
    try {
        const cached = getCache("listings:stats");
        if (cached)
            return res.json(cached);
        const [totalListings, avgResult, byLocation, byType] = await Promise.all([
            prisma.listing.count(),
            prisma.listing.aggregate({ _avg: { pricePerNight: true } }),
            prisma.listing.groupBy({ by: ["location"], _count: { location: true } }),
            prisma.listing.groupBy({ by: ["type"], _count: { type: true } }),
        ]);
        const result = {
            totalListings,
            averagePrice: avgResult._avg.pricePerNight ?? 0,
            byLocation,
            byType,
        };
        setCache("listings:stats", result, 300);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
export const getUserStats = async (req, res, next) => {
    try {
        const cached = getCache("users:stats");
        if (cached)
            return res.json(cached);
        const [totalUsers, byRole] = await Promise.all([
            prisma.user.count(),
            prisma.user.groupBy({ by: ["role"], _count: { role: true } }),
        ]);
        const result = { totalUsers, byRole };
        setCache("users:stats", result, 300);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
