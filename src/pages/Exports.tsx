
import { useState } from 'react';
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
import ExportFilters from '@/components/exports/ExportFilters';
import ExportTable from '@/components/exports/ExportTable';
import ExportCards from '@/components/exports/ExportCards';

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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
  // Filter exports based on search query and status filter
  const filteredExports = mockExports.filter((exp) => {
    const matchesSearch = 
      exp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.destinationLab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.courier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.country.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "all" ? true : exp.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const toggleViewMode = () => setViewMode(viewMode === 'table' ? 'card' : 'table');
  
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
          <ExportFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            toggleViewMode={toggleViewMode}
          />
          
          {viewMode === 'table' ? (
            <ExportTable exports={filteredExports} />
          ) : (
            <ExportCards exports={filteredExports} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Exports;
