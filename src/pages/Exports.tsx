
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Truck, Calendar } from 'lucide-react';
import { ShipmentStatus } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ExportFilters from '@/components/exports/ExportFilters';
import ExportTable from '@/components/exports/ExportTable';
import ExportCards from '@/components/exports/ExportCards';
import { mapStatusToShipmentStatus } from '@/lib/utils';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import DateRangeFilter from '@/components/shared/DateRangeFilter';
import { PAGINATION_CONSTANTS } from "@/lib/constants";

// Interface for database items
export interface ExportDatabaseItem {
  id: string;
  export_number: string;
  destination_lab: string;
  courier: string | null;
  status: string | null;
  departure_date: string | null;
  animal_type: string;
  quantity: string;
  created_at: string;
  sending_lab: string;
  courier_account_number?: string | null;
  created_by?: string | null;
  lab_contact_email?: string | null;
  lab_contact_name?: string | null;
  notes?: string | null;
  protocol_number?: string | null;
  tracking_number?: string | null;
  checklist?: string | null;
}

// Interface for formatted export items
export interface ExportItem {
  id: string;
  destinationLab: string;
  courier: string;
  status: ShipmentStatus;
  departureDate: string;
  animalType: string;
  country: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = PAGINATION_CONSTANTS.ITEMS_PER_PAGE;

const Exports = () => {
  const [exports, setExports] = useState<ExportDatabaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredExports, setFilteredExports] = useState<ExportItem[]>([]);
  
  // Date range filters
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Use cards by default on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('card');
      }
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fetch exports from Supabase
  useEffect(() => {
    const fetchExports = async () => {
      setLoading(true);
      try {
        console.log("Fetching exports from Supabase...");
        const { data, error } = await supabase
          .from('exports')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        console.log("Fetched exports:", data?.length || 0);
        if (data) {
          setExports(data);
        } else {
          setExports([]);
        }
      } catch (error) {
        console.error('Error fetching exports:', error);
        toast.error('Failed to load exports. Please try again.');
        setExports([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExports();
  }, []);
  
  // Filter exports and update pagination whenever data or filters change
  useEffect(() => {
    const filtered = exports.filter((exp) => {
      const matchesSearch = 
        (exp.export_number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (exp.destination_lab?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (exp.courier?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        
      const shipmentStatus = mapStatusToShipmentStatus(exp.status);
      const matchesStatus = statusFilter === 'all' ? true : shipmentStatus === statusFilter;
      
      // Date range filtering
      const createdDate = exp.created_at ? new Date(exp.created_at) : null;
      const matchesDateRange = 
        createdDate && 
        (!startDate || createdDate >= startDate) && 
        (!endDate || createdDate <= new Date(endDate.getTime() + 86400000)); // Add one day to include the end date fully
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });

    const formatted: ExportItem[] = filtered.map(exp => ({
      id: exp.export_number,
      destinationLab: exp.destination_lab,
      courier: exp.courier || 'Not specified',
      status: mapStatusToShipmentStatus(exp.status),
      departureDate: exp.departure_date ? new Date(exp.departure_date).toLocaleDateString() : 'Not scheduled',
      animalType: exp.animal_type,
      country: exp.destination_lab.split(',').length > 1 ? exp.destination_lab.split(',')[1].trim() : 'Unknown',
      createdAt: exp.created_at ? new Date(exp.created_at).toLocaleDateString() : 'Unknown'
    }));
    
    setFilteredExports(formatted);
    
    setTotalPages(Math.max(1, Math.ceil(formatted.length / ITEMS_PER_PAGE)));
    
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [exports, searchQuery, statusFilter, startDate, endDate]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const paginatedExports = filteredExports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );
  
  const toggleViewMode = () => setViewMode(viewMode === 'table' ? 'card' : 'table');
  
  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exports</h1>
          <p className="text-muted-foreground">
            Manage and track outgoing animal shipments
          </p>
        </div>
        <Button asChild>
          <Link to="/shipments/new?type=export">
            <Truck className="mr-2 h-4 w-4" />
            New Export
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <CardTitle>Export Shipments</CardTitle>
              <CardDescription>
                View and manage all outgoing animal shipments
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
                    Select a date range to filter exports
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
          <ExportFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            toggleViewMode={toggleViewMode}
            viewMode={viewMode}
            onDateRangeChange={handleDateRangeChange}
          />
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="flex space-x-2">
                <div className="h-3 w-3 bg-rose-300 rounded-full animate-pulse"></div>
                <div className="h-3 w-3 bg-rose-400 rounded-full animate-pulse delay-150"></div>
                <div className="h-3 w-3 bg-rose-500 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          ) : viewMode === 'table' ? (
            <ExportTable exports={paginatedExports} />
          ) : (
            <ExportCards exports={paginatedExports} />
          )}
          
          {filteredExports.length > ITEMS_PER_PAGE && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationLink isActive>{currentPage}</PaginationLink>
                  </PaginationItem>
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="text-center text-sm text-muted-foreground mt-2">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredExports.length)} of {filteredExports.length} exports
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Exports;
