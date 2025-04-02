
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Pencil, Trash, ArrowLeft } from 'lucide-react';

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
import { Progress } from "@/components/ui/progress";
import { useExportDetail, useUpdateExportMutation, useDeleteExportMutation } from '@/hooks/useExportDetail';
import ExportChecklistCard, { ExportChecklist, DEFAULT_EXPORT_CHECKLIST } from '@/components/exports/ExportChecklistCard';
import ShipmentNotes from '@/components/shipments/ShipmentNotes';
import { LoadingState, ErrorState } from '@/components/exports/ExportDetailStates';
import ExportDetailView from '@/components/exports/ExportDetailView';

const ExportDetail = () => {
  const navigate = useNavigate();
  const { id, exportData, isLoading, error, isError, queryClient } = useExportDetail();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);

  // Update export mutation
  const updateExportMutation = useUpdateExportMutation(id, queryClient, () => setIsEditing(false));

  // Delete export mutation
  const deleteExportMutation = useDeleteExportMutation(id, navigate);

  // Load formData initially when exportData is available
  useEffect(() => {
    if (exportData && !formData) {
      console.log("Setting form data from export data:", exportData);
      setFormData({
        sendingLab: exportData.sending_lab,
        destinationLab: exportData.destination_lab,
        courier: exportData.courier,
        departureDate: exportData.departure_date,
        labContactName: exportData.lab_contact_name,
        labContactEmail: exportData.lab_contact_email,
        animalType: exportData.animal_type,
        quantity: exportData.quantity,
      });

      // Parse notes if they exist
      if (exportData.notes) {
        try {
          const parsedNotes = JSON.parse(exportData.notes);
          if (Array.isArray(parsedNotes)) {
            setNotes(parsedNotes);
          } else {
            // If notes is not an array but a string, create a single note object
            setNotes([{
              id: '1',
              content: exportData.notes,
              created_at: exportData.created_at
            }]);
          }
        } catch (e) {
          // If parsing fails, treat as a single note
          setNotes([{
            id: '1',
            content: exportData.notes,
            created_at: exportData.created_at
          }]);
        }
      }
    }
  }, [exportData, formData]);

  // Parse checklist from exportData
  const parseChecklist = (): ExportChecklist => {
    if (!exportData || !exportData.checklist) {
      console.log("No checklist data found, using default");
      return DEFAULT_EXPORT_CHECKLIST;
    }
    
    try {
      console.log("Parsing checklist:", exportData.checklist);
      const parsedChecklist = JSON.parse(exportData.checklist);
      return { ...DEFAULT_EXPORT_CHECKLIST, ...parsedChecklist };
    } catch (e) {
      console.error('Error parsing checklist JSON:', e);
      return DEFAULT_EXPORT_CHECKLIST;
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    const checklist = parseChecklist();
    const totalItems = Object.keys(checklist).length;
    const completedItems = Object.values(checklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  const handleGoBack = () => navigate('/exports');
  const toggleEditMode = () => setIsEditing(!isEditing);
  const handleCancel = () => setIsEditing(false);
  const handleSave = (formData: any) => updateExportMutation.mutate(formData);
  const handleDelete = () => deleteExportMutation.mutate();

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (isError || !exportData) {
    console.error("Error loading export:", error);
    return <ErrorState onGoBack={handleGoBack} error={error} />;
  }

  console.log("Rendered export details for:", exportData.export_number);
  const progressValue = calculateProgress();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-2xl font-bold">{exportData.export_number}</h1>
          <div className="flex items-center gap-2">
            <Progress value={progressValue} className="h-2 w-48" />
            <span className="text-xs text-muted-foreground">{progressValue}% Complete</span>
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <Button variant="outline" onClick={handleCancel} disabled={updateExportMutation.isPending}>
              Cancel
            </Button>
          ) : (
            <Button variant="outline" onClick={toggleEditMode}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Export</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  export shipment and all associated data.
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
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        <div className="md:col-span-4">
          <ExportDetailView 
            exportData={exportData}
            isEditing={isEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
            isPending={updateExportMutation.isPending}
          />
        </div>
        
        <div className="md:col-span-2">
          <ExportChecklistCard 
            exportId={exportData.export_number}
            initialChecklist={parseChecklist()}
            formData={formData}
          />
        </div>
      </div>

      <div className="mt-6">
        <ShipmentNotes 
          shipmentId={exportData.export_number} 
          shipmentType="export" 
          existingNotes={notes}
        />
      </div>
    </div>
  );
};

export default ExportDetail;
