
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  
  React.useEffect(() => {
    onDateRangeChange(startDate, endDate);
  }, [startDate, endDate, onDateRangeChange]);
  
  const resetDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid gap-2">
        <div className="grid gap-1">
          <h4 className="text-sm font-medium">Start Date</h4>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid gap-1">
          <h4 className="text-sm font-medium">End Date</h4>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => startDate ? date < startDate : false}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={resetDates}
          className="w-full"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default DateRangeFilter;
