import { z } from "zod";

export const createTripSchema = z.object({
    name: z
        .string()
        .trim()
        .min(5, "Trip name must be at least 5 characters")
        .max(100, "Trip name cannot exceed 100 characters"),

    slug: z
        .string()
        .trim()
        .min(4, "Slug must be at least 4 characters")
        .max(100, "Slug cannot exceed 100 characters")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug can only contain lowercase letters, numbers, and hyphens"
        ),

    origin: z
        .string()
        .trim()
        .min(2, "Origin must be at least 2 characters")
        .max(50, "Origin cannot exceed 50 characters"),

    destination: z
        .string()
        .trim()
        .min(2, "Destination must be at least 2 characters")
        .max(50, "Destination cannot exceed 50 characters"),

    start_date: z.string().date(),

    end_date: z.string().date(),

    price: z.coerce
        .number()
        .int("Price must be a whole number")
        .positive("Price must be greater than 0"),

    total_seats: z.coerce
        .number()
        .int("Total seats must be a whole number")
        .min(1, "At least 1 seat is required")
        .max(1000, "Seats cannot exceed 1000"),

    description: z
        .string()
        .trim()
        .min(20, "Description must be at least 20 characters")
        .max(5000, "Description cannot exceed 5000 characters"),

    status: z.enum(["open", "closed"]),

    thumbnail: z
        .url("Please enter a valid image URL")
});
export type CreateTripInput = z.infer<typeof createTripSchema>;
export const editTripSchema = createTripSchema;

export const TripQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(20).default(10),
    state: z.enum(["open", "closed", "all"]).default("all"),
});

