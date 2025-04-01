
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Truck } from 'lucide-react';

const ImportsHeader = () => {
  return (
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
  );
};

export default ImportsHeader;
