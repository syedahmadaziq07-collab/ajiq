import { Component, type ReactNode, type ErrorInfo } from "react";
import { Link } from "wouter";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 px-4">
          <p className="text-[#e00] text-[14px] font-[500]">Something went wrong</p>
          <p className="text-[#747474] text-[13px] max-w-[400px] text-center">{this.state.error.message}</p>
          <Link href="/" className="text-[#000] underline underline-offset-2 text-[13px]">Back to Home</Link>
        </div>
      );
    }
    return this.props.children;
  }
}
