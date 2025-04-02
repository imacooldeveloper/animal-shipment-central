
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ShipmentStatus } from '@/types';
import ShipmentTypeBadge from '@/components/ShipmentTypeBadge';

interface ExportItem {
  id: string;
  destinationLab: string;
  courier: string;
  status: ShipmentStatus;
  departureDate: string;
  animalType: string;
  country: string;
}

interface ExportTableProps {
  exports: ExportItem[];
}

const ExportTable = ({ exports }: ExportTableProps) => {
  if (exports.length === 0) {
    return (
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
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                No export shipments found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
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
          {exports.map((exp) => (
            <TableRow key={exp.id}>
              <TableCell className="font-medium">
                <Link 
                  to={`/exports/${exp.id}`}
                  className="text-primary hover:underline"
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExportTable;
