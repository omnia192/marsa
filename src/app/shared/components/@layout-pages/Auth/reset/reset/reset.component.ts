import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CodeService } from '../../services/code.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  resetForm!: FormGroup;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  showResetForm: boolean = true;
  showCodeSignForm: boolean = true;

  constructor(
    private _AuthService: AuthService,
    private _FormBuilder: FormBuilder,
    private _Router: Router,
    private dialog: MatDialog,
    private codeService: CodeService,
    private toastr: ToastrService
  ) { }
  initialForm() {
    this.resetForm = this._FormBuilder.group({
      email: ['', Validators.required],
    });
  }
  get email() {
    return this.resetForm.get('email')!;
  }
  submit() { }
  changeReqister(value: string) {
    this._AuthService.updateRegisterBehavoir(value);
  }
  ngOnInit(): void {
    this.initialForm();
  }

  closeReset() {
    this.dialog?.closeAll();
    this.close.emit(); // Emit the close event
  }

  reset(form: FormGroup) {
    this.changeReqister('otp');
    if (form.valid) {
      const email = this.resetForm.value.email;
      if (typeof window !== 'undefined' && window.localStorage){
        localStorage.setItem('userEmail', email);

      }
      this._AuthService.sendEmail({ email }).subscribe({
        next: (res: any) => {
          this.showResetForm = false;
          this.showCodeSignForm = !this.showCodeSignForm;
          this.toastr.success(res.message, ' ', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
          this.codeService.setUserData(res.user_id);
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'An unexpected error occurred.';
          this.toastr.error(errorMessage, '', {
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
  showRegisterForm: boolean = true;

  toggleForm(): void {
    this.showRegisterForm = !this.showRegisterForm;
  }
}
