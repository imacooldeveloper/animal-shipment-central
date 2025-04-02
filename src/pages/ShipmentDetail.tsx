
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clipboard, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ShipmentDetailContent from '@/components/shipments/ShipmentDetailContent';
import ShipmentNotes from '@/components/shipments/ShipmentNotes';
import ImportShipmentView from '@/components/imports/ImportShipmentView';
import ExportShipmentView from '@/components/exports/ExportShipmentView';
import { useShipmentDetail } from '@/hooks/useShipmentDetail';
import { LoadingState, ErrorState } from '@/components/shipments/ShipmentDetailStates';

const ShipmentDetail = () => {
  const {
    navigate,
    isImport,
    isExport,
    shipment,
    checklist,
    loading,
    error,
    importData,
    exportData,
    updateChecklist,
    saveChanges,
    calculateProgress,
    handleDeleteShipment
  } = useShipmentDetail();
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (error || !shipment) {
    return <ErrorState error={error} onNavigateBack={() => navigate(-1)} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mt-2">{shipment.id}</h1>
          <p className="text-muted-foreground">
            View and manage {shipment.type === 'import' ? 'import' : 'export'} shipment details
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Clipboard className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Shipment</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  shipment and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteShipment}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {isImport && importData ? (
        <div className="space-y-6">
          <ImportShipmentView importData={importData} />
          <ShipmentNotes 
            shipmentId={importData.import_number} 
            shipmentType="import" 
            existingNotes={importData.notes}
          />
        </div>
      ) : isExport && exportData ? (
        <div className="space-y-6">
          <ExportShipmentView exportData={exportData} />
          <ShipmentNotes 
            shipmentId={exportData.export_number} 
            shipmentType="export" 
            existingNotes={exportData.notes}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <ShipmentDetailContent
            shipment={shipment}
            checklist={checklist!}
            updateChecklist={updateChecklist}
            onSaveChanges={saveChanges}
            calculateProgress={calculateProgress}
          />
          {shipment.id && (
            <ShipmentNotes 
              shipmentId={shipment.id} 
              shipmentType={shipment.type} 
              existingNotes={[]}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ShipmentDetail;
