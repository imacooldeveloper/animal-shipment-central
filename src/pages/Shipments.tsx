
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpDown, 
  Calendar, 
  Filter, 
  Plus, 
  Search,
  Truck,
  Loader2,
  BoxX
} from 'lucide-react';
import { ShipmentStatus } from '@/types';
import ShipmentTypeBadge from '@/components/ShipmentTypeBadge';
import ShipmentStatusBadge from '@/components/ShipmentStatusBadge';
import { supabase } from "@/integrations/supabase/client";
import { ImportDatabaseItem } from '@/hooks/useImports';
import { ExportDatabaseItem } from '@/pages/Exports';
import { mapStatusToShipmentStatus } from '@/lib/utils';

interface CombinedShipment {
  id: string;
  type: "import" | "export";
  lab: string;
  courier: string | null;
  status: ShipmentStatus;
  date: string;
  animalType: string;
  country: string;
}

const Shipments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [activeTab, setActiveTab] = useState<string>("all");
  const [shipments, setShipments] = useState<CombinedShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch shipments from Supabase
  useEffect(() => {
    const fetchShipments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching completed shipments from Supabase...");
        
        // Fetch completed imports
        const { data: importsData, error: importsError } = await supabase
          .from('imports')
          .select('*');
        
        if (importsError) throw importsError;
        
        // Fetch completed exports
        const { data: exportsData, error: exportsError } = await supabase
          .from('exports')
          .select('*');
        
        if (exportsError) throw exportsError;
        
        console.log('Fetched imports:', importsData?.length || 0);
        console.log('Fetched exports:', exportsData?.length || 0);
        
        // Format imports
        const formattedImports: CombinedShipment[] = (importsData || []).map((item: ImportDatabaseItem) => ({
          id: item.import_number,
          type: "import",
          lab: item.sending_lab || "Unknown Lab",
          courier: item.courier,
          status: mapStatusToShipmentStatus(item.status),
          date: item.arrival_date ? new Date(item.arrival_date).toISOString().split('T')[0] : 'Not scheduled',
          animalType: item.animal_type,
          country: "N/A" // Could extract country from lab if available
        }));
        
        // Format exports
        const formattedExports: CombinedShipment[] = (exportsData || []).map((item: ExportDatabaseItem) => {
          // Extract country from destination lab if possible
          const labParts = item.destination_lab?.split(',') || [];
          const country = labParts.length > 1 ? labParts[1].trim() : "Unknown";
          
          return {
            id: item.export_number,
            type: "export",
            lab: item.destination_lab || "Unknown Lab",
            courier: item.courier,
            status: mapStatusToShipmentStatus(item.status),
            date: item.departure_date ? new Date(item.departure_date).toISOString().split('T')[0] : 'Not scheduled',
            animalType: item.animal_type,
            country: country
          };
        });
        
        // Combine shipments
        setShipments([...formattedImports, ...formattedExports]);
      } catch (error: any) {
        console.error('Error fetching shipments:', error);
        setError(error.message || 'Failed to load shipments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchShipments();
  }, []);
  
  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch = 
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.lab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shipment.courier?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      shipment.country.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter ? shipment.status === statusFilter : true;
    const matchesType = typeFilter ? shipment.type === typeFilter : true;
    const matchesTab = activeTab === "all" ? true : 
                       activeTab === "imports" ? shipment.type === "import" : 
                       activeTab === "exports" ? shipment.type === "export" : true;
    
    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">
            Manage and track all animal shipments
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/imports">
              <Truck className="mr-2 h-4 w-4" />
              All Imports
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/exports">
              <Truck className="mr-2 h-4 w-4" />
              All Exports
            </Link>
          </Button>
          <Button asChild>
            <Link to="/shipments/new">
              <Plus className="mr-2 h-4 w-4" />
              New Shipment
            </Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Shipments</CardTitle>
          <CardDescription>
            View and manage all animal imports and exports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Shipments</TabsTrigger>
              <TabsTrigger value="imports">Imports</TabsTrigger>
              <TabsTrigger value="exports">Exports</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search shipments..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="progress">In Progress</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    <SelectItem value="import">Import</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading shipments...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BoxX className="h-10 w-10 text-destructive mb-2" />
                <h3 className="text-lg font-medium text-destructive">Error loading shipments</h3>
                <p className="text-muted-foreground mt-1">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <TabsContent value="all" className="m-0">
                  {renderShipmentsList(filteredShipments, viewMode)}
                </TabsContent>
                
                <TabsContent value="imports" className="m-0">
                  {renderShipmentsList(filteredShipments, viewMode)}
                </TabsContent>
                
                <TabsContent value="exports" className="m-0">
                  {renderShipmentsList(filteredShipments, viewMode)}
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const renderShipmentsList = (shipments: CombinedShipment[], viewMode: 'table' | 'card') => {
  if (shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-md bg-background/50">
        <BoxX className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No shipments found</h3>
        <p className="text-muted-foreground mt-1">There are no shipments matching your criteria</p>
        <Button asChild className="mt-4">
          <Link to="/shipments/new">
            <Plus className="mr-2 h-4 w-4" /> 
            Create New Shipment
          </Link>
        </Button>
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Lab</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Courier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Animal Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">
                  <Link 
                    to={`/shipments/${shipment.id}`}
                    className={`hover:underline ${
                      shipment.type === 'import' ? 'text-app-green' : 'text-app-blue'
                    }`}
                  >
                    {shipment.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <ShipmentTypeBadge type={shipment.type} />
                </TableCell>
                <TableCell>{shipment.lab}</TableCell>
                <TableCell>{shipment.country}</TableCell>
                <TableCell>{shipment.courier || 'Not specified'}</TableCell>
                <TableCell>
                  <ShipmentStatusBadge status={shipment.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {shipment.date}
                  </div>
                </TableCell>
                <TableCell>{shipment.animalType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shipments.map((shipment) => (
          <Card key={shipment.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Link to={`/shipments/${shipment.id}`}>
                  <CardTitle 
                    className={`hover:underline ${
                      shipment.type === 'import' ? 'text-app-green' : 'text-app-blue'
                    }`}
                  >
                    {shipment.id}
                  </CardTitle>
                </Link>
                <div className="flex gap-2">
                  <ShipmentTypeBadge type={shipment.type} />
                  <ShipmentStatusBadge status={shipment.status} />
                </div>
              </div>
              <CardDescription>{shipment.lab}, {shipment.country}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Courier:</span>
                  <span className="text-sm font-medium">{shipment.courier || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {shipment.type === 'import' ? 'Arrival' : 'Departure'} Date:
                  </span>
                  <span className="text-sm font-medium">{shipment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Animal Type:</span>
                  <span className="text-sm font-medium">{shipment.animalType}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};

export default Shipments;
