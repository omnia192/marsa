import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLang: BehaviorSubject<string>;
  private isBrowser: boolean;
  private supportedLanguages = ['en', 'ar', 'rs', 'du', 'cez'];

  constructor(
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentLang = new BehaviorSubject<string>('en');
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setCurrentLang(language: string, init: boolean = false) {
    // Check if language is supported
    if (this.supportedLanguages.includes(language)) {
      let htmlTag = this.document.getElementsByTagName(
        'html'
      )[0] as HTMLHtmlElement;
      htmlTag.dir = language === 'en' ? 'ltr' : 'ltr';
      htmlTag.lang = language;
      this.translateService.use(language);
      
      if (this.isBrowser) {
        localStorage.setItem('lang', language);
      }
      
      this.currentLang.next(language);

      // Only perform URL-related operations in browser
      if (this.isBrowser && !init) {
        // Get the current URL segments
        const currentUrlSegments = this.router.url.split('/');
        currentUrlSegments[1] = language;
        // Construct the new URL and navigate to it
        const newUrl = currentUrlSegments.join('/');

        this.router.navigateByUrl(newUrl).then(() => {
          window.location.reload();
        });
      }
    } else {
      // If language is not supported, redirect to 404
      this.router.navigate(['/404']);
    }
  }

  getCurrentLang() {
    return this.currentLang.asObservable();
  }

  isLanguageSupported(language: string): boolean {
    return this.supportedLanguages.includes(language);
  }

  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }
}
