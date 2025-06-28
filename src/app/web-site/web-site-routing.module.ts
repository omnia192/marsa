import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'en',
    pathMatch: 'full'
  },
  {
    path: ':lang',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'tours',
        loadChildren: () => import('./modules/tours/tours.module').then(m => m.ToursModule)
      },
      {
        path: 'boats',
        loadChildren: () => import('./modules/boats/boats.module').then(m => m.BoatsModule)
      },
      {
        path: 'blogs',
        loadChildren: () => import('./modules/blogs/blogs.module').then(m => m.BlogsModule)
      },
      {
        path: 'faq',
        loadChildren: () => import('./modules/faq/faq.module').then(m => m.FaqModule)
      },
      {
        path: 'booking',
        loadChildren: () => import('./modules/booking/booking.module').then(m => m.BookingModule)
      },
      // Add other routes as needed when modules are confirmed to exist
      {
        path: '404',
        component: NotFoundComponent
      },
      {
        path: '**',
        redirectTo: '/404'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebSiteRoutingModule { }
