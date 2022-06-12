import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      eventId: null
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  render() {
    if (this.state.error) {
      return (
        <a onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>
          Report feedback
        </a>
      );
    } else {
      return this.props.children;
    }
  }
}
