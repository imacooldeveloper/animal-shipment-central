
import { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define the checklist type
export interface ImportChecklist {
  healthCert: boolean;
  importPermit: boolean;
  packingList: boolean;
  transferForms: boolean;
  customsForms: boolean;
  courier: boolean;
  veterinaryInspection: boolean;
  quarantine: boolean;
  animalReceipt: boolean;
}

export const DEFAULT_CHECKLIST: ImportChecklist = {
  healthCert: false,
  importPermit: false,
  packingList: false,
  transferForms: false,
  customsForms: false,
  courier: false,
  veterinaryInspection: false,
  quarantine: false,
  animalReceipt: false
};

interface ImportChecklistCardProps {
  importId: string;
  initialChecklist: ImportChecklist;
  formData?: any;
}

const ImportChecklistCard = ({ importId, initialChecklist, formData }: ImportChecklistCardProps) => {
  const [checklist, setChecklist] = useState<ImportChecklist>(initialChecklist);
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Partial<ImportChecklist>>({});
  
  // Use a much longer delay to prevent screen jumps while typing
  useEffect(() => {
    if (!formData) return;
    
    // Store potential updates but don't apply them immediately
    const newPendingUpdates = { ...pendingUpdates };
    let hasNewUpdates = false;
    
    // Only mark fields for update if they meet criteria and aren't already true
    if (formData.sendingLab && !checklist.transferForms) {
      newPendingUpdates.transferForms = true;
      hasNewUpdates = true;
    }
    
    if (formData.courier && !checklist.courier) {
      newPendingUpdates.courier = true;
      hasNewUpdates = true;
    }
    
    if (formData.arrivalDate && !checklist.animalReceipt) {
      newPendingUpdates.animalReceipt = true;
      hasNewUpdates = true;
    }
    
    if ((formData.labContactEmail && formData.labContactName) && !checklist.importPermit) {
      newPendingUpdates.importPermit = true;
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
  
  const handleToggleItem = async (key: keyof ImportChecklist) => {
    const newChecklist = { ...checklist, [key]: !checklist[key] };
    setChecklist(newChecklist);
    
    if (importId !== 'new-import') {
      setIsSaving(true);
      try {
        // First check if the import exists
        const { data, error: fetchError } = await supabase
          .from('imports')
          .select('import_number')
          .eq('import_number', importId)
          .single();
          
        if (fetchError) {
          console.error('Error fetching import:', fetchError);
          throw fetchError;
        }
        
        const { error } = await supabase
          .from('imports')
          .update({ checklist: JSON.stringify(newChecklist) })
          .eq('import_number', importId);
          
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
              onClick={() => handleToggleItem(key as keyof ImportChecklist)}
              disabled={isSaving}
            >
              {value ? (
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 mr-2 text-gray-400" />
              )}
              <span className="text-left normal-case">
                {formatChecklistItem(key as keyof ImportChecklist)}
              </span>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          {importId === 'new-import' ? (
            <p>Checklist will be saved when the import is created.</p>
          ) : (
            <p>Click on any item to mark as completed or incomplete.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to format checklist keys into readable labels
const formatChecklistItem = (key: keyof ImportChecklist): string => {
  const labels: Record<keyof ImportChecklist, string> = {
    healthCert: "Health Certificate",
    importPermit: "Import Permit",
    packingList: "Packing List",
    transferForms: "Transfer Forms",
    customsForms: "Customs Forms",
    courier: "Courier Arranged",
    veterinaryInspection: "Veterinary Inspection",
    quarantine: "Quarantine",
    animalReceipt: "Animal Receipt"
  };
  
  return labels[key] || key;
};

export default ImportChecklistCard;
