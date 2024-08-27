import z from 'zod';

// Zod schema for validating User input
const userSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }), // Ensure password is provided
});

export default userSchema;
