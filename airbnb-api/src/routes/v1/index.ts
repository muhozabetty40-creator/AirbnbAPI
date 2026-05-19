import { Router } from "express";
import authRouter from "./auth.routes.js";
import usersRouter from "./users.routes.js";
import listingsRouter from "./listings.routes.js";
import bookingsRouter from "./bookings.routes.js";
import reviewsRouter from "./reviews.routes.js";
import messagesRouter from "./messages.routes.js";
import notificationsRouter from "./notifications.routes.js";
import aiRouter from "./ai.routes.js";
import { getListingReviews, createReview } from "../../controllers/reviews.controller.js";
import { strictLimiter } from "../../middlewares/rateLimiter.js";
import { deprecateV1 } from "../../middlewares/deprecation.middleware.js";

const v1Router = Router();

v1Router.use(deprecateV1);

v1Router.use("/auth", authRouter);
v1Router.use("/users", usersRouter);
v1Router.use("/listings", listingsRouter);
v1Router.use("/bookings", bookingsRouter);
v1Router.use("/reviews", reviewsRouter);
v1Router.use("/messages", messagesRouter);
v1Router.use("/notifications", notificationsRouter);
v1Router.use("/ai", aiRouter);

// Listing reviews nested routes
v1Router.get("/listings/:id/reviews", getListingReviews);
v1Router.post("/listings/:id/reviews", strictLimiter, createReview);

export default v1Router;