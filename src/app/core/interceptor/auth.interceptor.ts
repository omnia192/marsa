import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {
  Observable,
  Subject,
  catchError,
  finalize,
  mergeMap,
  takeUntil,
  throwError,
  timer,
} from 'rxjs';
// import { HelperService } from '../helper/helper.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private helper: NgxSpinnerService,
     private router: Router,
     private toastr:ToastrService) {}
  private unsubscribe$ = new Subject<void>();
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      if (token) {
        const modifiedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });



      return next.handle(modifiedRequest).pipe(
        finalize(() => {
          this.helper.hide();
        }),
        takeUntil(this.unsubscribe$),
        catchError((error) => {
          if (error.status === 401) {
            this.router.navigate(['auth/login']);
            localStorage.clear();
            this.unsubscribe$.next();
            return timer(0).pipe(
              mergeMap(() => {
                this.toastr.error('Error', error.error.message , {
                  disableTimeOut: false,
                  titleClass: "toastr_title",
                  messageClass:"toastr_message",
                  timeOut:5000,
                  closeButton:true,
                  });
                return throwError(error);
              })
            );
          }

          return throwError(error);
        })
      );
    }
  }

    return next.handle(request);
  }
}
zz