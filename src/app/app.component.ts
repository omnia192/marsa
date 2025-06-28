import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { LanguageService } from './shared/services/language.service';
import { AuthService } from './shared/services/auth.service';
import { Meta, Title } from '@angular/platform-browser';
import { SEOService } from './shared/services/seo.service';
import { ConnectivityNotificationComponent } from './shared/components/connectivity-notification/connectivity-notification.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ConnectivityNotificationComponent,
    NgxSpinnerModule
  ]
})
export class AppComponent implements OnInit {
  metaDetail: any;
  sitemap: string = '';
  robots: any;
  imageUrl: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/479px-WhatsApp_icon.png';
  
  constructor(
    private langServ: LanguageService,
    private authService: AuthService,
    private seoService: SEOService,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Subscribe to router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const lang = localStorage.getItem('lang') || '';
      if (lang) {
        this.langServ.setCurrentLang(lang, true);
      } else {
        this.langServ.setCurrentLang('en', true);
      }
      this.authService.autoAuth();
    }
    this.seoService.getSEOData().subscribe((data) => {
      this.metaDetail = data?.seo;
      this.sitemap = this.metaDetail?.sitemap || '';
      this.robots = this.metaDetail?.robots;
    });
  }
  getImageName(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1, url.indexOf('.'));
  }
  contactWhatsapp() {
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://api.whatsapp.com/send?phone=201011117381', '_blank');
    }
  }
}
