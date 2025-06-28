import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  registerBehavoir: BehaviorSubject<string> = new BehaviorSubject<string>(
    'login'
  );
  userData: any;
  private token!: string;
  private $userData = new BehaviorSubject<any | null>(null);
  baseURL = environment.APIURL;
  private isAuthenticated = false;
  $isAuthenticated = new BehaviorSubject<boolean>(false);
  $loginError = new Subject();
  $changePassError = new Subject<any>();
  $profileUpdated = new Subject<any>();
  user: BehaviorSubject<any> = new BehaviorSubject(null);
  private isBrowser: boolean;

  constructor(
    private _HttpClient: HttpClient,
    private router: Router,
    private httpservice: HttpService,
    private toastr: ToastrService,
    private transtale: TranslateService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.registerBehavoir = new BehaviorSubject<string>('login');
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Debug token on service initialization
    this.debugToken();
    
    // Auto authenticate if token exists
    this.autoAuth();
  }
  updateRegisterBehavoir(value: string): void {
    this.registerBehavoir.next(value);
  }
  getRegisterBehavoir() {
    return this.registerBehavoir.asObservable();
  }

  register(data: any) {
    return this.httpservice.post(environment.marsa, 'signup', data);
  }

  externalLogin(userData: { idToken: string; provider: string }) {
    this._HttpClient.post<any>(`${this.baseURL}Auth/external-login`, userData).subscribe({
      next: (res: any) => {

        if (res) {
          // set auth status and token
          this.$isAuthenticated.next(true);
          this.token = res.data.accessToken;
          if (this.isBrowser) {
            localStorage.setItem('userToken', res.data.accessToken);
            // set user data
            localStorage.setItem('userData', JSON.stringify(res.data.userData));
          }
          this.$userData.next(res.data.userData);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([this.router.url]);
          });

        }
        else {
          this.$loginError.next(true);
        }
      },
      error: (err: any) => {
        this.$loginError.next(true);
        if (err.statusText == "Unauthorized") {
          this.toastr.error(this.transtale.instant("validation.Unauthorized"))
        }
        else
          this.toastr.error(err.message)
      },
    });
  }

  sendEmail(data: any) {
    return this.httpservice.post(
      environment.marsa,
      'password/forget_request',
      data
    );
  }
  confirmCode(data: any) {
    return this.httpservice.post(environment.marsa, 'confirmCode', data);
  }

  confirmReset(data: any) {
    return this.httpservice
      .post(environment.marsa, 'password/confirm_reset', data)
      .subscribe({
        next: (res: any) => {
          if (res) {
            if (!res.result) {
              this.toastr.error(res?.message);
            } else {
              // set auth status and token
              this.$isAuthenticated.next(true);
              this.token = res.access_token;
              if (this.isBrowser) {
                localStorage.setItem('userToken', res.access_token);
                // set user data
                localStorage.setItem('userData', JSON.stringify(res.user));
              }
              this.$userData.next(res.user);

              if (this.isBrowser) {
                this.dialog?.closeAll();
                window.location.href =
                  window.origin +
                  '/' +
                  localStorage.getItem('lang') +
                  '/new-password';
              }
            }
          } else {
            this.$loginError.next(true);
          }
        },
        error: (err: any) => {
          this.$loginError.next(true);
          if (err.statusText == 'Unauthorized') {
            this.toastr.error(
              this.transtale.instant('validation.Unauthorized')
            );
          } else this.toastr.error(err.message);
        },
      });
  }

  resendCode(data: any) {
    return this.httpservice.post(environment.marsa, 'resendCode', data);
  }

  authenticate(userData: { email: string; password: string }) {
    this._HttpClient.post<any>(`${this.baseURL}login`, userData).subscribe({
      next: (res: any) => {
        if (res && res.result) {
          // set auth status and token
          this.$isAuthenticated.next(true);
          this.token = res.access_token;

          if (this.isBrowser) {
            // Log token for debugging
            console.log('Storing token:', res.access_token.substring(0, 10) + '...');
            
            localStorage.setItem('userToken', res.access_token);
            localStorage.setItem('userData', JSON.stringify(res.user));
          }

          this.$userData.next(res.user);
          this.dialog?.closeAll();

          // Wait for token to be properly stored before fetching user data
          setTimeout(() => {
            // Fetch user information after login
            this.fetchUserInformation();

            // Reload page after a short delay
            setTimeout(() => {
              if (this.isBrowser) {
                window.location.reload();
              }
            }, 500);
          }, 300);
        } else {
          this.$loginError.next(true);
          this.toastr.error(res.message || 'Login failed. Please try again.');
        }
      },
      error: (err: any) => {
        this.$loginError.next(true);

        if (err.error && err.error.message) {
          if(err.error.message === 'Unauthorized'){
            this.toastr.error('Incorrect email or password', '', {
              disableTimeOut: false,
              titleClass: 'toastr_title',
              messageClass: 'toastr_message',
              timeOut: 5000,
              closeButton: true,
            });
          }
          else if (err.error.message === 'Please verify your account'){
            this.toastr.error(err.error.message, '', {
              disableTimeOut: false,
              titleClass: 'toastr_title',
              messageClass: 'toastr_message',
              timeOut: 5000,
              closeButton: true,
            });
            this.dialog?.closeAll();
          }
        } else if (err.statusText === 'Unauthorized') {
          this.toastr.error(this.transtale.instant('validation.Unauthorized'));
        } else {
          this.toastr.error('An unexpected error occurred. Please try again.');
        }
      },
    });
  }


  isLoginError(): Observable<boolean> {
    return this.$loginError as Observable<boolean>;
  }
  isChangePassError(): Observable<boolean> {
    return this.$changePassError as Observable<boolean>;
  }
  profileUpdated(): Observable<boolean> {
    return this.$profileUpdated as Observable<boolean>;
  }

  logout() {
    localStorage.removeItem('userToken');
    this.$isAuthenticated.next(false);
    this.token = '';
    localStorage.removeItem('userData');
    this.$userData.next(null);
    // this.router.navigate(['/']);
  }

  autoAuth() {
    if (this.isBrowser) {
      const token = localStorage.getItem('userToken');
      if (token) {
        // Set authentication status only if token exists
        this.token = token;
        this.isAuthenticated = true;
        this.$isAuthenticated.next(true);
        
        // Log successful authentication
        console.log('Auto authentication successful with token:', token.substring(0, 10) + '...');
      } else {
        // If token doesn't exist (page refresh), reset authentication status
        this.isAuthenticated = false;
        this.$isAuthenticated.next(false);
        console.log('Auto authentication failed: No token found');
      }
    }
  }

  getToken() {
    if (this.isBrowser) {
      if (localStorage.getItem('userToken')) {
        this.token = localStorage.getItem('userToken')!;
        return this.token;
      }
    }
    return '';
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getUserData() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.$userData.next(userData);
      }
    }
    return this.$userData as Observable<any>;
  }
  changeWebsiteUserSettings(formData: FormData) {
    this.httpservice
      .post<any>(environment.marsa, 'profile/update', formData)
      .subscribe({
        next: (res: any) => {
          this.$isAuthenticated.next(true);
          this.token = res.data.access_token;
          if (typeof window !== 'undefined' && window.localStorage){

            localStorage.setItem('userToken', res.data.access_token);

            localStorage.setItem('userData', JSON.stringify(res.data.user));
          }
          this.$userData.next(res.data.user);
          this.$profileUpdated.next(true);

          // window.location.reload();
        },
        error: (err) => {
          this.$changePassError.next(true);
        },
      });
  }

  fetchUserInformation(): void {
    const token = localStorage.getItem('userToken');
    if (token && this.isBrowser) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      this._HttpClient.get<any>(`${this.baseURL}user/inform`, { headers }).subscribe({
        next: (res: any) => {
          console.log('User information fetched successfully');
          if (res?.user_inform) {
            localStorage.setItem('userInform', JSON.stringify(res.user_inform));
          }
        },
        error: (err: any) => {
          console.error('Error fetching user information:', err);
        }
      });
    }
  }

  // Add this method to debug token issues
  debugToken(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem('userToken');
      console.log('Current token in localStorage:', token ? token.substring(0, 10) + '...' : 'No token found');
      
      // Check if token is actually stored
      if (!token) {
        console.warn('No token found in localStorage. User might not be logged in.');
        this.$isAuthenticated.next(false);
      } else {
        console.log('Token found in localStorage. User should be authenticated.');
        this.$isAuthenticated.next(true);
      }
    }
  }
}
