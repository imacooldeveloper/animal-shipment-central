
import ImportChecklistCard, { DEFAULT_CHECKLIST } from '@/components/imports/ImportChecklistCard';
import ExportChecklistCard, { DEFAULT_EXPORT_CHECKLIST } from '@/components/exports/ExportChecklistCard';

interface ChecklistContainerProps {
  shipmentType: 'import' | 'export';
  formData: any;
}

const ChecklistContainer = ({ shipmentType, formData }: ChecklistContainerProps) => {
  // Convert string formData to actual object if it's a string (for previously saved data)
  const processedFormData = typeof formData === 'string' ? JSON.parse(formData) : formData;
  
  return (
    <>
      {shipmentType === 'import' ? (
        <ImportChecklistCard 
          importId="new-import"
          initialChecklist={DEFAULT_CHECKLIST}
          formData={processedFormData}
        />
      ) : (
        <ExportChecklistCard 
          exportId="new-export"
          initialChecklist={DEFAULT_EXPORT_CHECKLIST}
          formData={processedFormData}
        />
      )}
    </>
  );
};

export default ChecklistContainer;
