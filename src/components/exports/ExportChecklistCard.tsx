
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
import { ExportChecklist } from '@/types';

export const DEFAULT_EXPORT_CHECKLIST: ExportChecklist = {
  transferForms: false,
  healthCert: false,
  exportPermit: false,
  courier: false,
  pickupDate: false,
  packageReady: false,
};

// Checklist items for export shipments
export const EXPORT_CHECKLIST_ITEMS = [
  {
    key: 'transferForms',
    label: 'Upload transfer forms',
    description: 'Obtain and upload all required transfer forms'
  },
  {
    key: 'healthCert',
    label: 'Verify health certificate',
    description: 'Check health certificate requirements'
  },
  {
    key: 'exportPermit',
    label: 'Export permit verified',
    description: 'Verify all export permits are in order'
  },
  {
    key: 'courier',
    label: 'Confirm courier details',
    description: 'Verify courier and shipping information'
  },
  {
    key: 'pickupDate',
    label: 'Schedule pickup date',
    description: 'Confirm pickup time and date'
  },
  {
    key: 'packageReady',
    label: 'Package ready',
    description: 'Ensure shipping package is properly prepared'
  }
];

interface ExportChecklistCardProps {
  exportId: string;
  initialChecklist: ExportChecklist;
  formData?: any;
}

const ExportChecklistCard = ({ exportId, initialChecklist, formData }: ExportChecklistCardProps) => {
  const [checklist, setChecklist] = useState<ExportChecklist>(initialChecklist);
  const [updatingFromForm, setUpdatingFromForm] = useState(false);
  const queryClient = useQueryClient();

  // Update checklist mutation
  const updateChecklistMutation = useMutation({
    mutationFn: async (checklistData: ExportChecklist) => {
      if (exportId === "new-export") return true; // Skip API call for new exports
      
      const { error } = await supabase
        .from('exports')
        .update({
          checklist: JSON.stringify(checklistData)
        })
        .eq('export_number', exportId);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      if (exportId !== "new-export") {
        queryClient.invalidateQueries({ queryKey: ['export', exportId] });
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
      if (formData.sendingLab && formData.destinationLab) {
        updatedChecklist.transferForms = true;
      }
      
      if (formData.courier && formData.courier.trim() !== '') {
        updatedChecklist.courier = true;
      }
      
      if (formData.departureDate) {
        updatedChecklist.pickupDate = true;
      }
      
      if (formData.labContactEmail && formData.labContactName) {
        updatedChecklist.exportPermit = true;
      }

      if (formData.animalType && formData.quantity) {
        updatedChecklist.healthCert = true;
      }
      
      if (formData.status && formData.status.toLowerCase().includes('ready')) {
        updatedChecklist.packageReady = true;
      }
      
      // Only update state if there's an actual change to prevent re-renders
      if (JSON.stringify(updatedChecklist) !== JSON.stringify(checklist)) {
        setChecklist(updatedChecklist);
      }
      
      // Reset the updating flag after a short delay
      setTimeout(() => setUpdatingFromForm(false), 100);
    }
  }, [formData]);

  const updateChecklistItem = (key: keyof ExportChecklist, value: boolean) => {
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
        <CardDescription>Track export completion status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {EXPORT_CHECKLIST_ITEMS.map((item) => (
            <div key={item.key} className="flex items-start space-x-2">
              <Checkbox 
                id={`export-${item.key}`} 
                checked={checklist[item.key as keyof ExportChecklist]}
                onCheckedChange={(checked) => 
                  updateChecklistItem(item.key as keyof ExportChecklist, checked as boolean)
                }
                className="mt-1"
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor={`export-${item.key}`}
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

export default ExportChecklistCard;
