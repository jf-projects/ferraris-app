import { z } from 'zod';

const clientSchema = z.object({
  firstName: z.string().max(255).nullable(),  // Nullable and max length 255
  middleName: z.string().max(255).nullable(),
  lastName: z.string().max(255).nullable(),
  address: z.string().max(255).nullable(),
  gender: z.string().max(255).nullable(),
  civilStatus: z.string().max(255).nullable(),
  clientNumber: z.string().max(255).nullable(),
  // clientLandline: z.string().max(255).nullable(),
  spouseFirstName: z.string().max(255).nullable(),
  spouseMiddleName: z.string().max(255).nullable(),
  spouseLastName: z.string().max(255).nullable(),
  bday: z.string().nullable().transform(val => val ? new Date(val) : null),
  image: z.string().nullable(),
  client_id: z.string().nullable(),
  email: z.string().max(255), // Required field with max length 255
  deletedAt: z.string().optional(),
});

export default clientSchema;

