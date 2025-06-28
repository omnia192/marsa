import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { LoginComponent } from '../Auth/login/login.component';
import { HostListener } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from 'src/app/core/services/http/http.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() background: string = '';
  @Input() isWhiteByDefault: boolean = true;
  selectedLang = '';
  isLogin: boolean = false;
  isOpen = false;
  selectedLabel!: string;
  selectedImg!: string;
  isOffCanvasOpen = false;
  showSearch: boolean = false;
  userDate: any;
  keyword: any = '';
  results: any = { trip: [] };
  showDropdown: boolean = false;
  userDetails: any;
  private isBrowser: boolean;

  constructor(
    public translate: TranslateService,
    private langService: LanguageService,
    private _AuthService: AuthService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _HttpService: HttpService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.langService.getCurrentLang().subscribe((lang) => {
      this.selectedLang = lang;
    });
  }

  getImageName(url: string): string {
    if (!url) return 'Unknown photo';
    const imageName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
  private searchTimeout: any;
private blurTimeout: any;
isSearching = false;
showNoResults = false;


  onInput(event: any) {
  const value = event.target.value.trim();

  // إلغاء البحث السابق
  if (this.searchTimeout) {
    clearTimeout(this.searchTimeout);
  }

  // إخفاء النتائج إذا كان النص فارغ
  if (!value) {
    this.showDropdown = false;
    this.showNoResults = false;
    return;
  }

  // البحث بعد تأخير قصير (500ms)
  this.searchTimeout = setTimeout(() => {
    this.performAutoSearch();
  }, 500);
}


// دالة للتعامل مع keyup (للحفاظ على وظيفة Enter)
onKeyup(event: any) {
  if (event.key === 'Enter') {
    this.onButtonSearch();
  }
}

// دالة للتعامل مع focus
onFocus(event: any) {
  if (this.keyword && this.keyword.trim()) {
    this.performAutoSearch();
  }
}

// دالة للتعامل مع blur
onInputBlur() {
  this.blurTimeout = setTimeout(() => {
    this.hideDropdown();
  }, 200);
}

// البحث التلقائي
private performAutoSearch() {
  if (!this.keyword || !this.keyword.trim()) {
    this.showDropdown = false;
    return;
  }

  this.isSearching = true;
  this.showDropdown = true;
  this.showNoResults = false;

  this._HttpService.post(environment.marsa, 'search/keyword', { keyword: this.keyword.trim() }).subscribe(
    (data) => {
      console.log('Auto search results:', data);
      this.results = data;
      this.isSearching = false;

      // التحقق من وجود نتائج
      if (this.results?.trip && this.results.trip.length > 0) {
        this.showDropdown = true;
        this.showNoResults = false;
      } else {
        this.showDropdown = true;
        this.showNoResults = true;
      }
    },
    (error) => {
      console.error('Auto Search Error:', error);
      this.isSearching = false;
      this.showDropdown = true;
      this.showNoResults = true;
    }
  );
}

// البحث عند الضغط على الزر أو Enter
onButtonSearch() {
  if (!this.keyword || !this.keyword.trim()) {
    if (this.isBrowser) {
      Swal.fire('Error', 'Please enter a Keyword', 'error');
    }
    return;
  }

  this.performSearch();
}
private performSearch() {
  this.isSearching = true;
  this.showDropdown = false;

  this._HttpService.post(environment.marsa, 'search/keyword', { keyword: this.keyword.trim() }).subscribe(
    (data) => {
      console.log('Main search results:', data);
      this.results = data;
      this.isSearching = false;


    },
    (error) => {
      console.error('Main Search Error:', error);
      this.isSearching = false;
    }
  );
}

navigateToResult(result: any) {
  if (this.blurTimeout) {
    clearTimeout(this.blurTimeout);
  }

  this.router.navigate(['/', this.translate.currentLang, 'tours', result?.id, result?.slugUrl]);
  this.hideDropdown();
  this.keyword = result.Name;
}

hideDropdown() {
  this.showDropdown = false;
  this.showNoResults = false;
}

ngOnDestroy() {
  if (this.searchTimeout) {
    clearTimeout(this.searchTimeout);
  }
  if (this.blurTimeout) {
    clearTimeout(this.blurTimeout);
  }
}

    public languageOptions = [
    { value: 'en', label: 'English', flag: 'en.webp' },
    { value: 'du', label: 'Deutsch', flag: 'du.webp' },
    { value: 'rs', label: 'Русский', flag: 'rs.webp' },
    { value: 'cez', label: 'Čeština', flag: 'cez.webp' },
  ];

  changeLang() {
    this.langService.setCurrentLang(this.selectedLang);
  }

   isScrolled = false;

  @HostListener('window:scroll', [])
  checkScroll() {
    if (this.isBrowser) {
      this.isScrolled = window.scrollY > 100;
    }
  }

  countries = [
    {
      value: 'en',
      label: 'English',
      flagUrl: '../../../../../assets/images/flags/en.webp',
    },
    {
      value: 'du',
      label: 'Deutsch',
      flagUrl: '../../../../../assets/images/flags/du.webp',
    },
    {
      value: 'rs',
      label: 'Русский',
      flagUrl: '../../../../../assets/images/flags/rs.webp',
    },
    {
      value: 'cez',
      label: 'Čeština',
      flagUrl: '../../../../../assets/images/flags/cez.webp',
    },
  ];

  ngOnInit() {
    // First check authentication status
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;

      // Only fetch user data if authenticated
      if (isAuth) {
        this.fetchUserInformation();
      }
    });

    // Initialize selectedLabel with the first country's label
    if (this.countries.length > 0) {
      const initialCountry = this.countries.find(c => c.value === this.selectedLang) || this.countries[0];
      this.selectedLabel = initialCountry.label;
      this.selectedImg = initialCountry.flagUrl;
    }

    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
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
  }

  private fetchUserInformation(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      // Add a small delay to ensure token is properly set in localStorage
      setTimeout(() => {
        this._HttpService.get(environment.marsa, 'user/inform').subscribe(
          (res: any) => {
            this.userDetails = res?.user_inform;
          },
          (error) => {
            console.error('Error fetching user information:', error);
          }
        );
      }, 300);
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  callLogout(): void {
    this._AuthService.logout();
  }

  closeOffcanvas() {
    if (!this.isBrowser) return;

    const offcanvasElement = document.getElementById('staticBackdrop');
    const offcanvasBackdropElement = document.querySelector('.offcanvas-backdrop');

    if (offcanvasElement) {
      offcanvasElement.classList.remove('show');
    }

    if (offcanvasBackdropElement) {
      offcanvasBackdropElement.classList.remove('show');
    }

    if (offcanvasBackdropElement && offcanvasBackdropElement.parentNode) {
      offcanvasBackdropElement.parentNode.removeChild(offcanvasBackdropElement);
    }

    this.dialog.open(LoginComponent, {
      width: '100%',
      maxHeight: '80vh',
    });
  }

  signIn() {
    this.closeOffcanvas();
  }

  selectCountry(country: any) {
    this.selectedLabel = country.label;
    this.selectedImg = country.flagUrl;
    this.langService.setCurrentLang(country.value);
    this.isOpen = false;
  }

  openOffcanvas() {
    this.isOffCanvasOpen = true;
  }

  toggleOffcanvas() {
    this.isOffCanvasOpen = false;
  }

  // navigateToTrip(result: any) {
  //   console.log('Navigating to trip:', result);

  //   // Close dropdown and clear search
  //   this.showDropdown = false;
  //   this.keyword = '';

  //   // Simple navigation to tours page with search parameter
  //   const route = ['/', this.translate.currentLang, 'tours'];
  //   const queryParams = { search: result.Name };

  //   this.router.navigate(route, { queryParams }).then(success => {
  //     console.log('Navigation success:', success);
  //   }).catch(error => {
  //     console.error('Navigation error:', error);
  //   });
  // }
}





