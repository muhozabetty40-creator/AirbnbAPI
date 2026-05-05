import "dotenv/config";
import express from "express";
import compression from "compression";
import usersRouter from "./routes/users.routes.js";
import listingsRouter from "./routes/listings.routes.js";
import bookingsRouter from "./routes/bookings.routes.js";
import reviewsRouter from "./routes/reviews.routes.js";
import { connectDB } from "./config/prisma.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import { getListingReviews, createReview } from "./controllers/reviews.controller.js";
import { strictLimiter } from "./middlewares/rateLimiter.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(compression());
app.use(express.json());
app.use(generalLimiter);

app.use("/users", usersRouter);
app.use("/listings", listingsRouter);
app.use("/bookings", bookingsRouter);
app.use("/reviews", reviewsRouter);

// Listing reviews nested routes
app.get("/listings/:id/reviews", getListingReviews);
app.post("/listings/:id/reviews", strictLimiter, createReview);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

async function main() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Airbnb API running on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
