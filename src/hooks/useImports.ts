
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ShipmentStatus } from '@/types';
import { toast } from 'sonner';
import { mapStatusToShipmentStatus } from '@/lib/utils';

// Interface for database items
export interface ImportDatabaseItem {
  id: string;
  import_number: string;
  sending_lab: string;
  courier: string | null;
  status: string | null;
  arrival_date: string | null;
  animal_type: string;
  quantity: string;
  created_at: string;
  // Additional fields
  courier_account_number?: string | null;
  created_by?: string | null;
  lab_contact_email?: string | null;
  lab_contact_name?: string | null;
  notes?: string | null;
  protocol_number?: string | null;
  tracking_number?: string | null;
  checklist?: string | null;
}

// Interface for formatted import items
export interface ImportItem {
  id: string;
  sendingLab: string;
  courier: string;
  status: ShipmentStatus;
  arrivalDate: string;
  animalType: string;
}

// Items per page - 15 per page
const ITEMS_PER_PAGE = 15;

export const useImports = () => {
  const [imports, setImports] = useState<ImportDatabaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredImports, setFilteredImports] = useState<ImportItem[]>([]);

  // Use cards by default on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('card');
      }
    };
    
    // Set initial view mode based on screen size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch imports from Supabase
  useEffect(() => {
    const fetchImports = async () => {
      setLoading(true);
      try {
        console.log("Fetching imports from Supabase...");
        const { data, error } = await supabase
          .from('imports')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        console.log("Fetched imports:", data?.length || 0);
        if (data) {
          setImports(data);
        } else {
          setImports([]);
        }
      } catch (error) {
        console.error('Error fetching imports:', error);
        toast.error('Failed to load imports. Please try again.');
        setImports([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImports();
  }, []);

  // Filter and format imports when data or filters change
  useEffect(() => {
    // Filter imports based on search query and status filter
    const filtered = imports.filter((imp) => {
      const matchesSearch = 
        (imp.import_number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (imp.sending_lab?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (imp.courier?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        
      // For filtering, convert the database status to our component status type
      const shipmentStatus = mapStatusToShipmentStatus(imp.status);
      const matchesStatus = statusFilter === 'all' ? true : shipmentStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Format imports for the components
    const formatted: ImportItem[] = filtered.map(imp => ({
      id: imp.import_number,
      sendingLab: imp.sending_lab || 'Unknown Lab',
      courier: imp.courier || 'Not specified',
      status: mapStatusToShipmentStatus(imp.status),
      arrivalDate: imp.arrival_date ? new Date(imp.arrival_date).toLocaleDateString() : 'Not scheduled',
      animalType: imp.animal_type
    }));
    
    setFilteredImports(formatted);
    
    // Update pagination
    setTotalPages(Math.max(1, Math.ceil(formatted.length / ITEMS_PER_PAGE)));
    
    // Reset to first page when filters change
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [imports, searchQuery, statusFilter, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Get paginated data
  const paginatedImports = filteredImports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const toggleViewMode = () => setViewMode(viewMode === 'table' ? 'card' : 'table');

  return {
    rawImports: imports,
    imports: paginatedImports,
    allFilteredImports: filteredImports,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    viewMode,
    toggleViewMode,
    currentPage,
    totalPages,
    handlePageChange,
    ITEMS_PER_PAGE
  };
};
