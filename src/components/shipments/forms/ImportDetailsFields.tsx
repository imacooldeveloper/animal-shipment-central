import { Calendar, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import { useFormContext } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { animalTypes } from '../form-utils/constants';

const ImportDetailsFields = () => {
  const form = useFormContext();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.tagName === 'INPUT') {
        window.scrollTo(window.scrollX, window.scrollY);
      }
    }, 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="importNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Import Number</FormLabel>
            <FormControl>
              <Input {...field} placeholder="IMP-2025-001" disabled={field.disabled} />
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
              <Input {...field} placeholder="Enter protocol number for billing/reference" onChange={(e) => {
                field.onChange(e);
                handleInputChange(e);
              }} />
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
              <Input 
                {...field} 
                placeholder="Tokyo Research Center" 
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e);
                }}
              />
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
                <CalendarComponent
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
              <Input 
                {...field} 
                placeholder="20 C57BL/6 Males" 
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e);
                }}
              />
            </FormControl>
            <FormDescription>
              Number and details of animals
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ImportDetailsFields;
