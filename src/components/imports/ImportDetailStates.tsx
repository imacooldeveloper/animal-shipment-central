
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoadingStateProps {
  // No props required for the loading state
}

export const LoadingState = ({}: LoadingStateProps) => (
  <div className="container mx-auto px-4 py-6">
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-center items-center py-12">
          <p className="text-muted-foreground">Loading import details...</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

interface ErrorStateProps {
  onGoBack: () => void;
  error: any;
}

export const ErrorState = ({ onGoBack, error }: ErrorStateProps) => (
  <div className="container mx-auto px-4 py-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">Error loading import details</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col items-center py-8">
          <p className="text-destructive mb-4">
            {error instanceof Error 
              ? error.message 
              : error?.message || "Details: JSON object requested, multiple (or no) rows returned"}
          </p>
          <Button onClick={onGoBack} className="gap-2">
            Back to Imports
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);
