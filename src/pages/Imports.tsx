
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
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpDown, 
  Calendar, 
  Filter, 
  Search,
  Truck
} from 'lucide-react';
import { ShipmentStatus } from '@/types';

// Mock import data for demonstration
const mockImports = [
  {
    id: "IMP-001",
    sendingLab: "Berlin Research Center",
    courier: "Global Express",
    status: "progress" as ShipmentStatus,
    arrivalDate: "2023-10-15",
    animalType: "Rodents"
  },
  {
    id: "IMP-002",
    sendingLab: "Tokyo Life Sciences",
    courier: "Animal Transit Co.",
    status: "complete" as ShipmentStatus,
    arrivalDate: "2023-09-28",
    animalType: "Zebrafish"
  },
  {
    id: "IMP-003",
    sendingLab: "Stockholm Institute",
    courier: "Biolife Logistics",
    status: "draft" as ShipmentStatus,
    arrivalDate: "2023-11-05",
    animalType: "Rodents"
  }
];

const Imports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
  // Filter imports based on search query and status filter
  const filteredImports = mockImports.filter((imp) => {
    const matchesSearch = 
      imp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      imp.sendingLab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      imp.courier.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter ? imp.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
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
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search imports..."
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
          
          {viewMode === 'table' ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Import Number</TableHead>
                    <TableHead>Sending Lab</TableHead>
                    <TableHead>Courier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Arrival Date</TableHead>
                    <TableHead>Animal Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredImports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        No import shipments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredImports.map((imp) => (
                      <TableRow key={imp.id}>
                        <TableCell className="font-medium">
                          <Link 
                            to={`/shipments/${imp.id}`}
                            className="text-primary hover:underline"
                          >
                            {imp.id}
                          </Link>
                        </TableCell>
                        <TableCell>{imp.sendingLab}</TableCell>
                        <TableCell>{imp.courier}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`
                              bg-app-status-${imp.status}/20 
                              text-app-status-${imp.status} 
                              border-app-status-${imp.status}/50
                            `}
                          >
                            {imp.status === 'draft' ? 'Draft' : 
                             imp.status === 'progress' ? 'In Progress' : 'Complete'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {imp.arrivalDate}
                          </div>
                        </TableCell>
                        <TableCell>{imp.animalType}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredImports.length === 0 ? (
                <div className="col-span-full text-center py-12 border rounded-md">
                  <p className="text-muted-foreground">No import shipments found</p>
                </div>
              ) : (
                filteredImports.map((imp) => (
                  <Card key={imp.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Link to={`/shipments/${imp.id}`}>
                          <CardTitle className="text-primary hover:underline">
                            {imp.id}
                          </CardTitle>
                        </Link>
                        <Badge
                          variant="outline"
                          className={`
                            bg-app-status-${imp.status}/20 
                            text-app-status-${imp.status} 
                            border-app-status-${imp.status}/50
                          `}
                        >
                          {imp.status === 'draft' ? 'Draft' : 
                          imp.status === 'progress' ? 'In Progress' : 'Complete'}
                        </Badge>
                      </div>
                      <CardDescription>{imp.sendingLab}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Courier:</span>
                          <span className="text-sm font-medium">{imp.courier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Arrival Date:</span>
                          <span className="text-sm font-medium">{imp.arrivalDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Animal Type:</span>
                          <span className="text-sm font-medium">{imp.animalType}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Imports;
