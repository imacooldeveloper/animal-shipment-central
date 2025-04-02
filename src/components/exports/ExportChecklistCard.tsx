
import { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ExportDatabaseItem } from '@/types';

// Define the checklist type
export interface ExportChecklist {
  healthCert: boolean;
  exportPermit: boolean;
  transferForms: boolean;
  customsForms: boolean;
  courier: boolean;
  pickupDate: boolean;
  shippingLabels: boolean;
  packingList: boolean;
  packageReady: boolean;
}

export const DEFAULT_EXPORT_CHECKLIST: ExportChecklist = {
  healthCert: false,
  exportPermit: false,
  transferForms: false,
  customsForms: false,
  courier: false,
  pickupDate: false,
  shippingLabels: false,
  packingList: false,
  packageReady: false
};

interface ExportChecklistCardProps {
  exportId: string;
  initialChecklist: ExportChecklist;
  formData?: any;
}

const ExportChecklistCard = ({ exportId, initialChecklist, formData }: ExportChecklistCardProps) => {
  const [checklist, setChecklist] = useState<ExportChecklist>(initialChecklist);
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Partial<ExportChecklist>>({});
  
  // Use a much longer delay to prevent screen jumps while typing
  useEffect(() => {
    if (!formData) return;
    
    // Store potential updates but don't apply them immediately
    const newPendingUpdates = { ...pendingUpdates };
    let hasNewUpdates = false;
    
    // Only mark fields for update if they meet criteria and aren't already true
    if ((formData.sendingLab && formData.destinationLab) && !checklist.transferForms) {
      newPendingUpdates.transferForms = true;
      hasNewUpdates = true;
    }
    
    if (formData.courier && !checklist.courier) {
      newPendingUpdates.courier = true;
      hasNewUpdates = true;
    }
    
    if (formData.departureDate && !checklist.pickupDate) {
      newPendingUpdates.pickupDate = true;
      hasNewUpdates = true;
    }
    
    if ((formData.labContactEmail && formData.labContactName) && !checklist.exportPermit) {
      newPendingUpdates.exportPermit = true;
      hasNewUpdates = true;
    }
    
    if ((formData.animalType && formData.quantity) && !checklist.healthCert) {
      newPendingUpdates.healthCert = true;
      hasNewUpdates = true;
    }
    
    // Only update state if we have new updates to prevent unnecessary renders
    if (hasNewUpdates) {
      setPendingUpdates(newPendingUpdates);
      
      // Set a very long timeout to apply updates (5 seconds)
      // This prevents disruptive UI changes while user is actively typing
      const timer = setTimeout(() => {
        setChecklist(prev => ({
          ...prev,
          ...newPendingUpdates
        }));
        setPendingUpdates({});
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [formData, checklist, pendingUpdates]);
  
  // Update progress when checklist changes
  useEffect(() => {
    const totalItems = Object.keys(checklist).length;
    const completedItems = Object.values(checklist).filter(Boolean).length;
    setProgress(Math.round((completedItems / totalItems) * 100));
  }, [checklist]);
  
  const handleToggleItem = async (key: keyof ExportChecklist) => {
    const newChecklist = { ...checklist, [key]: !checklist[key] };
    setChecklist(newChecklist);
    
    if (exportId !== 'new-export') {
      setIsSaving(true);
      try {
        // First check if the export exists
        const { data, error: fetchError } = await supabase
          .from('exports')
          .select('export_number')
          .eq('export_number', exportId)
          .single();
          
        if (fetchError) {
          console.error('Error fetching export:', fetchError);
          throw fetchError;
        }
        
        // Create an update object with the string serialization of the checklist
        const updateObj: Partial<ExportDatabaseItem> = {
          checklist: JSON.stringify(newChecklist)
        };
        
        const { error } = await supabase
          .from('exports')
          .update(updateObj)
          .eq('export_number', exportId);
          
        if (error) throw error;
        toast.success('Checklist updated');
      } catch (error) {
        console.error('Error saving checklist:', error);
        toast.error('Failed to update checklist');
        // Revert change on error
        setChecklist(checklist);
      } finally {
        setIsSaving(false);
      }
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Coordinator Checklist</span>
          <span className="text-sm font-normal">{progress}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="h-2 mb-4" />
        
        <div className="space-y-3">
          {Object.entries(checklist).map(([key, value]) => (
            <Button
              key={key}
              variant="ghost"
              className="w-full justify-start p-2 h-auto"
              onClick={() => handleToggleItem(key as keyof ExportChecklist)}
              disabled={isSaving}
            >
              {value ? (
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 mr-2 text-gray-400" />
              )}
              <span className="text-left normal-case">
                {formatChecklistItem(key as keyof ExportChecklist)}
              </span>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          {exportId === 'new-export' ? (
            <p>Checklist will be saved when the export is created.</p>
          ) : (
            <p>Click on any item to mark as completed or incomplete.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to format checklist keys into readable labels
const formatChecklistItem = (key: keyof ExportChecklist): string => {
  const labels: Record<keyof ExportChecklist, string> = {
    healthCert: "Health Certificate",
    exportPermit: "Export Permit",
    transferForms: "Transfer Forms",
    customsForms: "Customs Forms",
    courier: "Courier Arranged",
    pickupDate: "Pickup Date Scheduled",
    shippingLabels: "Shipping Labels",
    packingList: "Packing List",
    packageReady: "Package Ready"
  };
  
  return labels[key] || key;
};

export default ExportChecklistCard;
