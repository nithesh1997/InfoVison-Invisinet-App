import React from "react";
import SelfContainedErrorComponent from "./SelfContainedErrorComponent";

class SelfContainedErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {}

  render() {
    if (this.state.hasError || this.props.forceError) {
      return (
        <SelfContainedErrorComponent
          minHeight={this.props.minHeight}
          errorHeading={this.props.errorHeading}
          errorMessage={this.props.errorMessage}
        />
      );
    }
    return this.props.children;
  }
}
export default SelfContainedErrorBoundary;
