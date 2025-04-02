
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { ImportChecklist } from '@/types';

export const DEFAULT_CHECKLIST: ImportChecklist = {
  transferForms: false,
  healthCert: false,
  importPermit: false,
  courier: false,
  animalReceipt: false,
  facilitiesReady: false,
};

// Checklist items with descriptions that match the UI
export const IMPORT_CHECKLIST_ITEMS = [
  {
    key: 'transferForms',
    label: 'Upload transfer forms',
    description: 'Obtain and upload all required transfer forms'
  },
  {
    key: 'healthCert',
    label: 'Verify health certificate',
    description: 'Check sender\'s health certificate'
  },
  {
    key: 'importPermit',
    label: 'Import permit verified',
    description: 'Verify all import permits are in order'
  },
  {
    key: 'courier',
    label: 'Confirm courier details',
    description: 'Verify courier and delivery information'
  },
  {
    key: 'animalReceipt',
    label: 'Plan animal receipt',
    description: 'Schedule personnel for receiving'
  },
  {
    key: 'facilitiesReady',
    label: 'Facilities ready',
    description: 'Ensure housing is prepared'
  }
];

interface ImportChecklistCardProps {
  importId: string;
  initialChecklist: ImportChecklist;
  formData?: any;
}

const ImportChecklistCard = ({ importId, initialChecklist, formData }: ImportChecklistCardProps) => {
  const [checklist, setChecklist] = useState<ImportChecklist>(initialChecklist);
  const [updatingFromForm, setUpdatingFromForm] = useState(false);
  const queryClient = useQueryClient();

  // Update checklist mutation
  const updateChecklistMutation = useMutation({
    mutationFn: async (checklistData: ImportChecklist) => {
      if (importId === "new-import") return true; // Skip API call for new imports
      
      const { error } = await supabase
        .from('imports')
        .update({
          checklist: JSON.stringify(checklistData)
        })
        .eq('import_number', importId);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      if (importId !== "new-import") {
        queryClient.invalidateQueries({ queryKey: ['import', importId] });
        toast.success('Checklist updated successfully');
      }
    },
    onError: (error) => {
      console.error('Error updating checklist:', error);
      toast.error('Failed to update checklist');
    }
  });

  // Update checklist based on form data
  useEffect(() => {
    if (formData) {
      setUpdatingFromForm(true);
      let updatedChecklist = { ...checklist };
      
      // Auto-update based on form fields
      if (formData.sendingLab && formData.sendingLab.trim() !== '') {
        updatedChecklist.transferForms = true;
      }
      
      if (formData.courier && formData.courier.trim() !== '') {
        updatedChecklist.courier = true;
      }
      
      if (formData.arrivalDate) {
        updatedChecklist.animalReceipt = true;
      }
      
      if (formData.labContactEmail && formData.labContactName) {
        updatedChecklist.importPermit = true;
      }

      if (formData.animalType && formData.quantity) {
        updatedChecklist.healthCert = true;
      }
      
      if (formData.status && formData.status.toLowerCase().includes('ready')) {
        updatedChecklist.facilitiesReady = true;
      }
      
      // Only update state if there's an actual change to prevent re-renders
      if (JSON.stringify(updatedChecklist) !== JSON.stringify(checklist)) {
        setChecklist(updatedChecklist);
      }
      
      // Reset the updating flag after a short delay
      setTimeout(() => setUpdatingFromForm(false), 100);
    }
  }, [formData]);

  const updateChecklistItem = (key: keyof ImportChecklist, value: boolean) => {
    // Only process manual updates if not currently updating from form data
    if (!updatingFromForm) {
      setChecklist(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const saveChecklist = () => {
    if (!updatingFromForm) {
      updateChecklistMutation.mutate(checklist);
    }
  };

  const calculateProgress = () => {
    const totalItems = Object.keys(checklist).length;
    const completedItems = Object.values(checklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  const progress = calculateProgress();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coordinator Checklist</CardTitle>
        <CardDescription>Track import completion status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {IMPORT_CHECKLIST_ITEMS.map((item) => (
            <div key={item.key} className="flex items-start space-x-2">
              <Checkbox 
                id={`import-${item.key}`} 
                checked={checklist[item.key as keyof ImportChecklist]}
                onCheckedChange={(checked) => 
                  updateChecklistItem(item.key as keyof ImportChecklist, checked as boolean)
                }
                className="mt-1"
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor={`import-${item.key}`}
                  className="flex items-center gap-2 cursor-pointer font-medium"
                >
                  {item.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Checklist Status</p>
            <p className="text-sm text-muted-foreground">{progress}% Complete</p>
          </div>
          <Progress value={progress} className="h-2" />
          
          <Button 
            className="w-full gap-2" 
            onClick={saveChecklist}
            disabled={updateChecklistMutation.isPending || updatingFromForm}
          >
            <Check className="h-4 w-4" />
            {updateChecklistMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportChecklistCard;
