
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

export interface ChecklistItem {
  key: string;
  label: string;
  description: string;
}

export interface ImportChecklist {
  transferForms: boolean;
  healthCert: boolean;
  importPermit: boolean;
  courier: boolean;
  animalReceipt: boolean;
  facilitiesReady: boolean;
}

export const DEFAULT_CHECKLIST: ImportChecklist = {
  transferForms: false,
  healthCert: false,
  importPermit: false,
  courier: false,
  animalReceipt: false,
  facilitiesReady: false,
};

const CHECKLIST_ITEMS: ChecklistItem[] = [
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
}

const ImportChecklistCard = ({ importId, initialChecklist }: ImportChecklistCardProps) => {
  const [checklist, setChecklist] = useState<ImportChecklist>(initialChecklist);
  const queryClient = useQueryClient();

  // Update checklist mutation
  const updateChecklistMutation = useMutation({
    mutationFn: async (checklistData: ImportChecklist) => {
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
      queryClient.invalidateQueries({ queryKey: ['import', importId] });
      toast.success('Checklist updated successfully');
    },
    onError: (error) => {
      console.error('Error updating checklist:', error);
      toast.error('Failed to update checklist');
    }
  });

  const updateChecklistItem = (key: keyof ImportChecklist, value: boolean) => {
    setChecklist(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveChecklist = () => {
    updateChecklistMutation.mutate(checklist);
  };

  const calculateProgress = () => {
    const totalItems = Object.keys(checklist).length;
    const completedItems = Object.values(checklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coordinator Checklist</CardTitle>
        <CardDescription>Track import completion status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {CHECKLIST_ITEMS.map((item) => (
            <div key={item.key} className="flex items-start space-x-2">
              <Checkbox 
                id={item.key} 
                checked={checklist[item.key as keyof ImportChecklist]}
                onCheckedChange={(checked) => 
                  updateChecklistItem(item.key as keyof ImportChecklist, checked as boolean)
                }
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor={item.key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {item.label}
                  {checklist[item.key as keyof ImportChecklist] && (
                    <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                      Complete
                    </span>
                  )}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Checklist Status</p>
            <p className="text-sm text-muted-foreground">
              {calculateProgress()}% Complete
            </p>
          </div>
          <Button 
            className="gap-2" 
            onClick={saveChecklist}
            disabled={updateChecklistMutation.isPending}
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
