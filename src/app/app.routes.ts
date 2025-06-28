import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => 
      import('./web-site/web-site.module').then((m) => m.WebSiteModule)
  },
  { path: '**', redirectTo: '' }
]; 