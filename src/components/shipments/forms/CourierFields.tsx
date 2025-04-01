
import { useFormContext, useWatch } from "react-hook-form";

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
import { couriers } from '../form-utils/constants';

const CourierFields = () => {
  const form = useFormContext();
  const courierValue = useWatch({ control: form.control, name: "courier" });

  return (
    <>
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
    </>
  );
};

export default CourierFields;
