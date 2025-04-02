
import { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define the checklist type
export interface ExportChecklist {
  healthCert: boolean;
  exportPermit: boolean;
  packingList: boolean;
  transferForms: boolean;
  customsForms: boolean;
  courier: boolean;
  destinationApproval: boolean;
  pickupDate: boolean;
  trackingConfirmed: boolean;
}

export const DEFAULT_EXPORT_CHECKLIST: ExportChecklist = {
  healthCert: false,
  exportPermit: false,
  packingList: false,
  transferForms: false,
  customsForms: false,
  courier: false,
  destinationApproval: false,
  pickupDate: false,
  trackingConfirmed: false
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
  
  // Prevent auto-update while typing by using a delay
  useEffect(() => {
    if (!formData) return;
    
    // Use setTimeout to prevent rapid changes while typing
    const timer = setTimeout(() => {
      const newChecklist = { ...checklist };
      
      // Only update if values exist and are different from current state
      if ((formData.sendingLab && formData.destinationLab) && !checklist.transferForms) {
        newChecklist.transferForms = true;
      }
      if (formData.courier && !checklist.courier) {
        newChecklist.courier = true;
      }
      if (formData.departureDate && !checklist.pickupDate) {
        newChecklist.pickupDate = true;
      }
      if ((formData.labContactEmail && formData.labContactName) && !checklist.exportPermit) {
        newChecklist.exportPermit = true;
      }
      if ((formData.animalType && formData.quantity) && !checklist.healthCert) {
        newChecklist.healthCert = true;
      }
      if (formData.trackingNumber && !checklist.trackingConfirmed) {
        newChecklist.trackingConfirmed = true;
      }
      
      // Only update state if changes were made to avoid unnecessary re-renders
      if (JSON.stringify(newChecklist) !== JSON.stringify(checklist)) {
        setChecklist(newChecklist);
      }
    }, 2000); // Increase to 2 seconds to reduce likelihood of pushing out of view
    
    return () => clearTimeout(timer);
  }, [formData, checklist]);
  
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
        const { error } = await supabase
          .from('exports')
          .update({ checklist: JSON.stringify(newChecklist) })
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
    packingList: "Packing List",
    transferForms: "Transfer Forms",
    customsForms: "Customs Forms",
    courier: "Courier Arranged",
    destinationApproval: "Destination Approval",
    pickupDate: "Pickup Date Confirmed",
    trackingConfirmed: "Tracking Confirmed"
  };
  
  return labels[key] || key;
};

export default ExportChecklistCard;
