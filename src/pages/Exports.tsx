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
import { Truck } from 'lucide-react';
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
}

const ITEMS_PER_PAGE = 15;

const Exports = () => {
  const [exports, setExports] = useState<ExportDatabaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredExports, setFilteredExports] = useState<ExportItem[]>([]);
  
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
      
      return matchesSearch && matchesStatus;
    });

    const formatted: ExportItem[] = filtered.map(exp => ({
      id: exp.export_number,
      destinationLab: exp.destination_lab,
      courier: exp.courier || 'Not specified',
      status: mapStatusToShipmentStatus(exp.status),
      departureDate: exp.departure_date ? new Date(exp.departure_date).toLocaleDateString() : 'Not scheduled',
      animalType: exp.animal_type,
      country: exp.destination_lab.split(',').length > 1 ? exp.destination_lab.split(',')[1].trim() : 'Unknown'
    }));
    
    setFilteredExports(formatted);
    
    setTotalPages(Math.max(1, Math.ceil(formatted.length / ITEMS_PER_PAGE)));
    
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [exports, searchQuery, statusFilter]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const paginatedExports = filteredExports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );
  
  const toggleViewMode = () => setViewMode(viewMode === 'table' ? 'card' : 'table');
  
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
          <CardTitle>Export Shipments</CardTitle>
          <CardDescription>
            View and manage all outgoing animal shipments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExportFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            toggleViewMode={toggleViewMode}
            viewMode={viewMode}
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
