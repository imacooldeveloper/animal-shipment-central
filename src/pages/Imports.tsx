
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
import ImportFilters from '@/components/imports/ImportFilters';
import ImportTable from '@/components/imports/ImportTable';
import ImportCards from '@/components/imports/ImportCards';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Database item structure from Supabase
interface ImportDatabaseItem {
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
}

// Interface for component props (after formatting)
interface ImportItem {
  id: string;
  sendingLab: string;
  courier: string;
  status: ShipmentStatus;
  arrivalDate: string;
  animalType: string;
}

const Imports = () => {
  const [imports, setImports] = useState<ImportDatabaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
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
        
        setImports(data || []);
      } catch (error) {
        console.error('Error fetching imports:', error);
        toast.error('Failed to load imports. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchImports();
  }, []);
  
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
  
  // Filter imports based on search query and status filter
  const filteredImports = imports.filter((imp) => {
    const matchesSearch = 
      imp.import_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      imp.sending_lab?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      imp.courier?.toLowerCase().includes(searchQuery.toLowerCase());
      
    // For filtering, convert the database status to our component status type
    const shipmentStatus = mapStatusToShipmentStatus(imp.status);
    const matchesStatus = statusFilter ? shipmentStatus === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const toggleViewMode = () => setViewMode(viewMode === 'table' ? 'card' : 'table');
  
  // Format imports for the components
  const formattedImports: ImportItem[] = filteredImports.map(imp => ({
    id: imp.import_number,
    sendingLab: imp.sending_lab,
    courier: imp.courier || 'Not specified',
    status: mapStatusToShipmentStatus(imp.status),
    arrivalDate: imp.arrival_date || 'Not scheduled',
    animalType: imp.animal_type
  }));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Imports</h1>
          <p className="text-muted-foreground">
            Manage and track incoming animal shipments
          </p>
        </div>
        <Button asChild>
          <Link to="/shipments/new">
            <Truck className="mr-2 h-4 w-4" />
            New Import
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Import Shipments</CardTitle>
          <CardDescription>
            View and manage all incoming animal shipments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImportFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            toggleViewMode={toggleViewMode}
          />
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-muted-foreground">Loading imports...</p>
            </div>
          ) : viewMode === 'table' ? (
            <ImportTable imports={formattedImports} />
          ) : (
            <ImportCards imports={formattedImports} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Imports;
