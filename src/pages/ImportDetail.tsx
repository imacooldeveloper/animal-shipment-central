import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { Trash } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { supabase } from '@/integrations/supabase/client';
import { ImportDatabaseItem } from '@/hooks/useImports';
import ImportShipmentView from '@/components/imports/ImportShipmentView';
import ImportShipmentForm from '@/components/shipments/ImportShipmentForm';
import ImportChecklistCard, { ImportChecklist, DEFAULT_CHECKLIST } from '@/components/imports/ImportChecklistCard';
import ImportActionBar from '@/components/imports/ImportActionBar';
import ShipmentNotes from '@/components/shipments/ShipmentNotes';

const ImportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);

  // Fetch import details
  const { 
    data: importData, 
    isLoading, 
    error,
    isError
  } = useImportQuery(id);

  // Update import mutation
  const updateImportMutation = useUpdateImportMutation(id, queryClient, () => setIsEditing(false));

  // Delete import mutation
  const deleteImportMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Import ID is required');
      
      console.log("Deleting import with ID:", id);
      const { error } = await supabase
        .from('imports')
        .delete()
        .eq('import_number', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast.success('Import shipment deleted successfully');
      navigate('/imports');
    },
    onError: (error) => {
      console.error('Error deleting import:', error);
      toast.error('Failed to delete import shipment');
    }
  });

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

      // Parse notes if they exist
      if (importData.notes) {
        try {
          const parsedNotes = JSON.parse(importData.notes);
          if (Array.isArray(parsedNotes)) {
            setNotes(parsedNotes);
          } else {
            // If notes is not an array but a string, create a single note object
            setNotes([{
              id: '1',
              content: importData.notes,
              created_at: importData.created_at
            }]);
          }
        } catch (e) {
          // If parsing fails, treat as a single note
          setNotes([{
            id: '1',
            content: importData.notes,
            created_at: importData.created_at
          }]);
        }
      }
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
          {isEditing ? (
            <EditingView 
              importData={importData} 
              handleSave={handleSave} 
              handleCancel={handleCancel}
              isPending={updateImportMutation.isPending}
            />
          ) : (
            <ImportShipmentView importData={importData} />
          )}
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

// Helper components to keep the main component clean
const LoadingState = () => (
  <div className="container mx-auto px-4 py-6">
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-center items-center py-12">
          <p className="text-muted-foreground">Loading import details...</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ErrorState = ({ onGoBack, error }: { onGoBack: () => void, error: any }) => (
  <div className="container mx-auto px-4 py-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">Error loading import details</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col items-center py-8">
          <p className="text-destructive mb-4">
            {error instanceof Error 
              ? error.message 
              : error?.message || "Details: JSON object requested, multiple (or no) rows returned"}
          </p>
          <Button onClick={onGoBack} className="gap-2">
            Back to Imports
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const EditingView = ({ 
  importData, 
  handleSave, 
  handleCancel,
  isPending
}: { 
  importData: ImportDatabaseItem, 
  handleSave: (data: any) => void, 
  handleCancel: () => void,
  isPending: boolean
}) => (
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

// Custom hooks for data fetching and mutations
const useImportQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['import', id],
    queryFn: async () => {
      if (!id) throw new Error('Import ID is required');
      
      console.log("Fetching import with ID:", id);
      try {
        const { data, error, count } = await supabase
          .from('imports')
          .select('*')
          .eq('import_number', id)
          .maybeSingle();
        
        if (error) {
          console.error("Supabase error fetching import:", error);
          throw new Error(error.message);
        }
        
        if (!data) {
          console.error("Import not found:", id);
          throw new Error(`Import ${id} not found`);
        }
        
        console.log("Fetched import data:", data);
        return data as ImportDatabaseItem;
      } catch (err) {
        console.error("Error in import query:", err);
        throw err;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });
};

const useUpdateImportMutation = (
  id: string | undefined, 
  queryClient: any, 
  onSuccessCallback: () => void
) => {
  return useMutation({
    mutationFn: async (updatedImport: any) => {
      if (!id) throw new Error('Import ID is required');
      
      console.log("Updating import with ID:", id, "Data:", updatedImport);
      const { error } = await supabase
        .from('imports')
        .update({
          sending_lab: updatedImport.sendingLab,
          protocol_number: updatedImport.protocolNumber,
          courier: updatedImport.courier === 'Other' ? updatedImport.courierOther : updatedImport.courier,
          courier_account_number: updatedImport.courierAccountNumber,
          arrival_date: updatedImport.arrivalDate ? new Date(updatedImport.arrivalDate).toISOString().split('T')[0] : null,
          animal_type: updatedImport.animalType,
          quantity: updatedImport.quantity,
          status: updatedImport.status === 'Other' ? updatedImport.statusOther : updatedImport.status,
          notes: updatedImport.notes,
          lab_contact_name: updatedImport.labContactName,
          lab_contact_email: updatedImport.labContactEmail,
        })
        .eq('import_number', id);
      
      if (error) {
        console.error("Error updating import:", error);
        throw error;
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import', id] });
      queryClient.invalidateQueries({ queryKey: ['imports'] });
      toast.success('Import shipment updated successfully');
      onSuccessCallback();
    },
    onError: (error) => {
      console.error('Error updating import:', error);
      toast.error('Failed to update import shipment');
    }
  });
};

export default ImportDetail;
