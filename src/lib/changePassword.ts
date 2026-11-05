import { z } from "zod";

const strongPassword = z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password is too long" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
        message: "Must contain at least one special character (!@#$%^&*)",
    });

export const ChangePasswordSchema = z.object({
    password: z.string().min(1, { message: "Current password is required" }),
    newPassword: strongPassword,
    rePassword: z.string().min(1, { message: "Please confirm your new password" }),
}).refine((data) => data.newPassword === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
});

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;