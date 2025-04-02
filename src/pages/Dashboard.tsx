
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Plus, Search } from 'lucide-react';
import ShipmentStatusBadge from '@/components/ShipmentStatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { ImportDatabaseItem } from '@/hooks/useImports';
import { useQuery } from '@tanstack/react-query';
import { mapStatusToShipmentStatus } from '@/lib/utils';
import { toast } from 'sonner';

// Unified type for dashboard display
interface DashboardShipment {
  id: string;
  type: 'import' | 'export';
  country: string;
  lab: string;
  animalType: string;
  status: string;
  lastUpdated: string;
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Fetch imports and exports using React Query
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

  const exportsQuery = useQuery({
    queryKey: ['exports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
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
      lab: item.sending_lab,
      animalType: item.animal_type,
      status: mapStatusToShipmentStatus(item.status),
      lastUpdated: new Date(item.created_at).toLocaleDateString()
    }));
    
    const formattedExports = exports.map(item => ({
      id: item.export_number,
      type: 'export' as const,
      country: 'N/A', // Could be enhanced with country data
      lab: item.destination_lab,
      animalType: item.animal_type,
      status: mapStatusToShipmentStatus(item.status),
      lastUpdated: new Date(item.created_at).toLocaleDateString()
    }));
    
    return [...formattedImports, ...formattedExports];
  };

  // Get all shipments and apply filters
  const allShipments = formatDashboardData();
  
  const filteredShipments = allShipments.filter(shipment => {
    const matchesSearch = searchTerm === '' || 
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.lab.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesType = typeFilter === 'all' || shipment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get counts for dashboard cards
  const getShipmentCounts = () => {
    return {
      total: allShipments.length,
      draft: allShipments.filter(s => s.status === 'draft').length,
      progress: allShipments.filter(s => s.status === 'progress').length,
      complete: allShipments.filter(s => s.status === 'complete').length,
    };
  };

  const counts = getShipmentCounts();
  const isLoading = importsQuery.isLoading || exportsQuery.isLoading;
  const isError = importsQuery.isError || exportsQuery.isError;

  // Show error toast if needed
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load shipment data');
    }
  }, [isError]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/shipments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.progress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.complete}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
          <CardDescription>Manage and track your animal shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or lab..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="import">Import</SelectItem>
                <SelectItem value="export">Export</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Lab</TableHead>
                  <TableHead>Animal Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Loading shipments...
                    </TableCell>
                  </TableRow>
                ) : filteredShipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No shipments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.id}</TableCell>
                      <TableCell className="capitalize">{shipment.type}</TableCell>
                      <TableCell>{shipment.lab}</TableCell>
                      <TableCell>{shipment.animalType}</TableCell>
                      <TableCell>
                        <ShipmentStatusBadge status={shipment.status} />
                      </TableCell>
                      <TableCell>{shipment.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/${shipment.type}s/${shipment.id}`}>
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
