
import { ExportDatabaseItem } from '@/pages/Exports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExportShipmentForm from '@/components/shipments/ExportShipmentForm';
import ExportShipmentView from '@/components/exports/ExportShipmentView';

interface EditingViewProps { 
  exportData: ExportDatabaseItem, 
  handleSave: (data: any) => void, 
  handleCancel: () => void,
  isPending: boolean
}

export const EditingView = ({ 
  exportData, 
  handleSave, 
  handleCancel,
  isPending
}: EditingViewProps) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle>Edit Export Shipment</CardTitle>
      <CardDescription>
        Update the details for this export shipment
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ExportShipmentForm 
        onSubmit={handleSave} 
        onCancel={handleCancel}
        initialData={{
          exportNumber: exportData.export_number,
          sendingLab: exportData.sending_lab,
          destinationLab: exportData.destination_lab,
          protocolNumber: exportData.protocol_number || '',
          courier: exportData.courier || '',
          courierAccountNumber: exportData.courier_account_number || '',
          departureDate: exportData.departure_date ? new Date(exportData.departure_date) : undefined,
          animalType: exportData.animal_type,
          quantity: exportData.quantity,
          status: exportData.status || '',
          notes: exportData.notes || '',
          labContactName: exportData.lab_contact_name || '',
          labContactEmail: exportData.lab_contact_email || '',
          trackingNumber: exportData.tracking_number || '',
        }}
        isEditing={true}
        isSubmitting={isPending}
        formId="export-edit-form"
      />
    </CardContent>
  </Card>
);

interface ExportDetailViewProps {
  exportData: ExportDatabaseItem;
  isEditing: boolean;
  handleSave: (data: any) => void;
  handleCancel: () => void;
  isPending: boolean;
}

const ExportDetailView = ({ 
  exportData, 
  isEditing, 
  handleSave, 
  handleCancel, 
  isPending 
}: ExportDetailViewProps) => {
  if (isEditing) {
    return (
      <EditingView 
        exportData={exportData} 
        handleSave={handleSave} 
        handleCancel={handleCancel}
        isPending={isPending}
      />
    );
  }
  
  return <ExportShipmentView exportData={exportData} />;
};

export default ExportDetailView;
