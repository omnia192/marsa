import { NgModule, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd, UrlSegment } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LangValidatorGuard } from './core/guards/lang-validator.guard';
import { isPlatformBrowser } from '@angular/common';

export function langMatcher(segments: UrlSegment[]) {
  const supportedLangs = ['en', 'ar', 'rs', 'du', 'cez'];
  if (segments.length && supportedLangs.includes(segments[0].path)) {
    return { consumed: [segments[0]] };
  }
  return null;
}

const routes: Routes = [
  {
    matcher: langMatcher,
    loadChildren: () =>
      import('./web-site/web-site.module').then((m) => m.WebSiteModule),
  },
  {
    path: '',
    redirectTo: 'en',
    pathMatch: 'full',
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking',
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd && event.url === '/') {
          const storedLang = localStorage.getItem('lang');
          const redirectLang = storedLang || 'en';
          this.router.navigate([redirectLang]);
        }
      });
    }

    window.addEventListener('popstate', function() {
      const supportedLangs = ['en', 'ar', 'rs', 'du', 'cez'];
      const path = window.location.pathname.split('/')[1];
      if (path && !supportedLangs.includes(path)) {
        window.location.href = '/404';
      }
    });
  }
}
