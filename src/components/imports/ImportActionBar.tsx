
import { ArrowLeft, Pencil, X, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ImportActionBarProps {
  importNumber: string;
  isEditing: boolean;
  isPending: boolean;
  onGoBack: () => void;
  onToggleEdit: () => void;
  onCancel: () => void;
}

const ImportActionBar = ({ 
  importNumber, 
  isEditing, 
  isPending, 
  onGoBack, 
  onToggleEdit, 
  onCancel 
}: ImportActionBarProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
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
  );
};

export default ImportActionBar;
