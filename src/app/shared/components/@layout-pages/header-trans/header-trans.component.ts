import { Component, HostListener, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header-trans',
  templateUrl: './header-trans.component.html',
  styleUrls: ['./header-trans.component.scss']
})
export class HeaderTransComponent {
  registerBehavoiur!:string
  signClick: boolean = false;
  constructor(
    private renderer: Renderer2,
    private _AuthService:AuthService,
    public translate:TranslateService
    ){
    this._AuthService.getRegisterBehavoir().subscribe((behavoiur:string)=>{
      this.registerBehavoiur=behavoiur
    })
  }

  @HostListener('document:click', ['$event'])
  OnClickSignIn(event: any) {
    if (event.target.matches('.signUpDropdownInvoker')) {
      this.signClick = !this.signClick;
    }
  }
  toggleDropdown() {
    this.signClick = !this.signClick;
  }
  isDropdownOpen = false;
  toggleDropdown2(event: Event) { event.preventDefault(); this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen)
      { this.renderer.listen('document', 'click', (e: Event) => { const target = e.target as HTMLElement; if (!target.closest('.dropdown-menu') && !target.closest('.dropdown-toggle')) { this.isDropdownOpen = false; } }); } }

}
