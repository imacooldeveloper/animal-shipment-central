
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import ImportFilters from '@/components/imports/ImportFilters';
import ImportTable from '@/components/imports/ImportTable';
import ImportCards from '@/components/imports/ImportCards';
import { ImportItem } from '@/hooks/useImports';

interface ImportsContentProps {
  imports: ImportItem[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  viewMode: 'table' | 'card';
  toggleViewMode: () => void;
}

const ImportsContent = ({
  imports,
  loading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  viewMode,
  toggleViewMode
}: ImportsContentProps) => {
  return (
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
  );
};

export default ImportsContent;
