
import ImportChecklistCard, { DEFAULT_CHECKLIST } from '@/components/imports/ImportChecklistCard';
import ExportChecklistCard, { DEFAULT_EXPORT_CHECKLIST } from '@/components/exports/ExportChecklistCard';

interface ChecklistContainerProps {
  shipmentType: 'import' | 'export';
  formData: any;
}

const ChecklistContainer = ({ shipmentType, formData }: ChecklistContainerProps) => {
  return (
    <>
      {shipmentType === 'import' ? (
        <ImportChecklistCard 
          importId="new-import"
          initialChecklist={DEFAULT_CHECKLIST}
          formData={formData}
        />
      ) : (
        <ExportChecklistCard 
          exportId="new-export"
          initialChecklist={DEFAULT_EXPORT_CHECKLIST}
          formData={formData}
        />
      )}
    </>
  );
};

export default ChecklistContainer;
