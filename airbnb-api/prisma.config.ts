import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const client = new pg.Pool({
  connectionString: process.env.DATABASE_URL ?? ""
});

export const prismaConfig = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL ?? ""
    }
  },
  adapter: new PrismaPg(client)
} as any;
