import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Box,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ShipmentStatus } from '@/types';
import ShipmentTypeBadge from '@/components/ShipmentTypeBadge';
import ShipmentStatusBadge from '@/components/ShipmentStatusBadge';
import { supabase } from "@/integrations/supabase/client";
import { ImportDatabaseItem } from '@/hooks/useImports';
import { ExportDatabaseItem } from '@/pages/Exports';
import { mapStatusToShipmentStatus } from '@/lib/utils';
import { toast } from "sonner";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

// Updated to 15 items per page
const ITEMS_PER_PAGE = 15;

const Shipments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialStatusFilter = queryParams.get('status') || "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [activeTab, setActiveTab] = useState<string>("all");
  const [shipments, setShipments] = useState<CombinedShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch shipments from Supabase
  useEffect(() => {
    const fetchShipments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching shipments from Supabase...");
        
        // Fetch imports
        const { data: importsData, error: importsError } = await supabase
          .from('imports')
          .select('*');
        
        if (importsError) {
          console.error("Error fetching imports:", importsError);
          throw importsError;
        }
        
        // Fetch exports
        const { data: exportsData, error: exportsError } = await supabase
          .from('exports')
          .select('*');
        
        if (exportsError) {
          console.error("Error fetching exports:", exportsError);
          throw exportsError;
        }
        
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
        const allShipments = [...formattedImports, ...formattedExports];
        
        if (allShipments.length === 0) {
          console.log("No shipments found in the database");
        } else {
          console.log(`Found ${allShipments.length} total shipments`);
        }
        
        setShipments(allShipments);
        
        // Display toast notification of success
        toast.success(`Found ${allShipments.length} shipments`);
      } catch (error: any) {
        console.error('Error fetching shipments:', error);
        setError(error.message || 'Failed to load shipments');
        toast.error(`Failed to load shipments: ${error.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShipments();
  }, []);
  
  const [filteredShipments, setFilteredShipments] = useState<CombinedShipment[]>([]);
  
  // Update filtered shipments when filters change
  useEffect(() => {
    const matchesSearch = (shipment: CombinedShipment) =>
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.lab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shipment.courier?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      shipment.country.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = (shipment: CombinedShipment) =>
      statusFilter === "all" ? true : shipment.status === statusFilter;
      
    const matchesType = (shipment: CombinedShipment) =>
      typeFilter === "all" ? true : shipment.type === typeFilter;
      
    const matchesTab = (shipment: CombinedShipment) =>
      activeTab === "all" ? true : 
      activeTab === "imports" ? shipment.type === "import" : 
      activeTab === "exports" ? shipment.type === "export" : true;
    
    const newFilteredShipments = shipments.filter(shipment => 
      matchesSearch(shipment) && matchesStatus(shipment) && matchesType(shipment) && matchesTab(shipment)
    );
    
    setFilteredShipments(newFilteredShipments);
  }, [shipments, searchQuery, statusFilter, typeFilter, activeTab]);

  // Update URL when statusFilter changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    } else {
      params.delete("status");
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [statusFilter, location.pathname, location.search]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page on tab change
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page on status filter change
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get paginated data for 15 items per page
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );
  
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
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
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
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
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
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="import">Import</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" title="Filter">
                  <Filter className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  title={viewMode === 'table' ? 'Switch to card view' : 'Switch to table view'}
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
                <Box className="h-10 w-10 text-destructive mb-2" />
                <h3 className="text-lg font-medium text-destructive">Error loading shipments</h3>
                <p className="text-muted-foreground mt-1">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <TabsContent value="all" className="m-0">
                  {renderShipmentsList(paginatedShipments, viewMode)}
                </TabsContent>
                
                <TabsContent value="imports" className="m-0">
                  {renderShipmentsList(
                    filteredShipments.filter(s => s.type === 'import').slice(
                      (currentPage - 1) * ITEMS_PER_PAGE,
                      currentPage * ITEMS_PER_PAGE
                    ),
                    viewMode
                  )}
                </TabsContent>
                
                <TabsContent value="exports" className="m-0">
                  {renderShipmentsList(
                    filteredShipments.filter(s => s.type === 'export').slice(
                      (currentPage - 1) * ITEMS_PER_PAGE,
                      currentPage * ITEMS_PER_PAGE
                    ),
                    viewMode
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Pagination */}
      {filteredShipments.length > ITEMS_PER_PAGE && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* First page */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
                </PaginationItem>
              )}
              
              {/* Ellipsis for many pages */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              {/* Previous page if not on page 1 */}
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {/* Current page */}
              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>
              
              {/* Next page if not on last page */}
              {/* Next page if not on last page */}
              {currentPage < Math.ceil(filteredShipments.length / ITEMS_PER_PAGE) && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {/* Ellipsis for many pages */}
              {currentPage < Math.ceil(filteredShipments.length / ITEMS_PER_PAGE) - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              {/* Last page */}
              {currentPage < Math.ceil(filteredShipments.length / ITEMS_PER_PAGE) - 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(Math.ceil(filteredShipments.length / ITEMS_PER_PAGE))}>
                    {Math.ceil(filteredShipments.length / ITEMS_PER_PAGE)}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < Math.ceil(filteredShipments.length / ITEMS_PER_PAGE) && handlePageChange(currentPage + 1)}
                  className={currentPage === Math.ceil(filteredShipments.length / ITEMS_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="text-center text-sm text-muted-foreground mt-2">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredShipments.length)} of {filteredShipments.length} shipments
          </div>
        </div>
      )}
    </div>
  );
};

const renderShipmentsList = (shipments: CombinedShipment[], viewMode: 'table' | 'card') => {
  if (shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-md bg-background/50">
        <Box className="h-10 w-10 text-muted-foreground mb-2" />
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
                    to={`/${shipment.type}s/${shipment.id}`}
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
                <Link to={`/${shipment.type}s/${shipment.id}`}>
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
