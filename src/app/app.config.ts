
import { ApplicationConfig, importProvidersFrom, InjectionToken, FactoryProvider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Create a token for Leaflet
export const LEAFLET = new InjectionToken<any>('Leaflet');

// Factory provider for Leaflet that only loads in browser environment
export const leafletProvider: FactoryProvider = {
  provide: LEAFLET,
  useFactory: (platformId: Object) => {
    if (isPlatformBrowser(platformId)) {
      return import('leaflet').then(module => {
        console.log('Leaflet loaded via provider');
        return module;
      }).catch(error => {
        console.error('Failed to load Leaflet in provider:', error);
        return null;
      });
    }
    return null;
  },
  deps: [PLATFORM_ID]
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    leafletProvider,
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        closeButton: true
      }),
      NgxSpinnerModule.forRoot()
    )
  ]
};
