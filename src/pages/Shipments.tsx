import { useState } from 'react';
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
  Truck
} from 'lucide-react';
import { ShipmentStatus } from '@/types';
import ShipmentTypeBadge from '@/components/ShipmentTypeBadge';
import ShipmentStatusBadge from '@/components/ShipmentStatusBadge';

const mockShipments = [
  {
    id: "IMP-001",
    type: "import" as const,
    lab: "Berlin Research Center",
    courier: "Global Express",
    status: "progress" as ShipmentStatus,
    date: "2023-10-15",
    animalType: "Rodents",
    country: "Germany"
  },
  {
    id: "EXP-001",
    type: "export" as const,
    lab: "Paris Research Center",
    courier: "Global Express",
    status: "progress" as ShipmentStatus,
    date: "2023-10-15",
    animalType: "Rodents",
    country: "France"
  },
  {
    id: "IMP-002",
    type: "import" as const,
    lab: "Tokyo Life Sciences",
    courier: "Animal Transit Co.",
    status: "complete" as ShipmentStatus,
    date: "2023-09-28",
    animalType: "Zebrafish",
    country: "Japan"
  },
  {
    id: "EXP-002",
    type: "export" as const,
    lab: "Oxford University",
    courier: "Animal Transit Co.",
    status: "complete" as ShipmentStatus,
    date: "2023-09-28",
    animalType: "Zebrafish",
    country: "United Kingdom"
  },
  {
    id: "IMP-003",
    type: "import" as const,
    lab: "Stockholm Institute",
    courier: "Biolife Logistics",
    status: "draft" as ShipmentStatus,
    date: "2023-11-05",
    animalType: "Rodents",
    country: "Sweden"
  },
  {
    id: "EXP-003",
    type: "export" as const,
    lab: "Madrid Institute",
    courier: "Biolife Logistics",
    status: "draft" as ShipmentStatus,
    date: "2023-11-05",
    animalType: "Rodents",
    country: "Spain"
  }
];

const Shipments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const filteredShipments = mockShipments.filter((shipment) => {
    const matchesSearch = 
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.lab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.courier.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            
            <TabsContent value="all" className="m-0">
              {renderShipmentsList(filteredShipments, viewMode)}
            </TabsContent>
            
            <TabsContent value="imports" className="m-0">
              {renderShipmentsList(filteredShipments, viewMode)}
            </TabsContent>
            
            <TabsContent value="exports" className="m-0">
              {renderShipmentsList(filteredShipments, viewMode)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const renderShipmentsList = (shipments: typeof mockShipments, viewMode: 'table' | 'card') => {
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
            {shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No shipments found
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((shipment) => (
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
                  <TableCell>{shipment.courier}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shipments.length === 0 ? (
          <div className="col-span-full text-center py-12 border rounded-md">
            <p className="text-muted-foreground">No shipments found</p>
          </div>
        ) : (
          shipments.map((shipment) => (
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
                    <span className="text-sm font-medium">{shipment.courier}</span>
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
          ))
        )}
      </div>
    );
  }
};

export default Shipments;
