
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ShipmentStatus } from '@/types';
import ShipmentStatusBadge from '@/components/ShipmentStatusBadge';

interface ImportItem {
  id: string;
  sendingLab: string;
  courier: string;
  status: ShipmentStatus;
  arrivalDate: string;
  animalType: string;
}

interface ImportCardsProps {
  imports: ImportItem[];
}

const ImportCards = ({ imports }: ImportCardsProps) => {
  if (imports.length === 0) {
    return (
      <div className="col-span-full text-center py-12 border rounded-md">
        <p className="text-muted-foreground">No import shipments found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {imports.map((imp) => (
        <Card key={imp.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Link to={`/shipments/${imp.id}`}>
                <CardTitle className="text-primary hover:underline">
                  {imp.id}
                </CardTitle>
              </Link>
              <ShipmentStatusBadge status={imp.status} />
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
      ))}
    </div>
  );
};

export default ImportCards;
