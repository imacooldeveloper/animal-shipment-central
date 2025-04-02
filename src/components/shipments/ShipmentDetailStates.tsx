
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box } from 'lucide-react';

interface LoadingStateProps {}

export const LoadingState = ({}: LoadingStateProps) => (
  <div className="flex justify-center items-center h-64">
    <div className="flex space-x-2">
      <div className="h-3 w-3 bg-rose-300 rounded-full animate-pulse"></div>
      <div className="h-3 w-3 bg-rose-400 rounded-full animate-pulse delay-150"></div>
      <div className="h-3 w-3 bg-rose-500 rounded-full animate-pulse delay-300"></div>
    </div>
  </div>
);

interface ErrorStateProps {
  error: string | null;
  onNavigateBack: () => void;
}

export const ErrorState = ({ error, onNavigateBack }: ErrorStateProps) => (
  <div className="space-y-4">
    <Button variant="ghost" onClick={onNavigateBack}>
      Back
    </Button>
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">Shipment Not Found</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {error || "We couldn't find the shipment you're looking for."}
          </p>
          <Button onClick={onNavigateBack}>
            Return to Previous Page
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);
