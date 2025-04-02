
import { Calendar, Truck, Bookmark, User, Mail, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ShipmentStatusBadge from '@/components/ShipmentStatusBadge';
import { Separator } from "@/components/ui/separator";
import { ExportDatabaseItem } from '@/pages/Exports';
import { mapStatusToShipmentStatus } from '@/lib/utils';

interface ExportShipmentViewProps {
  exportData: ExportDatabaseItem;
}

const ExportShipmentView = ({ exportData }: ExportShipmentViewProps) => {
  const formattedDate = exportData.departure_date 
    ? new Date(exportData.departure_date).toLocaleDateString('en-US', {
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
              <CardTitle>Export Details</CardTitle>
              <CardDescription>
                Information about this export shipment
              </CardDescription>
            </div>
            <ShipmentStatusBadge status={mapStatusToShipmentStatus(exportData.status)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Export Number</h3>
                <p className="font-medium">{exportData.export_number}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Sending Lab / Institution</h3>
                <p className="font-medium">{exportData.sending_lab}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Destination Lab / Institution</h3>
                <p className="font-medium">{exportData.destination_lab}</p>
              </div>
              
              {exportData.protocol_number && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Protocol Number</h3>
                  <p className="font-medium">{exportData.protocol_number}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Animal Type</h3>
                <p className="font-medium">{exportData.animal_type}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Quantity and Strain</h3>
                <p className="font-medium">{exportData.quantity}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Departure Date</h3>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>
              
              {exportData.courier && (
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Courier</h3>
                    <p className="font-medium">{exportData.courier}</p>
                    {exportData.courier_account_number && (
                      <p className="text-sm text-muted-foreground">Account: {exportData.courier_account_number}</p>
                    )}
                  </div>
                </div>
              )}
              
              {exportData.tracking_number && (
                <div className="flex items-start">
                  <Send className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Tracking Number</h3>
                    <p className="font-medium">{exportData.tracking_number}</p>
                  </div>
                </div>
              )}
              
              {(exportData.lab_contact_name || exportData.lab_contact_email) && (
                <div className="space-y-2">
                  {exportData.lab_contact_name && (
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Lab Contact</h3>
                        <p className="font-medium">{exportData.lab_contact_name}</p>
                      </div>
                    </div>
                  )}
                  
                  {exportData.lab_contact_email && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Email</h3>
                        <p className="font-medium">{exportData.lab_contact_email}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {exportData.status && (
                <div className="flex items-start">
                  <Bookmark className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                    <p className="font-medium">{exportData.status}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportShipmentView;
