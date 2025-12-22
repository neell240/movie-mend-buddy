import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { BooviAnimated } from '@/components/BooviAnimated';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class PartyErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Party Mode Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
          <BooviAnimated animation="think" size="xl" />
          
          <div className="mt-6 text-center max-w-md">
            <div className="flex items-center justify-center gap-2 text-destructive mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-xl font-bold">Oops! Something went wrong</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Boovi encountered an unexpected error. Don't worry, it happens to the best of us!
            </p>

            {this.state.error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-6 text-left">
                <p className="text-xs text-destructive font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset} variant="default" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PartyErrorBoundary;
