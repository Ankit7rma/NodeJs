import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Component Error:', error);
  }

  render() {
    return this.state.hasError 
      ? <div>Error occurred. Please refresh.</div>
      : this.props.children;
  }
}

export default ErrorBoundary;
