
import { Button } from "@/components/ui/button";

interface ShipmentFormFooterProps {
  onCancel: () => void;
  buttonLabel: string;
  buttonColor?: string;
}

const ShipmentFormFooter = ({ 
  onCancel, 
  buttonLabel, 
  buttonColor = "bg-blue-600 hover:bg-blue-700"
}: ShipmentFormFooterProps) => {
  return (
    <div className="flex items-center justify-end space-x-4">
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button type="submit" className={buttonColor}>{buttonLabel}</Button>
    </div>
  );
};

export default ShipmentFormFooter;
