
import { ImportDatabaseItem } from '@/hooks/useImports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImportShipmentForm from '@/components/shipments/ImportShipmentForm';
import ImportShipmentView from '@/components/imports/ImportShipmentView';

interface EditingViewProps { 
  importData: ImportDatabaseItem, 
  handleSave: (data: any) => void, 
  handleCancel: () => void,
  isPending: boolean
}

export const EditingView = ({ 
  importData, 
  handleSave, 
  handleCancel,
  isPending
}: EditingViewProps) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle>Edit Import Shipment</CardTitle>
      <CardDescription>
        Update the details for this import shipment
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ImportShipmentForm 
        onSubmit={handleSave} 
        onCancel={handleCancel}
        initialData={{
          importNumber: importData.import_number,
          sendingLab: importData.sending_lab,
          protocolNumber: importData.protocol_number || '',
          courier: importData.courier || '',
          courierAccountNumber: importData.courier_account_number || '',
          arrivalDate: importData.arrival_date ? new Date(importData.arrival_date) : undefined,
          animalType: importData.animal_type,
          quantity: importData.quantity,
          status: importData.status || '',
          notes: importData.notes || '',
          labContactName: importData.lab_contact_name || '',
          labContactEmail: importData.lab_contact_email || '',
        }}
        isEditing={true}
        isSubmitting={isPending}
        formId="import-edit-form"
      />
    </CardContent>
  </Card>
);

interface ImportDetailViewProps {
  importData: ImportDatabaseItem;
  isEditing: boolean;
  handleSave: (data: any) => void;
  handleCancel: () => void;
  isPending: boolean;
}

const ImportDetailView = ({ 
  importData, 
  isEditing, 
  handleSave, 
  handleCancel, 
  isPending 
}: ImportDetailViewProps) => {
  if (isEditing) {
    return (
      <EditingView 
        importData={importData} 
        handleSave={handleSave} 
        handleCancel={handleCancel}
        isPending={isPending}
      />
    );
  }
  
  return <ImportShipmentView importData={importData} />;
};

export default ImportDetailView;
