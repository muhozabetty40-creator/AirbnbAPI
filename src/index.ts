import 'dotenv/config';
import express from 'express';
import listingsRouter from './routes/listings.routes.js';
import usersRouter from './routes/users.routes.js';
import bookingRouter from './routes/booking.routes.js';
import { connectDB } from "./config/prisma.js";

import authRoutes from "./routes/auth.routes.js";
import uploadRouter from "./routes/upload.routes.js";

import { setupSwagger } from "./config/swagger.js";



const app = express();
const PORT = 5000;


app.use(express.json());
app.use('/listings', listingsRouter);
app.use('/users', usersRouter);
app.use('/bookings', bookingRouter);
app.use("/auth", authRoutes);
app.use("/users", uploadRouter);
setupSwagger(app); // put BEFORE routes
async function startServer() {
  try {
    await connectDB();
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

startServer(); 
