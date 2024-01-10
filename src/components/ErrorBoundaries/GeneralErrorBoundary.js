import React from "react";
import ErrorBoundaryDiv from "./ErrorBoundaryDiv";

class GeneralErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // logError ( error, errorInfo ) ;
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryDiv />;
    }

    return this.props.children;
  }
}

export default GeneralErrorBoundary;
