import {getRumClient} from '@/instrumentation';

export const logger = {
  error: (message: string, error?: unknown, context?: Record<string, any>) => {
    const rum = getRumClient();

    if (error instanceof Error) rum?.recordError(error);
    else rum?.recordError(new Error(message));

    // The following line might be removed in the future.

    rum?.recordEvent('logger_error', {message, ...context});
  },

  warn: (message: string, context?: Record<string, any>) => {
    getRumClient()?.recordEvent('logger_warning', {message, ...context});
  },

  info: (message: string, context?: Record<string, any>) => {
    getRumClient()?.recordEvent('logger_info', {message, ...context});
  },
};
