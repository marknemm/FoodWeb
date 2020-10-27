import { ErrorHandler, Injectable } from '@angular/core';

/**
 * A global error handler that handles all errors produced by application-wide uncaught exceptions.
 * By default, `console.error(error)` is invoked for each uncaught error, but this does not print out the full stack trace in Nativescript.
 * Instead, we explicitly print the error's stack in order to get a detailed error message.
 *
 * Note: This is provided in AppModule.
 */
@Injectable()
export class AppErrorHandlerService implements ErrorHandler {
  handleError(error: Error): void {
    console.error(error.stack);
  }
}
