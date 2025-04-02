
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from 'react';
import ImportFilters from '@/components/imports/ImportFilters';
import ImportCards from '@/components/imports/ImportCards';
import ImportTable from '@/components/imports/ImportTable';
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DateRangeFilter from '@/components/shared/DateRangeFilter';
import { format } from 'date-fns';
import { ImportItem } from '@/hooks/useImports';

interface ImportsContentProps {
  imports: ImportItem[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  viewMode: 'table' | 'card';
  toggleViewMode: () => void;
  onDateRangeChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

const ImportsContent = ({
  imports,
  loading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  viewMode,
  toggleViewMode,
  onDateRangeChange
}: ImportsContentProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
    if (onDateRangeChange) {
      onDateRangeChange(start, end);
    }
  };
  
  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
    }
    if (startDate) {
      return `Since ${format(startDate, 'MMM d, yyyy')}`;
    }
    if (endDate) {
      return `Until ${format(endDate, 'MMM d, yyyy')}`;
    }
    return '';
  };
  
  const hasDateFilter = startDate || endDate;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle>Import Shipments</CardTitle>
            <CardDescription>
              View and manage all incoming animal shipments
            </CardDescription>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <Calendar className="h-4 w-4" />
                {hasDateFilter ? 
                  <span className="truncate max-w-[150px]">{formatDateRange()}</span> : 
                  "Filter by Date"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
              <div className="space-y-2">
                <h4 className="font-medium">Filter by Creation Date</h4>
                <p className="text-sm text-muted-foreground">
                  Select a date range to filter imports
                </p>
                <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {hasDateFilter && (
          <div className="mt-2 flex items-center">
            <span className="text-sm bg-rose-100 text-rose-800 px-2 py-1 rounded-md flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Filtered: {formatDateRange()}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 ml-1 px-1 text-xs"
                onClick={() => handleDateRangeChange(undefined, undefined)}
              >
                Clear
              </Button>
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <ImportFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          toggleViewMode={toggleViewMode}
          viewMode={viewMode}
          onDateRangeChange={handleDateRangeChange}
        />
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Loading imports...</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <ImportTable imports={imports} />
          </div>
        ) : (
          <ImportCards imports={imports} />
        )}
      </CardContent>
    </Card>
  );
};

export default ImportsContent;
