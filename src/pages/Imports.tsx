
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

interface ImportItem {
  id: string;
  import_number: string;
  sending_lab: string;
  courier: string;
  status: ShipmentStatus;
  arrival_date: string;
  animal_type: string;
  created_at: string;
}

const Imports = () => {
  const [imports, setImports] = useState<ImportItem[]>([]);
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
  
  // Filter imports based on search query and status filter
  const filteredImports = imports.filter((imp) => {
    const matchesSearch = 
      imp.import_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      imp.sending_lab?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      imp.courier?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter ? imp.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const toggleViewMode = () => setViewMode(viewMode === 'table' ? 'card' : 'table');
  
  // Format imports for the components
  const formattedImports = filteredImports.map(imp => ({
    id: imp.import_number,
    sendingLab: imp.sending_lab,
    courier: imp.courier || 'Not specified',
    status: imp.status as ShipmentStatus || 'draft',
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
