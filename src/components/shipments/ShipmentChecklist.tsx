
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shipment } from '@/types';

interface ShipmentChecklistProps {
  shipment: Shipment;
  checklist: Shipment['checklist'];
  updateChecklist: (key: keyof Shipment['checklist'], value: boolean) => void;
  onSaveChanges: () => void;
  calculateProgress: () => number;
}

const ShipmentChecklist = ({ 
  shipment, 
  checklist, 
  updateChecklist, 
  onSaveChanges,
  calculateProgress 
}: ShipmentChecklistProps) => {
  const progress = calculateProgress();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coordinator Checklist</CardTitle>
        <CardDescription>Track shipment completion status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="transferForms" 
              checked={checklist.transferForms}
              onCheckedChange={(checked) => 
                updateChecklist('transferForms', checked as boolean)
              }
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="transferForms"
                className="flex items-center gap-2 cursor-pointer"
              >
                Upload transfer forms
                {checklist.transferForms && (
                  <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                    Complete
                  </span>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                Add all required forms for the destination country
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="healthCert" 
              checked={checklist.healthCert}
              onCheckedChange={(checked) => 
                updateChecklist('healthCert', checked as boolean)
              }
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="healthCert"
                className="flex items-center gap-2 cursor-pointer"
              >
                Add health certificate
                {checklist.healthCert && (
                  <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                    Complete
                  </span>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                Upload signed health certificate
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="exportPermit" 
              checked={checklist.exportPermit}
              onCheckedChange={(checked) => 
                updateChecklist('exportPermit', checked as boolean)
              }
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="exportPermit"
                className="flex items-center gap-2 cursor-pointer"
              >
                Add export permit
                {checklist.exportPermit && (
                  <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                    Complete
                  </span>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                Include approved export permit
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="courier" 
              checked={checklist.courier}
              onCheckedChange={(checked) => 
                updateChecklist('courier', checked as boolean)
              }
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="courier"
                className="flex items-center gap-2 cursor-pointer"
              >
                <span>Assign courier</span>
                {checklist.courier && (
                  <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                    Complete
                  </span>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                Book transportation service
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="pickupDate" 
              checked={checklist.pickupDate}
              onCheckedChange={(checked) => 
                updateChecklist('pickupDate', checked as boolean)
              }
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="pickupDate"
                className="flex items-center gap-2 cursor-pointer"
              >
                <span>Confirm pickup date</span>
                {checklist.pickupDate && (
                  <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                    Complete
                  </span>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                Schedule collection time
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="packageReady" 
              checked={checklist.packageReady}
              onCheckedChange={(checked) => 
                updateChecklist('packageReady', checked as boolean)
              }
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="packageReady"
                className="flex items-center gap-2 cursor-pointer"
              >
                Final package ready
                {checklist.packageReady && (
                  <span className="text-xs bg-app-status-complete/20 text-app-status-complete px-2 py-0.5 rounded-full">
                    Complete
                  </span>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                Complete final packaging
              </p>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Checklist Status</p>
            <p className="text-sm text-muted-foreground">
              {progress}% Complete
            </p>
          </div>
          <Button className="gap-2" onClick={onSaveChanges}>
            <Check className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentChecklist;
