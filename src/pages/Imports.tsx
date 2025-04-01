
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
import ImportFilters from '@/components/imports/ImportFilters';
import ImportTable from '@/components/imports/ImportTable';
import ImportCards from '@/components/imports/ImportCards';

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

  const toggleViewMode = () => setViewMode(viewMode === 'table' ? 'card' : 'table');
  
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
          
          {viewMode === 'table' ? (
            <ImportTable imports={filteredImports} />
          ) : (
            <ImportCards imports={filteredImports} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Imports;
