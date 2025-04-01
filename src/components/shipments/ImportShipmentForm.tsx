
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const importFormSchema = z.object({
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
});

const couriers = [
  "World Courier",
  "BioTrans",
  "Validated",
  "MNX",
  "Other"
];

const statuses = [
  "Initializing Import",
  "Waiting for Courier Response",
  "Waiting for Vet Approval",
  "Sent Health Reports",
  "Documents Approved",
  "Ready for Pickup",
  "In Transit",
  "Delivered",
  "On Hold",
  "Cancelled",
  "Other"
];

const animalTypes = [
  "Rodents",
  "Zebrafish",
  "Amphibians",
  "Birds",
  "Reptiles",
];

interface ImportShipmentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ImportShipmentForm = ({ onSubmit, onCancel }: ImportShipmentFormProps) => {
  const form = useForm<z.infer<typeof importFormSchema>>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      importNumber: `IMP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      notes: "",
    },
  });

  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const courierValue = form.watch("courier");
  const statusValue = form.watch("status");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocumentFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removeFile = (index: number) => {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (values: z.infer<typeof importFormSchema>) => {
    // Combine courier with courierOther if "Other" is selected
    let finalCourier = values.courier;
    if (values.courier === "Other" && values.courierOther) {
      finalCourier = values.courierOther;
    }
    
    // Combine status with statusOther if "Other" is selected
    let finalStatus = values.status;
    if (values.status === "Other" && values.statusOther) {
      finalStatus = values.statusOther;
    }
    
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "courier") {
        formData.append(key, finalCourier || "");
      } else if (key === "status") {
        formData.append(key, finalStatus || "");
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value !== undefined) {
        formData.append(key, value);
      }
    });

    documentFiles.forEach((file) => {
      formData.append('documents', file);
    });

    onSubmit({
      ...values,
      courier: finalCourier,
      status: finalStatus,
      documents: documentFiles,
      type: 'import'
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="importNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Import Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="IMP-2025-001" />
                </FormControl>
                <FormDescription>
                  Unique identifier for this import
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="protocolNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protocol Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter protocol number for billing/reference" />
                </FormControl>
                <FormDescription>
                  Used for charging the lab or tracking
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sendingLab"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sending Lab / Institution</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Tokyo Research Center" />
                </FormControl>
                <FormDescription>
                  Where the animals are coming from
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Courier (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a courier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {couriers.map((courier) => (
                      <SelectItem key={courier} value={courier}>{courier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Transport provider for the shipment
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {courierValue === "Other" && (
            <FormField
              control={form.control}
              name="courierOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specify Courier</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter courier name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="courierAccountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Courier Account Number (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter account number if lab is paying" />
                </FormControl>
                <FormDescription>
                  Account number for billing purposes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="arrivalDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Arrival Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When the animals are expected to arrive
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="animalType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select animal type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {animalTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Type of animals being imported
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity and Strain</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="20 C57BL/6 Males" />
                </FormControl>
                <FormDescription>
                  Number and details of animals
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="e.g., In Progress" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Current status of this import
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {statusValue === "Other" && (
            <FormField
              control={form.control}
              name="statusOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Status</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter custom status" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Special handling instructions, quarantine details, etc." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Documents</FormLabel>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="max-w-sm"
            />
            <FormDescription>
              Upload health certificates, customs documents, etc.
            </FormDescription>
          </div>

          {documentFiles.length > 0 && (
            <div className="border rounded-md p-4">
              <p className="font-medium mb-2">Attached Files:</p>
              <ul className="space-y-2">
                {documentFiles.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="truncate flex-1">{file.name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFile(index)}
                      className="h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Create Import</Button>
        </div>
      </form>
    </Form>
  );
};

export default ImportShipmentForm;
