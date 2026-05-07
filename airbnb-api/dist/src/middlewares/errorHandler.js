import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
export function errorHandler(err, req, res, next) {
    console.error("Unhandled error:", err);
    if (err instanceof ZodError) {
        return res.status(400).json({ errors: err.errors });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                return res.status(409).json({ error: `${err.meta?.target} already exists` });
            case "P2025":
                return res.status(404).json({ error: "Record not found" });
            case "P2003":
                return res.status(400).json({ error: "Related record does not exist" });
            default:
                return res.status(500).json({ error: "Database error" });
        }
    }
    return res.status(500).json({ error: "Something went wrong" });
}
