import "dotenv/config";
import express, { NextFunction } from "express";
import compression from "compression";
import morgan from "morgan";
import v1Router from "./routes/v1/index.js";
import { connectDB } from "./config/prisma.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";

const app = express();
const PORT = Number(process.env["PORT"]) || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL || "http://localhost:5173"
    : ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = Array.isArray(corsOptions.origin) 
    ? corsOptions.origin 
    : [corsOptions.origin];
  
  if (allowedOrigins.includes(origin || "")) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  
  res.header("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.header("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

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
