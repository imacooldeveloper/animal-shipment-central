
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ShipmentFormFooterProps {
  onCancel: () => void;
  buttonLabel: string;
  buttonColor: string;
  isSubmitting?: boolean;
}

const ShipmentFormFooter = ({
  onCancel,
  buttonLabel,
  buttonColor,
  isSubmitting = false
}: ShipmentFormFooterProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className={buttonColor}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          buttonLabel
        )}
      </Button>
    </div>
  );
};

export default ShipmentFormFooter;
