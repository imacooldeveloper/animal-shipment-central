
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ShipmentStatus } from '@/types';

interface ExportItem {
  id: string;
  destinationLab: string;
  courier: string;
  status: ShipmentStatus;
  departureDate: string;
  animalType: string;
  country: string;
}

interface ExportCardsProps {
  exports: ExportItem[];
}

const ExportCards = ({ exports }: ExportCardsProps) => {
  if (exports.length === 0) {
    return (
      <div className="col-span-full text-center py-12 border rounded-md">
        <p className="text-muted-foreground">No export shipments found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {exports.map((exp) => (
        <Card key={exp.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Link to={`/shipments/${exp.id}`}>
                <CardTitle className="text-primary hover:underline">
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
      ))}
    </div>
  );
};

export default ExportCards;
