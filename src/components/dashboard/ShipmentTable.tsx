
import { Link } from 'react-router-dom';
import { Eye, Box } from 'lucide-react';
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
    <div className="rounded-md border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Shipment ID</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Lab</TableHead>
            <TableHead className="font-semibold">Animal Type</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Last Updated</TableHead>
            <TableHead className="text-right font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex justify-center items-center space-x-2">
                  <div className="h-4 w-4 bg-rose-300 rounded-full animate-pulse"></div>
                  <div className="h-4 w-4 bg-rose-400 rounded-full animate-pulse delay-150"></div>
                  <div className="h-4 w-4 bg-rose-500 rounded-full animate-pulse delay-300"></div>
                  <span className="text-gray-500 ml-2">Loading shipments...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : shipments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Box className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">No shipments found.</p>
                  <Button asChild className="mt-4 bg-rose-500 hover:bg-rose-600">
                    <Link to="/shipments/new">Create your first shipment</Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            shipments.map((shipment) => (
              <TableRow key={shipment.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{shipment.id}</TableCell>
                <TableCell className="capitalize">{shipment.type}</TableCell>
                <TableCell>{shipment.lab}</TableCell>
                <TableCell>{shipment.animalType}</TableCell>
                <TableCell>
                  <ShipmentStatusBadge status={shipment.status as ShipmentStatus} />
                </TableCell>
                <TableCell>{shipment.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild className="rounded-full border-gray-200">
                    <Link to={`/${shipment.type}s/${shipment.id}`}>
                      <Eye className="h-4 w-4 mr-2 text-rose-500" />
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
