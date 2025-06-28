import { Component, HostListener, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() background: string = '';
  selectedLang = '';
  showForm: boolean = true;
  isLogin: boolean = false;
  userDate: any;
  social: any;
  userDetails: any;
  private isBrowser: boolean;

  constructor(
    private _AuthService: AuthService,
    private langService: LanguageService,
    public translate: TranslateService,
    private headerService: HeaderService,
    private httpService: HttpService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.langService.getCurrentLang().subscribe((lang) => {
      this.selectedLang = lang;
    });
  }

  ngOnInit(): void {
    // First check if user is authenticated
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
      // Only fetch user info if authenticated
      if (isAuth) {
        this.fetchUserInformation();
      }
    });

    this._AuthService.getUserData().subscribe(
      (data: any) => {
        if (data) {
          this.userDate = JSON.parse(data);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    this.headerService.toggleDropdown$.subscribe(() => {
      this.toggleDropdown();
    });

    this.httpService
      .get(environment.marsa, 'Background')
      .subscribe((res: any) => {
        this.social = res?.social;
      });
  }

  private fetchUserInformation(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.httpService.get(environment.marsa, 'user/inform').subscribe((res: any) => {
        this.userDetails = res?.user_inform;
      });
    }
  }

  getImageName(url: string): string {
    if (!url) return 'Unknown photo';
    const imageName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }

  public languageOptions = [
    { value: 'en', label: 'English', flag: 'en.webp' },
    { value: 'du', label: 'Deutsch', flag: 'du.webp' },
    { value: 'rs', label: 'Русский', flag: 'rs.webp' },
    { value: 'cez', label: 'Čeština', flag: 'cez.webp' },
  ];

  registerBehavoiur: string = 'login';
  signClick: boolean = false;

  @HostListener('document:click', ['$event'])
  OnClickSignIn(event: any) {
    if (event.target.matches('.signUpDropdownInvoker')) {
      this.signClick = !this.signClick;
    }
  }

  toggleDropdown() {
    this.signClick = !this.signClick;
  }

  changeLang() {
    this.langService.setCurrentLang(this.selectedLang);
  }

  toggleLoginForm() {
    this.signClick = !this.signClick;
  }

  callLogout(): void {
    this._AuthService.logout();
  }

  call(option: any) {
    if (this.isBrowser && this.social?.Mail) {
      window.open('mailto:' + this.social.Mail, '_blank');
    }
  }

  contactWhatsapp() {
     if (isPlatformBrowser(this.platformId)) {
       window.open('https://api.whatsapp.com/send?phone=201011117381', '_blank');
     }
   }
}
