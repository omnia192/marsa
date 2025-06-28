import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LangValidatorGuard implements CanActivate, CanLoad {
  // Add your supported languages here
  private supportedLanguages = ['en', 'ar', 'rs', 'du', 'cez'];

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const lang = route.paramMap.get('lang');
    
    // Check if the language is supported
    if (lang && this.supportedLanguages.includes(lang)) {
      return true;
    }
    
    
    // If language is not supported, redirect to 404
    this.router.navigate(['/404']);
    return false;
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const lang = segments[0]?.path;
    if (lang && this.supportedLanguages.includes(lang)) {
      return true;
    }
    this.router.navigate(['/404']);
    return false;
  }
}
