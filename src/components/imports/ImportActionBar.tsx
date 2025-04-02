
import { ArrowLeft, Pencil, X, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface ImportActionBarProps {
  importNumber: string;
  isEditing: boolean;
  isPending: boolean;
  onGoBack: () => void;
  onToggleEdit: () => void;
  onCancel: () => void;
  progressValue?: number;
}

const ImportActionBar = ({ 
  importNumber, 
  isEditing, 
  isPending, 
  onGoBack, 
  onToggleEdit, 
  onCancel,
  progressValue = 0
}: ImportActionBarProps) => {
  return (
    <Card className="p-4 mb-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onGoBack} aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">{importNumber}</h1>
          </div>
          
          <div className="sm:ml-auto">
            {!isEditing ? (
              <Button onClick={onToggleEdit} className="flex items-center gap-2">
                <Pencil className="h-4 w-4" /> <span className="hidden sm:inline">Edit Import</span>
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" /> <span className="hidden sm:inline">Cancel</span>
                </Button>
                <Button 
                  type="submit"
                  form="import-edit-form"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                  disabled={isPending}
                >
                  <Save className="h-4 w-4" /> 
                  <span className="hidden sm:inline">{isPending ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {progressValue > 0 && (
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Import Progress</span>
              <span className="text-sm text-muted-foreground">{progressValue}% Complete</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImportActionBar;
