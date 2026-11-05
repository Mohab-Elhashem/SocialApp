import { differenceInYears } from "date-fns";
import z from "zod";

export const RegisterSchema = z.object(
    {
        name: z
            .string()
            .min(3, { message: "Name must be at least 3 characters" })
            .max(50, { message: "Name must not exceed 50 characters" })
            .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, {
                message: "Name can only contain letters and spaces",
            }),
        username: z
            .string()
            .min(3, { message: "Username must be at least 3 characters" })
            .max(20, { message: "Username must not exceed 20 characters" })
            .regex(/^[a-zA-Z0-9_-]+$/, {
                message: "Username can only contain letters, numbers, underscores, and hyphens",
            })
            .transform((val) => val.toLowerCase()),
        email: z
            .string()
            .min(1, { message: "Email is required" })
            .email({ message: "Invalid email address format" }),
        dateOfBirth: z
            .string()
            .min(1, { message: "Date of birth is required" })
            .refine((value) => differenceInYears(new Date(), new Date(value)) >= 13, 'At least 13YO')
            .refine((value) => new Date(value) <= new Date(), "Not in the future"),
        gender: z.enum(["male", "female"], {
            error: "Please select a gender",
        }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" })
            .max(64, { message: "Password is too long" })
            .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
            .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
            .regex(/[0-9]/, { message: "Must contain at least one number" })
            .regex(/[^a-zA-Z0-9]/, {
                message: "Must contain at least one special character (!@#$%^&*)",
            }),
        rePassword: z
            .string()
            .min(1, { message: "Please confirm your password" })
    })
    .refine((data) => data.password === data.rePassword, {
        message: "Passwords do not match",
        path: ["rePassword"],
    });
    