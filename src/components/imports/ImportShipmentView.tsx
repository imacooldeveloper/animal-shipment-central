
import { Calendar, Truck, Bookmark, FileText, Send, User, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ShipmentStatusBadge from '@/components/ShipmentStatusBadge';
import { Separator } from "@/components/ui/separator";
import { ImportDatabaseItem } from '@/hooks/useImports';
import { mapStatusToShipmentStatus } from '@/lib/utils';

interface ImportShipmentViewProps {
  importData: ImportDatabaseItem;
}

const ImportShipmentView = ({ importData }: ImportShipmentViewProps) => {
  const formattedDate = importData.arrival_date 
    ? new Date(importData.arrival_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Not scheduled';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Import Details</CardTitle>
              <CardDescription>
                Information about this import shipment
              </CardDescription>
            </div>
            <ShipmentStatusBadge status={mapStatusToShipmentStatus(importData.status)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Import Number</h3>
                <p className="font-medium">{importData.import_number}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Sending Lab / Institution</h3>
                <p className="font-medium">{importData.sending_lab}</p>
              </div>
              
              {importData.protocol_number && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Protocol Number</h3>
                  <p className="font-medium">{importData.protocol_number}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Animal Type</h3>
                <p className="font-medium">{importData.animal_type}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Quantity and Strain</h3>
                <p className="font-medium">{importData.quantity}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Arrival Date</h3>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>
              
              {importData.courier && (
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Courier</h3>
                    <p className="font-medium">{importData.courier}</p>
                    {importData.courier_account_number && (
                      <p className="text-sm text-muted-foreground">Account: {importData.courier_account_number}</p>
                    )}
                  </div>
                </div>
              )}
              
              {(importData.lab_contact_name || importData.lab_contact_email) && (
                <div className="space-y-2">
                  {importData.lab_contact_name && (
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Lab Contact</h3>
                        <p className="font-medium">{importData.lab_contact_name}</p>
                      </div>
                    </div>
                  )}
                  
                  {importData.lab_contact_email && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Email</h3>
                        <p className="font-medium">{importData.lab_contact_email}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {importData.status && (
                <div className="flex items-start">
                  <Bookmark className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                    <p className="font-medium">{importData.status}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {importData.notes && (
            <>
              <Separator className="my-6" />
              <div className="space-y-2">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="whitespace-pre-wrap">{importData.notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportShipmentView;
