import { z } from 'zod';

const lotTransactionSchema = z.object({
  id: z.number().optional(), // Optional because it's auto-generated
  clientId: z.number().nullable().optional(), // Optional and can be null
  propertyUnit: z.string().max(255).nullable().optional(), // Optional and can be null
  totalPropertySize: z.number().nullable().optional(), // Optional and can be null
  type: z.string().max(255).nullable().optional(), // Optional and can be null
  unitBlock: z.string().max(255).nullable().optional(), // Optional and can be null
  unitLot: z.string().max(255).nullable().optional(), // Optional and can be null
  propertyUnitAddress: z.string().max(255).nullable().optional(), // Optional and can be null
  propertyTotalAmount: z.number().nullable().optional(), // Optional and can be null
  downpayment: z.number().nullable().optional(), // Optional and can be null
  paymentTerms: z.string().max(255).nullable().optional(), // Optional and can be null
  incrementValues: z.string().nullable().optional(), // Optional and can be null
  dueDate:  z.string().nullable().transform(val => val ? new Date(val) : null).optional(), // Optional and can be null
  interestDate: z.string().nullable().transform(val => val ? new Date(val) : null).optional(), // Optional and can be null
  interest: z.number().nullable().optional(), // Optional and can be null
  sqm: z.number().nullable().optional(), // Optional and can be null
  incrementAmount: z.number().nullable().optional(), // Optional and can be null
  transactionDate: z.string().nullable().transform(val => val ? new Date(val) : null).optional(), // Optional and can be null
  autocompute: z.number().optional(), // Required
  deletedAt: z.string().nullable().transform(val => val ? new Date(val) : null).optional(), // Optional and can be null
  createdAt: z.string().nullable().transform(val => val ? new Date(val) : null).optional(), // Required
  updatedAt: z.string().nullable().transform(val => val ? new Date(val) : null).optional(), // Required
});

export default lotTransactionSchema;
