
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
          <div className="flex space-x-2">
            <div className="h-3 w-3 bg-blue-300 rounded-full animate-pulse"></div>
            <div className="h-3 w-3 bg-blue-400 rounded-full animate-pulse delay-150"></div>
            <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse delay-300"></div>
          </div>
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
      <CardContent className="pt-6">
        <div className="flex flex-col items-center py-12">
          <p className="text-destructive mb-4">Error loading export details</p>
          {error && <p className="text-sm text-muted-foreground mb-4">Details: {error.message || JSON.stringify(error)}</p>}
          <button onClick={onGoBack} className="flex items-center gap-2 px-4 py-2 rounded-md border">
            Back to Exports
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
);
