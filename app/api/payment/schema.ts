import { z } from 'zod';

const paymentSchema = z.object({
  id: z.number().optional(), // Optional as it is usually auto-generated
  lotTransactionId: z.number(), // Required foreign key field
  amount: z.number().nullable(), // Convert string to float or null
  bank: z.string().max(255).nullable(), // Nullable field with max length
  paymentDate: z
    .string()
    .min(1, "Payment date is required")
    .transform((val) => new Date(val)), // Convert string to Date or null
  remarks: z.string().nullable(),
  deletedAt: z.string().nullable().transform(val => val ? new Date(val) : null).optional(), // Optional and can be null

});

export default paymentSchema;
