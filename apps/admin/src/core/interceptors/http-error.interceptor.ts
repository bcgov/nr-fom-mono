import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ModalService } from '../services/modal.service';
import { StateService } from '../../core/services/state.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private modalSvc: ModalService,
    private stateSvc: StateService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle( request ).pipe(
      tap( () => this.stateSvc.loading = true ),
      finalize(() => this.stateSvc.loading = false),
      catchError((err) => {

        // TODO: Handle BadRequest error and Forbidden error and provide custom messages.

        const error = err?.error?.message || err.statusText;
        console.error(`${request.urlWithParams} failed with error: ` + JSON.stringify(err));

        this.modalSvc.openErrorDialog(`The request failed to process due to an error. Please try again later.`);

        return throwError(error);
      })
    );
  }
}
