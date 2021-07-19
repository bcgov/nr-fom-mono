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

        const error = err?.error?.message || err.statusText;
        console.log({
          lvl: 'ERROR',
          mssg: `${request.urlWithParams} failed with error: ${error}`,
        });

        this.modalSvc.openDialog({
          data: {
            message: `The request failed to process due to an error.`,
            title: `Error: ${err?.error?.message || err.statusText} - ${request.url}`,
            buttons: { cancel: { text: 'Okay' } },
          },
        });

        return throwError(error);
      })
    );
  }
}
