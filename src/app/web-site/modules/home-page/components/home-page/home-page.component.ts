import { Component, HostListener } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  registerBehavoiur!: string;
  signClick: boolean = false;
  placesInput: any = [];
  constructor(
    private _AuthService: AuthService,
    private httpService: HttpService
  ) {
    this._AuthService.getRegisterBehavoir().subscribe((behavoiur: string) => {
      this.registerBehavoiur = behavoiur;
    });
  }
  @HostListener('document:click', ['$event'])
  OnClickSignIn(event: any) {
    if (event.target.matches('.signUpDropdownInvoker')) {
      this.signClick = !this.signClick;
    }
  }

  ngOnInit() {
    this.httpService.get('marsa', 'place').subscribe({
      next: (res: any) => {
        this.placesInput = res.places;
      },
    });
  }
}
