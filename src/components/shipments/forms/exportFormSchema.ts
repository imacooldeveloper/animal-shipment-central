
import { z } from "zod";

export const exportFormSchema = z.object({
  exportNumber: z.string().min(2, "Export number is required"),
  sendingLab: z.string().min(2, "Sending lab is required"),
  destinationLab: z.string().min(2, "Destination lab is required"),
  protocolNumber: z.string().optional(),
  courier: z.string().optional(),
  courierOther: z.string().optional(),
  courierAccountNumber: z.string().optional(),
  departureDate: z.date().optional(),
  animalType: z.string().min(2, "Animal type is required"),
  quantity: z.string().min(1, "Quantity is required"),
  status: z.string().optional(),
  statusOther: z.string().optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
  labContactName: z.string().optional(),
  labContactEmail: z.string().email("Invalid email address").optional(),
});

export type ExportFormValues = z.infer<typeof exportFormSchema>;
