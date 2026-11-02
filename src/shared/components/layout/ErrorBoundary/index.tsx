'use client';

import {Component, ErrorInfo} from 'react';

import {getRumClient} from '@/instrumentation';
import {
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from '@/shared/interfaces/common';
import {logger} from '@/shared/utils/logger';

import {ErrorFallback} from './errorFallBackFile';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  // eslint-disable-next-line local-rules/enforce-single-object-param
  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'production') {
      const rum = getRumClient();
      rum?.recordError(error);
      rum?.recordEvent('error_boundary_catch', {
        message: error.message,
        componentStack: info.componentStack ?? '',
        errorName: error.name,
        errorStack: error.stack ?? '',
      });
    } else {
      logger.error('Error caught by ErrorBoundary:', error, info);
    }
  }

  // Going back from the fallback changes the route, so a new route clears the
  // error instead of leaving the fallback on screen.
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.resetError();
    }
  }

  resetError = () => {
    this.setState({hasError: false});
  };

  render() {
    if (this.state.hasError) {
      const {fallback} = this.props;

      return fallback || <ErrorFallback onReset={this.resetError} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
