import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

interface SEOData {
  seo: string;
  metatitle: string;
  metadesc: string;
  urlslug: string;
  canonicalurl: string;
  imagealt: string;
  robots: string;
  sitemap: string;
}


@Injectable({
  providedIn: 'root'
})
export class SEOService {
   constructor(private httpService: HttpService) {}

   ngOnInit(): void {
    this.httpService.get(environment.marsa, 'seo').subscribe((res: any) => {

    });
  }
  getSEOData(): Observable<SEOData> {
    return this.httpService.get<SEOData>(environment.marsa, 'seo');
  }
    setCanonicalURL(canonicalUrl: any): void {
    let linkElement = document.querySelector("link[rel='canonical']");
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      document.head.appendChild(linkElement);
    }
    linkElement.setAttribute('href', canonicalUrl);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('canonicalUrl', canonicalUrl);
    }
  }

  setRobotsURL(robotsUrl: any): void {
  }

  setSitemapURL(sitemapUrl: any): void {
  }

}
