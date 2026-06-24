import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  // Use Injector to safely get services later and prevent cyclic dependencies
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    // Check if it is a backend/network error or a frontend code error
    if (error instanceof HttpErrorResponse) {
      console.error('Backend returned code:', error.status, 'body was:', error.error);
    } else {
      console.error('A client-side runtime error occurred:', error.message || error);
      const snackBar = this.injector.get(MatSnackBar);
      const message = error.message ? error.message : error.toString();

      snackBar.open(message, 'Close', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }
}
