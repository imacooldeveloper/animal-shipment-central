import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShipmentStatus } from '@/types';
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
  created_at: string;
  // Additional fields that might be in the database
  courier_account_number?: string | null;
  created_by?: string | null;
  lab_contact_email?: string | null;
  lab_contact_name?: string | null;
  notes?: string | null;
  protocol_number?: string | null;
  quantity?: string;
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

export const useImports = () => {
  const [imports, setImports] = useState<ImportDatabaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  
  // Map database status string to ShipmentStatus enum
  const mapStatusToShipmentStatus = (status: string | null): ShipmentStatus => {
    if (!status) return 'draft';
    
    // Map common status values to ShipmentStatus
    if (status.toLowerCase().includes('draft') || 
        status.toLowerCase().includes('init') || 
        status === 'Initializing Import') {
      return 'draft';
    }
    
    if (status.toLowerCase().includes('progress') || 
        status.toLowerCase().includes('transit') || 
        status.toLowerCase().includes('waiting')) {
      return 'progress';
    }
    
    if (status.toLowerCase().includes('complete') || 
        status.toLowerCase().includes('delivered')) {
      return 'complete';
    }
    
    // Default fallback
    return 'draft';
  };
  
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
        const { data, error } = await supabase
          .from('imports')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
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
  
  // Filter imports based on search query and status filter
  const filteredImports = imports.filter((imp) => {
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
  const formattedImports: ImportItem[] = filteredImports.map(imp => ({
    id: imp.import_number || imp.id,
    sendingLab: imp.sending_lab,
    courier: imp.courier || 'Not specified',
    status: mapStatusToShipmentStatus(imp.status),
    arrivalDate: imp.arrival_date || 'Not scheduled',
    animalType: imp.animal_type
  }));
  
  const toggleViewMode = () => setViewMode(viewMode === 'table' ? 'card' : 'table');
  
  return {
    imports: formattedImports,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    viewMode,
    toggleViewMode
  };
};
