
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ImportDatabaseItem, ExportDatabaseItem, DashboardShipment, ShipmentStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { mapStatusToShipmentStatus } from '@/lib/utils';
import { toast } from 'sonner';

// Import the smaller dashboard components
import DashboardCards from '@/components/dashboard/DashboardCards';
import ShipmentFilters from '@/components/dashboard/ShipmentFilters';
import ShipmentTable from '@/components/dashboard/ShipmentTable';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [filteredShipments, setFilteredShipments] = useState<DashboardShipment[]>([]);
  const [shipmentCounts, setShipmentCounts] = useState({
    total: 0,
    draft: 0,
    progress: 0,
    complete: 0
  });

  // Fetch imports using React Query
  const importsQuery = useQuery({
    queryKey: ['imports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('imports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ImportDatabaseItem[];
    }
  });

  // Fetch exports using React Query
  const exportsQuery = useQuery({
    queryKey: ['exports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ExportDatabaseItem[];
    }
  });

  // Format data for dashboard display
  const formatDashboardData = (): DashboardShipment[] => {
    const imports = importsQuery.data || [];
    const exports = exportsQuery.data || [];
    
    const formattedImports = imports.map(item => ({
      id: item.import_number,
      type: 'import' as const,
      country: 'N/A', // Could be enhanced with country data
      lab: item.sending_lab || 'Unknown',
      animalType: item.animal_type || 'Unknown',
      status: mapStatusToShipmentStatus(item.status) as ShipmentStatus,
      lastUpdated: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown'
    }));
    
    const formattedExports = exports.map(item => ({
      id: item.export_number,
      type: 'export' as const,
      country: 'N/A', // Could be enhanced with country data
      lab: item.destination_lab || 'Unknown',
      animalType: item.animal_type || 'Unknown',
      status: mapStatusToShipmentStatus(item.status) as ShipmentStatus,
      lastUpdated: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown'
    }));
    
    return [...formattedImports, ...formattedExports];
  };

  // Update filtered shipments and counts when data or filters change
  useEffect(() => {
    const allShipments = formatDashboardData();
    
    // Apply filters
    const filtered = allShipments.filter(shipment => {
      const matchesSearch = searchTerm === '' || 
        shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.lab.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
      const matchesType = typeFilter === 'all' || shipment.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
    
    setFilteredShipments(filtered);
    
    // Update counts
    setShipmentCounts({
      total: allShipments.length,
      draft: allShipments.filter(s => s.status === 'draft').length,
      progress: allShipments.filter(s => s.status === 'progress').length,
      complete: allShipments.filter(s => s.status === 'complete').length,
    });
  }, [importsQuery.data, exportsQuery.data, searchTerm, statusFilter, typeFilter]);

  const isLoading = importsQuery.isLoading || exportsQuery.isLoading;
  const isError = importsQuery.isError || exportsQuery.isError;

  // Show error toast if needed
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load shipment data');
    }
  }, [isError]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your shipments and get insights about recent activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="rounded-full shadow-md">
            <Link to="/shipments/new">
              <Plus className="mr-2 h-4 w-4" />
              New Shipment
            </Link>
          </Button>
        </div>
      </div>

      <DashboardCards counts={shipmentCounts} />

      <Card className="mt-8 shadow-sm border-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Shipments</h2>
          </div>
          
          <ShipmentFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />

          <ShipmentTable 
            shipments={filteredShipments} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
