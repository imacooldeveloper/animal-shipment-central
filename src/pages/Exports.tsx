
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

// Mock export data for demonstration
const mockExports = [
  {
    id: "EXP-001",
    destinationLab: "Paris Research Center",
    courier: "Global Express",
    status: "progress" as ShipmentStatus,
    departureDate: "2023-10-15",
    animalType: "Rodents",
    country: "France"
  },
  {
    id: "EXP-002",
    destinationLab: "Oxford University",
    courier: "Animal Transit Co.",
    status: "complete" as ShipmentStatus,
    departureDate: "2023-09-28",
    animalType: "Zebrafish",
    country: "United Kingdom"
  },
  {
    id: "EXP-003",
    destinationLab: "Madrid Institute",
    courier: "Biolife Logistics",
    status: "draft" as ShipmentStatus,
    departureDate: "2023-11-05",
    animalType: "Rodents",
    country: "Spain"
  }
];

const Exports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
  // Filter exports based on search query and status filter
  const filteredExports = mockExports.filter((exp) => {
    const matchesSearch = 
      exp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.destinationLab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.courier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.country.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter ? exp.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exports</h1>
          <p className="text-muted-foreground">
            Manage and track outgoing animal shipments
          </p>
        </div>
        <Button asChild>
          <Link to="/shipments/new">
            <Truck className="mr-2 h-4 w-4" />
            New Export
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Export Shipments</CardTitle>
          <CardDescription>
            View and manage all outgoing animal shipments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exports..."
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
                    <TableHead>Export Number</TableHead>
                    <TableHead>Destination Lab</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Courier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Departure Date</TableHead>
                    <TableHead>Animal Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        No export shipments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExports.map((exp) => (
                      <TableRow key={exp.id}>
                        <TableCell className="font-medium">
                          <Link 
                            to={`/shipments/${exp.id}`}
                            className="text-app-blue hover:underline"
                          >
                            {exp.id}
                          </Link>
                        </TableCell>
                        <TableCell>{exp.destinationLab}</TableCell>
                        <TableCell>{exp.country}</TableCell>
                        <TableCell>{exp.courier}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`
                              bg-app-status-${exp.status}/20 
                              text-app-status-${exp.status} 
                              border-app-status-${exp.status}/50
                            `}
                          >
                            {exp.status === 'draft' ? 'Draft' : 
                             exp.status === 'progress' ? 'In Progress' : 'Complete'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {exp.departureDate}
                          </div>
                        </TableCell>
                        <TableCell>{exp.animalType}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExports.length === 0 ? (
                <div className="col-span-full text-center py-12 border rounded-md">
                  <p className="text-muted-foreground">No export shipments found</p>
                </div>
              ) : (
                filteredExports.map((exp) => (
                  <Card key={exp.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Link to={`/shipments/${exp.id}`}>
                          <CardTitle className="text-app-blue hover:underline">
                            {exp.id}
                          </CardTitle>
                        </Link>
                        <Badge
                          variant="outline"
                          className={`
                            bg-app-status-${exp.status}/20 
                            text-app-status-${exp.status} 
                            border-app-status-${exp.status}/50
                          `}
                        >
                          {exp.status === 'draft' ? 'Draft' : 
                          exp.status === 'progress' ? 'In Progress' : 'Complete'}
                        </Badge>
                      </div>
                      <CardDescription>{exp.destinationLab}, {exp.country}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Courier:</span>
                          <span className="text-sm font-medium">{exp.courier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Departure Date:</span>
                          <span className="text-sm font-medium">{exp.departureDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Animal Type:</span>
                          <span className="text-sm font-medium">{exp.animalType}</span>
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

export default Exports;
