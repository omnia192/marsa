import { FormGroup } from '@angular/forms';
import { AuthService } from './../../../../../services/auth.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})

export class OtpComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  otp!: FormGroup
  constructor(private dialog: MatDialog,
    private _AuthService:AuthService){}
  submit(){}
  changeReqister(value:string){
    this._AuthService.updateRegisterBehavoir(value)
  }
  get code() {
    return this.otp.get('code')!;
  }
 
  closeReset() {
    this.dialog?.closeAll();
    this.close.emit(); // Emit the close event
  }
}


