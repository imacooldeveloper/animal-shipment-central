
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
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
import ShipmentStatusBadge from '@/components/ShipmentStatusBadge';

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
            <TableHead className="hidden md:table-cell">Sending Lab</TableHead>
            <TableHead className="hidden md:table-cell">Courier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Arrival Date</TableHead>
            <TableHead className="hidden md:table-cell">Animal Type</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
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
                <div className="md:hidden mt-1 flex flex-col space-y-1">
                  <div className="text-xs text-muted-foreground">
                    {imp.sendingLab}
                  </div>
                  <div className="text-xs">
                    {imp.courier}
                  </div>
                  <div className="text-xs flex items-center">
                    <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                    {imp.arrivalDate}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{imp.sendingLab}</TableCell>
              <TableCell className="hidden md:table-cell">{imp.courier}</TableCell>
              <TableCell>
                <ShipmentStatusBadge status={imp.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {imp.arrivalDate}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{imp.animalType}</TableCell>
              <TableCell className="hidden md:table-cell">
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
