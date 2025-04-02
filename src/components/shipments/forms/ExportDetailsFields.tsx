
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { animalTypes } from '../form-utils/constants';

const ExportDetailsFields = () => {
  const form = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="exportNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Export Number</FormLabel>
            <FormControl>
              <Input {...field} placeholder="EXP-2025-001" />
            </FormControl>
            <FormDescription>
              Unique identifier for this export
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
              <Input {...field} placeholder="Our Facility" />
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
        name="destinationLab"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Destination Lab / Institution</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Paris Research Center" />
            </FormControl>
            <FormDescription>
              Where the animals are going to
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="departureDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Departure Date (Optional)</FormLabel>
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
              When the animals are scheduled to depart
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
              Type of animals being exported
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
        name="trackingNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tracking Number (Optional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="ABC12345678" />
            </FormControl>
            <FormDescription>
              If available, enter the courier tracking number
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ExportDetailsFields;
