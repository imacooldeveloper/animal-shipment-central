
import { Search, Filter, LayoutList, LayoutGrid } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ImportFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  toggleViewMode: () => void;
  viewMode: 'table' | 'card';
}

const ImportFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  toggleViewMode,
  viewMode
}: ImportFiltersProps) => {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search imports..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="progress">In Progress</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button variant="outline" size="icon" className="ml-auto">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleViewMode}
            title={viewMode === 'table' ? 'Switch to card view' : 'Switch to table view'}
          >
            {viewMode === 'table' ? 
              <LayoutGrid className="h-4 w-4" /> : 
              <LayoutList className="h-4 w-4" />
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportFilters;
