import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
// import { AuthService } from '../auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private Language: string | null = null;

  constructor(private AuthService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Get token directly from localStorage for immediate access
    const authToken = localStorage.getItem('userToken');
    this.Language = localStorage.getItem('lang');

    // Log for debugging
    console.log('TokenInterceptor processing request to:', req.url);
    console.log('Token available:', !!authToken);

    // Only clone and add headers if we have a token
    if (authToken) {
      const authRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return next.handle(authRequest);
    }

    // If no token, just pass the request through
    return next.handle(req);
  }
}


