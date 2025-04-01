
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
import ImportFilters from '@/components/imports/ImportFilters';
import ImportTable from '@/components/imports/ImportTable';
import ImportCards from '@/components/imports/ImportCards';
import { useImports } from '@/hooks/useImports';

const Imports = () => {
  const {
    imports,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    viewMode,
    toggleViewMode
  } = useImports();
  
  return (
    <div className="space-y-4 md:space-y-6 container mx-auto px-2 py-4 md:p-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Imports</h1>
          <p className="text-muted-foreground">
            Manage and track incoming animal shipments
          </p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link to="/shipments/new">
            <Truck className="mr-2 h-4 w-4" />
            New Import
          </Link>
        </Button>
      </div>
      
      <Card className="overflow-hidden">
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
            viewMode={viewMode}
          />
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-muted-foreground">Loading imports...</p>
            </div>
          ) : viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <ImportTable imports={imports} />
            </div>
          ) : (
            <ImportCards imports={imports} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Imports;
