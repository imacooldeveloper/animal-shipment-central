import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { Pencil, Trash, ArrowLeft } from 'lucide-react';

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
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { ExportDatabaseItem } from '@/pages/Exports';
import ExportShipmentView from '@/components/exports/ExportShipmentView';
import ExportShipmentForm from '@/components/shipments/ExportShipmentForm';
import ExportChecklistCard, { ExportChecklist, DEFAULT_EXPORT_CHECKLIST } from '@/components/exports/ExportChecklistCard';
import ShipmentNotes from '@/components/shipments/ShipmentNotes';

const ExportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);

  // Fetch export details
  const { 
    data: exportData, 
    isLoading, 
    error 
  } = useExportQuery(id);

  // Update export mutation
  const updateExportMutation = useUpdateExportMutation(id, queryClient, () => setIsEditing(false));

  // Delete export mutation
  const deleteExportMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Export ID is required');
      
      console.log("Deleting export with ID:", id);
      const { error } = await supabase
        .from('exports')
        .delete()
        .eq('export_number', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast.success('Export shipment deleted successfully');
      navigate('/exports');
    },
    onError: (error) => {
      console.error('Error deleting export:', error);
      toast.error('Failed to delete export shipment');
    }
  });

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
  if (error || !exportData) {
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
          {isEditing ? (
            <EditingView 
              exportData={exportData} 
              handleSave={handleSave} 
              handleCancel={handleCancel}
              isPending={updateExportMutation.isPending}
            />
          ) : (
            <ExportShipmentView exportData={exportData} />
          )}
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

// Helper components to keep the main component clean
const LoadingState = () => (
  <div className="container mx-auto px-4 py-6">
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-center items-center py-12">
          <div className="flex space-x-2">
            <div className="h-3 w-3 bg-blue-300 rounded-full animate-pulse"></div>
            <div className="h-3 w-3 bg-blue-400 rounded-full animate-pulse delay-150"></div>
            <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ErrorState = ({ onGoBack, error }: { onGoBack: () => void, error: any }) => (
  <div className="container mx-auto px-4 py-6">
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center py-12">
          <p className="text-destructive mb-4">Error loading export details</p>
          {error && <p className="text-sm text-muted-foreground mb-4">Details: {error.message || JSON.stringify(error)}</p>}
          <button onClick={onGoBack} className="flex items-center gap-2 px-4 py-2 rounded-md border">
            Back to Exports
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const EditingView = ({ 
  exportData, 
  handleSave, 
  handleCancel,
  isPending
}: { 
  exportData: ExportDatabaseItem, 
  handleSave: (data: any) => void, 
  handleCancel: () => void,
  isPending: boolean
}) => (
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

// Custom hooks for data fetching and mutations
const useExportQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['export', id],
    queryFn: async () => {
      if (!id) throw new Error('Export ID is required');
      
      console.log("Fetching export with ID:", id);
      const { data, error } = await supabase
        .from('exports')
        .select('*')
        .eq('export_number', id)
        .single();
      
      if (error) {
        console.error("Error fetching export:", error);
        throw error;
      }
      
      console.log("Fetched export data:", data);
      return data as ExportDatabaseItem;
    },
    retry: 1,
    refetchOnWindowFocus: false
  });
};

const useUpdateExportMutation = (
  id: string | undefined, 
  queryClient: any, 
  onSuccessCallback: () => void
) => {
  return useMutation({
    mutationFn: async (updatedExport: any) => {
      if (!id) throw new Error('Export ID is required');
      
      console.log("Updating export with ID:", id, "Data:", updatedExport);
      const { error } = await supabase
        .from('exports')
        .update({
          sending_lab: updatedExport.sendingLab,
          destination_lab: updatedExport.destinationLab,
          protocol_number: updatedExport.protocolNumber,
          courier: updatedExport.courier === 'Other' ? updatedExport.courierOther : updatedExport.courier,
          courier_account_number: updatedExport.courierAccountNumber,
          departure_date: updatedExport.departureDate ? new Date(updatedExport.departureDate).toISOString().split('T')[0] : null,
          animal_type: updatedExport.animalType,
          quantity: updatedExport.quantity,
          status: updatedExport.status === 'Other' ? updatedExport.statusOther : updatedExport.status,
          notes: updatedExport.notes,
          lab_contact_name: updatedExport.labContactName,
          lab_contact_email: updatedExport.labContactEmail,
          tracking_number: updatedExport.trackingNumber,
        })
        .eq('export_number', id);
      
      if (error) {
        console.error("Error updating export:", error);
        throw error;
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['export', id] });
      queryClient.invalidateQueries({ queryKey: ['exports'] });
      toast.success('Export shipment updated successfully');
      onSuccessCallback();
    },
    onError: (error) => {
      console.error('Error updating export:', error);
      toast.error('Failed to update export shipment');
    }
  });
};

export default ExportDetail;
