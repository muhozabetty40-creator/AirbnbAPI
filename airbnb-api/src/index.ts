import "dotenv/config";
import express from "express";
import usersRouter from "./routes/users.routes.js";
import listingsRouter from "./routes/listings.routes.js";
import bookingsRouter from "./routes/bookings.routes.js";
import { connectDB } from "./config/prisma.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use("/users", usersRouter);
app.use("/listings", listingsRouter);
app.use("/bookings", bookingsRouter);

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
