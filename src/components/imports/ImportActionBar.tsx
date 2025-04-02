
import { ArrowLeft, Pencil, X, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onGoBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{importNumber}</h1>
        </div>
        
        {!isEditing ? (
          <Button onClick={onToggleEdit} className="flex items-center">
            <Pencil className="mr-2 h-4 w-4" /> Edit Import
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex items-center"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button 
              type="submit"
              form="import-edit-form"
              className="flex items-center bg-emerald-600 hover:bg-emerald-700"
              disabled={isPending}
            >
              <Save className="mr-2 h-4 w-4" /> 
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {progressValue > 0 && (
        <div className="w-full space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Import Progress</span>
            <span className="text-sm">{progressValue}% Complete</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
      )}
    </div>
  );
};

export default ImportActionBar;
