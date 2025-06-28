import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CodeService } from '../services/code.service';

@Component({
  selector: 'app-code-sign',
  templateUrl: './code-sign.component.html',
  styleUrls: ['./code-sign.component.scss'],
})
export class CodeSignComponent implements OnInit {
  otpForm!: FormGroup;
  @Input() newPass: any;
  remainingTime: number = 59; // Initial time in seconds
  timer: any; // Variable to hold the timer reference
  showDoneForm: boolean = true;
  showNewPassForm: boolean = false;
  showLogin = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  err: any = '';
  email:any;
  constructor(
    private _AuthService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private codeService: CodeService
  ) {
    this.otpForm = this.fb.group({
      digit1: ['', Validators.maxLength(1)],
      digit2: ['', Validators.maxLength(1)],
      digit3: ['', Validators.maxLength(1)],
      digit4: ['', Validators.maxLength(1)],
      digit5: ['', Validators.maxLength(1)],
      digit6: ['', Validators.maxLength(1)],
    });
  }

  ngOnInit(): void {
    this.startTimer();
    if (typeof window !== 'undefined') {
      this.email=localStorage.getItem('userEmail');
    }
  }

  closeForm() {
    this.close.emit(); // Emit the close event
  }

  submit(form: FormGroup) {
    const mergedCode = Object.values(this.otpForm.value).join('');
    const userId = this.codeService.getUserData();
    if (form.valid) {
      let model: any = {
        user_id: userId,
      };
     
      if (this.newPass) {
        model['code'] = Number(mergedCode);
        this._AuthService.confirmReset(model);
      } else {
        model['verification_code'] = Number(mergedCode);
        this._AuthService.confirmCode(model).subscribe({
          next: (res: any) => {
            if (res.result === false) {
              // this.toastr.error(res.message);
              this.err = res.message;
            } else {
              this.showDoneForm = !this.showDoneForm;
              // if (this.newPass) {
              //   this.showDoneForm = !this.showDoneForm;
              //   this.showNewPassForm = !this.showNewPassForm;
              // } else {
              this.toastr.success(res.message, ' ', {
                disableTimeOut: false,
                titleClass: 'toastr_title',
                messageClass: 'toastr_message',
                timeOut: 5000,
                closeButton: true,
              });
              setTimeout(() => {
                this.showDoneForm = !this.showDoneForm;

                this.showLogin = true;
              }, 5000);

              //}
            }
          },
          error: (err) => {
            this.toastr.error(err.message, ' ', {
              disableTimeOut: false,
              titleClass: 'toastr_title',
              messageClass: 'toastr_message',
              timeOut: 5000,
              closeButton: true,
            });
          },
        });
      }
    }
  }
  showRegisterForm: boolean = true;

  toggleForm(): void {
    this.showLogin = !this.showLogin;
  }
  sendCode() {
    const userId = this.codeService.getUserData();

    const model = {
      email: this.email,
    };
    this._AuthService.resendCode(model).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        clearInterval(this.timer);
        this.remainingTime = 59;
        this.startTimer();
        this.otpForm.reset();
      },
    });
  }
  changeReqister(value: string) {
    this._AuthService.updateRegisterBehavoir(value);
  }

  // get code() {
  //   return this.otpForm.get('code')!;
  // }

  startTimer() {
    this.timer = setInterval(() => {
      // Decrement the remaining time
      this.remainingTime--;

      // If the remaining time reaches 0, stop the timer
      if (this.remainingTime <= 0) {
        clearInterval(this.timer);
      }
    }, 1000); // Update the timer every second (1000 milliseconds)
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
