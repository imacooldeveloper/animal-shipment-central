
import { Info } from 'lucide-react';

interface StatusWarningProps {
  show: boolean;
}

const StatusWarning = ({ show }: StatusWarningProps) => {
  if (!show) return null;
  
  return (
    <div className="bg-slate-100 p-4 rounded-md border border-slate-200 flex items-start space-x-3 mb-4">
      <Info className="text-slate-500 h-5 w-5 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-slate-600">
        You're waiting on lab paperwork. You can leave the other fields blank for now and update this shipment later.
      </p>
    </div>
  );
};

export default StatusWarning;
