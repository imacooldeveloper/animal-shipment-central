
import { z } from "zod";

export const importFormSchema = z.object({
  importNumber: z.string().min(2, "Import number is required"),
  sendingLab: z.string().min(2, "Sending lab is required"),
  protocolNumber: z.string().optional(),
  courier: z.string().optional(),
  courierOther: z.string().optional(),
  courierAccountNumber: z.string().optional(),
  arrivalDate: z.date().optional(),
  animalType: z.string().min(2, "Animal type is required"),
  quantity: z.string().min(1, "Quantity is required"),
  status: z.string().optional(),
  statusOther: z.string().optional(),
  notes: z.string().optional(),
  labContactName: z.string().optional(),
  labContactEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
});

export type ImportFormValues = z.infer<typeof importFormSchema>;
