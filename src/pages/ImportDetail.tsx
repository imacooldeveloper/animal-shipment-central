
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Trash } from 'lucide-react';

import { Button } from "@/components/ui/button";
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
import { ImportDatabaseItem } from '@/hooks/useImports';
import ImportChecklistCard, { ImportChecklist, DEFAULT_CHECKLIST } from '@/components/imports/ImportChecklistCard';
import ImportActionBar from '@/components/imports/ImportActionBar';
import ShipmentNotes from '@/components/shipments/ShipmentNotes';
import { useImportDetail, useUpdateImportMutation, useDeleteImportMutation } from '@/hooks/useImportDetail';
import { LoadingState, ErrorState } from '@/components/imports/ImportDetailStates';
import ImportDetailView from '@/components/imports/ImportDetailView';

const ImportDetail = () => {
  const navigate = useNavigate();
  const { id, importData, isLoading, error, isError, queryClient } = useImportDetail();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // Update import mutation
  const updateImportMutation = useUpdateImportMutation(id, queryClient, () => setIsEditing(false));

  // Delete import mutation
  const deleteImportMutation = useDeleteImportMutation(id, navigate);

  // Load formData initially when importData is available
  useEffect(() => {
    if (importData && !formData) {
      console.log("Setting form data from import data:", importData);
      setFormData({
        sendingLab: importData.sending_lab,
        courier: importData.courier,
        arrivalDate: importData.arrival_date,
        labContactName: importData.lab_contact_name,
        labContactEmail: importData.lab_contact_email,
        animalType: importData.animal_type,
        quantity: importData.quantity,
      });
    }
  }, [importData, formData]);

  // Parse checklist from importData
  const parseChecklist = (): ImportChecklist => {
    if (!importData || !importData.checklist) {
      console.log("No checklist data found, using default");
      return DEFAULT_CHECKLIST;
    }
    
    try {
      console.log("Parsing checklist:", importData.checklist);
      const parsedChecklist = JSON.parse(importData.checklist);
      return { ...DEFAULT_CHECKLIST, ...parsedChecklist };
    } catch (e) {
      console.error('Error parsing checklist JSON:', e);
      return DEFAULT_CHECKLIST;
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    const checklist = parseChecklist();
    const totalItems = Object.keys(checklist).length;
    const completedItems = Object.values(checklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  const handleGoBack = () => navigate('/imports');
  const toggleEditMode = () => setIsEditing(!isEditing);
  const handleCancel = () => setIsEditing(false);
  const handleSave = (formData: any) => updateImportMutation.mutate(formData);
  const handleDelete = () => deleteImportMutation.mutate();

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state or not found state
  if (isError || !importData) {
    console.error("Error loading import:", error);
    return <ErrorState onGoBack={handleGoBack} error={error} />;
  }

  console.log("Rendered import details for:", importData.import_number);
  const progressValue = calculateProgress();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <ImportActionBar 
          importNumber={importData.import_number}
          isEditing={isEditing}
          isPending={updateImportMutation.isPending}
          onGoBack={handleGoBack}
          onToggleEdit={toggleEditMode}
          onCancel={handleCancel}
          progressValue={progressValue}
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Import</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                import shipment and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        <div className="md:col-span-4">
          <ImportDetailView 
            importData={importData}
            isEditing={isEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
            isPending={updateImportMutation.isPending}
          />
        </div>
        
        <div className="md:col-span-2">
          <ImportChecklistCard 
            importId={importData.import_number}
            initialChecklist={parseChecklist()}
            formData={formData}
          />
        </div>
      </div>

      <div className="mt-6">
        <ShipmentNotes 
          shipmentId={importData.import_number} 
          shipmentType="import" 
          existingNotes={importData.notes}
        />
      </div>
    </div>
  );
};

export default ImportDetail;
