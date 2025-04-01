
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from 'react';

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
import StatusWarning from '../form-utils/StatusWarning';
import { statuses } from '../form-utils/constants';

const StatusFields = () => {
  const form = useFormContext();
  const statusValue = useWatch({ control: form.control, name: "status" });
  const [showWaitingInfo, setShowWaitingInfo] = useState(false);
  
  useEffect(() => {
    setShowWaitingInfo(statusValue === "Waiting for Lab Paperwork");
  }, [statusValue]);

  return (
    <>
      <StatusWarning show={showWaitingInfo} />
      
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
    </>
  );
};

export default StatusFields;
