import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CodeService } from '../services/code.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  emailPattern!: string;
  showForm: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  showRegisterComponent = false;
  isPasswordVisible = false;
  showResetComponent = false;
  showCodeSignForm = false;
  baseURL = environment.APIURL;
  private isAuthenticated = false;
  $isAuthenticated = new BehaviorSubject<boolean>(false);
  private token!: string;
  private $userData = new BehaviorSubject<any | null>(null);
  $loginError = new Subject();

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private transtale: TranslateService,
    private _HttpClient: HttpClient,
    private codeService: CodeService
  ) { }

  ngOnInit(): void {
    // إنشاء النموذج
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      rememberMe: new FormControl(false),
      showForm: new FormControl(true),
    });

    this.authService.registerBehavoir.subscribe((behavior: string) => {
      this.showRegisterComponent = behavior === 'signup';
    });
  }

  toggleVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  changeReqister(value: string) {
    if (value === 'signup') {
      this.showRegisterComponent = true;
      this.loginForm.get('showForm')?.setValue(false);
    } else if (value == 'reset') {
      this.showResetComponent = true;
      this.loginForm.get('showForm')?.setValue(false);
    } else if (value == 'otp') {
      this.showCodeSignForm = true;
      this.loginForm.get('showForm')?.setValue(false);
    } else {
      this.showRegisterComponent = false;
      this.loginForm.get('showForm')?.setValue(true);
    }
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  submitForm() {
    if (this.email.errors && this.password.errors) {
      this.toastr.error('Please enter your email and password', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
    } else if (this.email.invalid) {
      this.toastr.error('please enter a valid email address', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
    } else {
      this.authenticate(this.loginForm.value);
    }
  }

  authenticate(userData: { email: string; password: string }) {
    localStorage.setItem('userEmail', userData.email);

    this._HttpClient.post<any>(`https://admin.marsawaves.org/api/login`, userData).subscribe({
      next: (res: any) => {
        if (res && res.result) {
          // set auth status and token
          this.$isAuthenticated.next(true);
          this.token = res.access_token;

          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('userToken', res.access_token);
            localStorage.setItem('userData', JSON.stringify(res.user));
          }

          this.$userData.next(res.user);
          this.dialog?.closeAll();

          // Wait for token to be properly stored before fetching user data
          setTimeout(() => {
            // Notify the app that authentication is complete
            this.authService.$isAuthenticated.next(true);

            // Fetch user information after login
            this.fetchUserInformation();

            // Reload page after a short delay
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }, 300);
        } else {
          this.$loginError.next(true);
          this.toastr.error(res.message || 'Login failed. Please try again.');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.$loginError.next(true);

        console.log('Error message:', err.error?.message, err.error?.error?.message, err.message);

        // Handle 403 Forbidden error
        if (err.status === 403) {
          this.toastr.error(err.error.error?.message || 'Forbidden', '', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
          return;
        }

        const errorMsg = err.error?.message || err.error?.error?.message || err.message || '';

        if (errorMsg === 'User not found') {
          this.toastr.error('User not found', '', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
        } else if (errorMsg.toLowerCase().includes('verify your account')) {
          if (err.error?.user?.id) {
            this.codeService.setUserData(err.error.user.id);
          } else if (err.error?.user_id) {
            this.codeService.setUserData(err.error.user_id);
          }
          this.showCodeSignForm = true;
          this.toastr.error(errorMsg, '', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
        } else if (errorMsg === 'Unauthorized') {
          this.toastr.error('Incorrect Email or password', '', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
        } else if (err.statusText === 'Unauthorized') {
          this.toastr.error(this.transtale.instant('validation.Unauthorized'));
        } else {
          this.toastr.error('An unexpected error occurred. Please try again.');
        }
      },
    });
  }

  private fetchUserInformation() {
    const token = localStorage.getItem('userToken');
    if (token) {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      this._HttpClient.get<any>(`${environment.APIURL}user/inform`, { headers }).subscribe({
        next: (res: any) => {
          console.log('User information fetched successfully:', res);
          if (res?.user_inform) {
            localStorage.setItem('userInform', JSON.stringify(res.user_inform));
          }
        },
        error: (err: any) => {
          console.error('Error fetching user information:', err);
          this.toastr.error('Failed to fetch user information');
        }
      });
    }
  }

  closeDiv() {
    this.loginForm.reset({
      email: '',
      password: '',
      rememberMe: false,
      showForm: true,
    });
    this.showResetComponent = false;
    this.showRegisterComponent = false;
    this.dialog?.closeAll();
    this.close.emit();
  }
}
