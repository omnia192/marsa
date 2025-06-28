import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.scss']
})
export class DoneComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  showLogin : boolean = true
  constructor(private _AuthService:AuthService){}
  changeReqister(value:string){
    this._AuthService.updateRegisterBehavoir(value)
  }

  closeForm() {
    this.close.emit(); // Emit the close event
  }

  showLoginForm() {
    this.showLogin = !this.showLogin
  }
}
