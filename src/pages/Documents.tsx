
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Eye, Plus, Search, Trash } from 'lucide-react';
import { mockShipments } from '@/data/mockData';
import { Document } from '@/types';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shipmentFilter, setShipmentFilter] = useState('all');

  // Collect all documents from all shipments
  const allDocuments = mockShipments.reduce<Array<Document & { shipmentId: string; country: string }>>((acc, shipment) => {
    const docsWithShipment = shipment.documents.map(doc => ({
      ...doc,
      shipmentId: shipment.id,
      country: shipment.country
    }));
    return [...acc, ...docsWithShipment];
  }, []);

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesShipment = shipmentFilter === 'all' || doc.shipmentId === shipmentFilter;
    
    return matchesSearch && matchesShipment;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Document Storage</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment Documents</CardTitle>
          <CardDescription>
            View and manage all documents associated with shipments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={shipmentFilter}
              onValueChange={setShipmentFilter}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by shipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shipments</SelectItem>
                {mockShipments.map(shipment => (
                  <SelectItem key={shipment.id} value={shipment.id}>
                    {shipment.id} - {shipment.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Title</TableHead>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>File Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No documents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>{doc.shipmentId}</TableCell>
                      <TableCell>{doc.country}</TableCell>
                      <TableCell>{doc.dateAdded}</TableCell>
                      <TableCell>{doc.expirationDate || 'N/A'}</TableCell>
                      <TableCell className="uppercase">{doc.fileType}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
