import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { LoginComponent } from '../Auth/login/login.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  log: boolean = false;
  reg: boolean = false;
  isAdmin: boolean = false;
  setting: any = [];
  flagJoin: boolean = false;
  joinInForm!: FormGroup;
  isLogin: boolean = false;
  social: any;
  showScrollToTopButton: boolean = false;
  youtubeLink:any;
  constructor(
    private fb: FormBuilder,
    private _AuthService: AuthService,
    private dialog: MatDialog,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    // Initialize the form group with a required email field
    this.joinInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });

    this.httpService
      .get(environment.marsa, 'Background')
      .subscribe((res: any) => {
        this.social = res?.social;
        const youtubeUrl = res.social["youtube "];
        this.youtubeLink=youtubeUrl;
      });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollToTopButton = window.scrollY > 400;
  }


  GetNewsletter(event: Event) {
    // Prevent the default behavior of the form submission
    event.preventDefault();

    if (!this.isLogin) {
      // If the user is not logged in, show a message and open the login dialog
      Swal.fire('Error', 'You need to log in first!', 'error').then(() => {
        this.dialog.open(LoginComponent, {
          width: '65%',
          maxHeight: '90vh',
        });
      });
    } else if (this.joinInForm.valid) {
      // If the user is logged in, send the email to the backend
      const model = {
        email: this.joinInForm.get('email')?.value,
      };

      // Make the POST request to the backend API
      this.httpService.post(environment.marsa, 'newsletter', model).subscribe({
        next: (res: any) => {
          Swal.fire('Success', 'Your request has been sent successfully.', 'success');
        },
        error: (err) => {
          // Check if the error contains an email error
          if (err.errors && err.errors.email && err.errors.email.length > 0) {
            Swal.fire('Error', err.errors.email[0], 'error');
          } else {
            Swal.fire('Error', 'The email has already been taken.', 'error');
          }
        },
      });
    } else {
      Swal.fire('Error', 'Please enter a valid email address.', 'error');
    }
  }



}
