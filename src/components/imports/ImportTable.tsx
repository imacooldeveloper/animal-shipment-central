
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

interface ImportItem {
  id: string;
  sendingLab: string;
  courier: string;
  status: ShipmentStatus;
  arrivalDate: string;
  animalType: string;
}

interface ImportTableProps {
  imports: ImportItem[];
}

const ImportTable = ({ imports }: ImportTableProps) => {
  if (imports.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Import Number</TableHead>
              <TableHead>Sending Lab</TableHead>
              <TableHead>Courier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Arrival Date</TableHead>
              <TableHead>Animal Type</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                No import shipments found
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
            <TableHead>Import Number</TableHead>
            <TableHead>Sending Lab</TableHead>
            <TableHead>Courier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Arrival Date</TableHead>
            <TableHead>Animal Type</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {imports.map((imp) => (
            <TableRow key={imp.id}>
              <TableCell className="font-medium">
                <Link 
                  to={`/shipments/${imp.id}`}
                  className="text-primary hover:underline"
                >
                  {imp.id}
                </Link>
              </TableCell>
              <TableCell>{imp.sendingLab}</TableCell>
              <TableCell>{imp.courier}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`
                    bg-app-status-${imp.status}/20 
                    text-app-status-${imp.status} 
                    border-app-status-${imp.status}/50
                  `}
                >
                  {imp.status === 'draft' ? 'Draft' : 
                   imp.status === 'progress' ? 'In Progress' : 'Complete'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {imp.arrivalDate}
                </div>
              </TableCell>
              <TableCell>{imp.animalType}</TableCell>
              <TableCell>
                <ShipmentTypeBadge type="import" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ImportTable;
