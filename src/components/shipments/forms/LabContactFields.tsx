
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

const LabContactFields = () => {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="labContactName"
        render={({ field }) =>  (
          <FormItem>
            <FormLabel>Lab Contact Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter contact name at the lab" />
            </FormControl>
            <FormDescription>
              Person to contact for lab-related questions
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="labContactEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lab Contact Email</FormLabel>
            <FormControl>
              <Input {...field} placeholder="contact@lab.edu" type="email" />
            </FormControl>
            <FormDescription>
              Email for follow-up communication
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LabContactFields;
