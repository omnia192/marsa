import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastr:ToastrService,
    private router:Router) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      if (!environment.enableInterceptor) {
        return next.handle(request);
      }

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          this.toastr.error(error.message, '', {
            disableTimeOut: false,
            titleClass: "toastr_title",
            messageClass: "toastr_message",
            timeOut: 5000,
            closeButton: true,
          });

          if (error.error.message == "jwt expired" || error.error.message == "jwt must provide") {
            this.router.navigate(['/login']);
            localStorage.removeItem("token");
          }

          throw error;
        })
      );
    }
}
