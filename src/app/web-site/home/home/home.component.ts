import { Component, HostListener, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SEOService } from 'src/app/shared/services/seo.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  selectedLang = '';
  showForm: boolean = true;
  isLogin: boolean = false;
  social: any;
  userDate: any;
  placesInput: any = [];
  coverImages: any = []; // Changed to an array of strings
  currentCoverImage: string = ''; // To hold the current image being displayed
  currentIndex: number = 0; // To keep track of the current index
  interval: any;
  pText: any;
  h1Text: any;
  hometext: any;
  userDetails: any;
  constructor(
    private _AuthService: AuthService,
    private langService: LanguageService,
    public translate: TranslateService,
    private httpService: HttpService,
    private seoService: SEOService,
    private titleService: Title,
    private metaService: Meta,
    private router: Router
  ) {
    this.langService.getCurrentLang().subscribe((lang) => {
      this.selectedLang = lang;
    });


  }
  metaDetail: any;
  youtubeLink:any;
  ngOnInit(): void {
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      if (isAuth) {
        this.fetchUserInformation();
      }
    });
    this.httpService.get(environment.marsa, 'Background').subscribe(
      (res: any) => {
        this.coverImages = res?.homecover || [];
        this.hometext = res?.hometext;

        if (this.coverImages.length > 0) {
          this.currentCoverImage = this.coverImages[0];
        }

        this.social = res?.social;
        const youtubeUrl = res.social["youtube "];
        this.youtubeLink=youtubeUrl;
        // Parse hometext to separate h1 and p
        if (this.hometext) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(this.hometext, 'text/html');

          // Extract h1 content
          const h1Element = doc.querySelector('h1');
          this.h1Text = h1Element ? h1Element.textContent : null;

          // Extract p content
          const pElement = doc.querySelector('p');
          this.pText = pElement ? pElement.textContent : null;

        }
      },
      (err) => {
        console.error(err);
      }
    );
    this.seoService.getSEOData().subscribe((data) => {
      const lang = localStorage.getItem('lang');
      this.metaDetail = data?.seo;

      if (this.metaDetail) {
        this.titleService.setTitle(this.metaDetail?.metatitle);

        this.metaService.addTags([
          { name: 'description', content: this.metaDetail?.metadesc },

        ]);




        const canonicalURL = this.metaDetail?.canonicalurl;
        if (canonicalURL) {
          this.seoService.setCanonicalURL(canonicalURL);
        }
        const robots = this.metaDetail?.robots;

        if (robots) {
          this.seoService.setRobotsURL(robots);
        }
        const sitemap = this.metaDetail?.sitemap;

        if (sitemap) {
          this.seoService.setSitemapURL(sitemap);
        }
      }
    });
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;

    });

    this.startImageRotation();

    this._AuthService.getUserData().subscribe(
      (data: any) => {
        this.userDate = JSON.parse(data);
        this.httpService.get('marsa', 'place').subscribe({
          next: (res: any) => {
            this.placesInput = res.places;
          },
        });
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  private fetchUserInformation(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.httpService.get(environment.marsa, 'user/inform').subscribe((res: any) => {
        this.userDetails = res?.user_inform;
      });
    }
  }

  startImageRotation() {
    this.interval = setInterval(() => {
      if (this.coverImages.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.coverImages.length;
        this.changeCoverImage();
      }
    }, 4000);
  }

  changeCoverImage() {
    const bgElement = document.querySelector('.bg-img-hero-bottom');
    if (bgElement) {
      bgElement.classList.remove('active');
      setTimeout(() => {
        this.currentCoverImage = this.coverImages[this.currentIndex];
        bgElement.classList.add('active');
      }, 100);
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
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
  hidesectionfun: boolean = true;
  hidesection() {
    this.hidesectionfun = false;
  }

  call(option: any) {
    window.open('mailto:' + this.social.Mail, '_blank');
 }
 contactWhatsapp() {
   window.open('https://api.whatsapp.com/send?phone=201011117381', '_blank');
 }
}
