
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import ImportShipmentView from '@/components/imports/ImportShipmentView';
import ImportShipmentForm from '@/components/shipments/ImportShipmentForm';
import { ImportDatabaseItem } from '@/hooks/useImports';
import ImportChecklistCard, { DEFAULT_CHECKLIST, ImportChecklist } from '@/components/imports/ImportChecklistCard';
import ImportActionBar from '@/components/imports/ImportActionBar';

const ImportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // Fetch import details
  const { data: importData, isLoading, error } = useQuery({
    queryKey: ['import', id],
    queryFn: async () => {
      if (!id) throw new Error('Import ID is required');
      
      const { data, error } = await supabase
        .from('imports')
        .select('*')
        .eq('import_number', id)
        .single();
      
      if (error) throw error;
      
      return data as ImportDatabaseItem;
    }
  });

  // Parse checklist from importData
  const parseChecklist = (): ImportChecklist => {
    if (!importData || !importData.checklist) {
      return DEFAULT_CHECKLIST;
    }
    
    try {
      const parsedChecklist = JSON.parse(importData.checklist);
      return { ...DEFAULT_CHECKLIST, ...parsedChecklist };
    } catch (e) {
      console.error('Error parsing checklist JSON:', e);
      return DEFAULT_CHECKLIST;
    }
  };

  const checklist = parseChecklist();
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    const totalItems = Object.keys(checklist).length;
    const completedItems = Object.values(checklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  // Update import mutation
  const updateImportMutation = useMutation({
    mutationFn: async (updatedImport: any) => {
      // Store formData for checklist auto-updates
      setFormData(updatedImport);
      
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
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import', id] });
      queryClient.invalidateQueries({ queryKey: ['imports'] });
      toast.success('Import shipment updated successfully');
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error updating import:', error);
      toast.error('Failed to update import shipment');
    }
  });

  // Load formData initially when importData is available
  useEffect(() => {
    if (importData && !formData) {
      setFormData({
        sendingLab: importData.sending_lab,
        courier: importData.courier,
        arrivalDate: importData.arrival_date,
        labContactName: importData.lab_contact_name,
        labContactEmail: importData.lab_contact_email,
      });
    }
  }, [importData, formData]);

  const handleGoBack = () => {
    navigate('/imports');
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = (formData: any) => {
    updateImportMutation.mutate(formData);
  };

  if (isLoading) {
    return (
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
  }

  if (error || !importData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center py-12">
              <p className="text-destructive mb-4">Error loading import details</p>
              <Button onClick={handleGoBack} variant="outline" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Imports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressValue = calculateProgress();

  return (
    <div className="container mx-auto px-4 py-6">
      <ImportActionBar 
        importNumber={importData.import_number}
        isEditing={isEditing}
        isPending={updateImportMutation.isPending}
        onGoBack={handleGoBack}
        onToggleEdit={toggleEditMode}
        onCancel={handleCancel}
        progressValue={progressValue}
      />

      <div className="grid gap-6 md:grid-cols-6">
        <div className="md:col-span-4">
          {isEditing ? (
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
                  isSubmitting={updateImportMutation.isPending}
                  formId="import-edit-form"
                />
              </CardContent>
            </Card>
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
    </div>
  );
};

export default ImportDetail;
