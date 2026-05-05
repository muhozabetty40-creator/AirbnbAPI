import { PrismaClient } from "@prisma/client";
import { prismaConfig } from "../../prisma.config.ts";

const prisma = new PrismaClient(prismaConfig);

export const connectDB = async () => {
  await prisma.$connect();
  console.log("Connected to the database");
};

export default prisma;
