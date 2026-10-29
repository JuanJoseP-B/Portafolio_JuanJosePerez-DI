import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Called once when anything below throws while rendering or loading (WebGL failure, lazy chunk error...). */
  onError: (error: Error) => void;
}

/** Error boundary around the 3D scene: a failure must end in the text version, never in a blank screen. */
export class SceneBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('The 3D scene failed to start:', error, info.componentStack);
    this.props.onError(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
