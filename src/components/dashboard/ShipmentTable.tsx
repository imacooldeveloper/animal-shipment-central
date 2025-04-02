
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ShipmentStatusBadge from '@/components/ShipmentStatusBadge';
import { DashboardShipment } from '@/types';
import { ShipmentStatus } from '@/types';

interface ShipmentTableProps {
  shipments: DashboardShipment[];
  isLoading: boolean;
}

const ShipmentTable = ({ shipments, isLoading }: ShipmentTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Shipment ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Lab</TableHead>
            <TableHead>Animal Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Loading shipments...
              </TableCell>
            </TableRow>
          ) : shipments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No shipments found.
              </TableCell>
            </TableRow>
          ) : (
            shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">{shipment.id}</TableCell>
                <TableCell className="capitalize">{shipment.type}</TableCell>
                <TableCell>{shipment.lab}</TableCell>
                <TableCell>{shipment.animalType}</TableCell>
                <TableCell>
                  <ShipmentStatusBadge status={shipment.status as ShipmentStatus} />
                </TableCell>
                <TableCell>{shipment.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/${shipment.type}s/${shipment.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShipmentTable;
