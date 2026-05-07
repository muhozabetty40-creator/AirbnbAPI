import "dotenv/config";
import express, { NextFunction } from "express";
import compression from "compression";
import morgan from "morgan";
import v1Router from "./routes/v1/index.js";
import { connectDB } from "./config/prisma.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";

const app = express();
const PORT = Number(process.env["PORT"]) || 3000;

app.use(morgan(process.env["NODE_ENV"] === "production" ? "combined" : "dev"));
app.use(compression());
app.use(express.json());
app.use(generalLimiter);

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    uptime: process.uptime(), 
    timestamp: new Date() 
  });
});

app.use("/api/v1", v1Router);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Airbnb API",
    version: "1.0.0",
    endpoints: ["/api/v1/auth", "/api/v1/users", "/api/v1/listings", "/api/v1/bookings", "/api/v1/reviews", "/api/v1/ai"],
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

async function main() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Airbnb API running on http://localhost:${PORT}`);
  });
}

main().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
