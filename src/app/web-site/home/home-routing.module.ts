import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewPasswordComponent } from 'src/app/shared/components/@layout-pages/Auth/newpassword/new-password/new-password.component';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },


  {
    path: 'mainPage',
    loadChildren: () =>
      import(`../modules/home-page/home-page.module`).then(
        (m) => m.HomePageModule
      ),
  },

  {
    path: 'about',
    loadChildren: () =>
      import(`../modules/about-us/about-us.module`).then(
        (m) => m.AboutUsModule
      ),
  },

  {
    path: 'blogs',
    loadChildren: () =>
      import(`../modules/blogs/blogs.module`).then((m) => m.BlogsModule),
  },
  {
    path: 'boats',
    loadChildren: () =>
      import(`../modules/boats/boats.module`).then((m) => m.BoatsModule),
  },
  {
    path: 'booking',
    loadChildren: () =>
      import(`../modules/booking/booking.module`).then((m) => m.BookingModule),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import(`../modules/cart/cart.module`).then((m) => m.CartModule),
  },
  {
    path: 'contactUs',
    loadChildren: () =>
      import(`../modules/contact-us/contact-us.module`).then(
        (m) => m.ContactUsModule
      ),
  },
  {
    path: 'liveboard',
    loadChildren: () =>
      import(`../modules/liveboard/liveboard.module`).then(
        (m) => m.LiveboardModule
      ),
  },
  {
    path: 'packages',
    loadChildren: () =>
      import(`../modules/packages/packages.module`).then(
        (m) => m.PackagesModule
      ),
  },
  {
    path: 'privacy',
    loadChildren: () =>
      import(`../modules/privacy/privacy.module`).then((m) => m.PrivacyModule),
  },
  {
    path: 'tours',
    loadChildren: () =>
      import(`../modules/tours/tours.module`).then((m) => m.ToursModule),
  },
  {
    path: 'transfer',
    loadChildren: () =>
      import(`../modules/transfer/transfer.module`).then(
        (m) => m.TransferModule
      ),
  },
  {
    path: 'userDashboard',
    loadChildren: () =>
      import(`../modules/user-dashboard/user-dashboard.module`).then(
        (m) => m.UserDashboardModule
      ),
  },
  {
    path: 'wishlist',
    loadChildren: () =>
      import(`../modules/wishlist/wishlist.module`).then(
        (m) => m.WishlistModule
      ),
  },
  {
    path: 'faq',
    loadChildren: () =>
      import(`../modules/faq/faq.module`).then((m) => m.FaqModule),
  },
  {
    path: 'destination/:name',
    loadChildren: () =>
      import(`../modules/tour-details/tour-details.module`).then((m) => m.TourDetailsModule),
  },
  {
    path: 'app-download',
    loadChildren: () =>
      import(`../modules/download-app/download-app.module`).then(
        (m) => m.DownloadAppModule
      ),
  },
  {
    path: 'new-password',
    component: NewPasswordComponent,
  },
  // {
  //   path: 'robots.txt',
  //   canActivate: [RobotsTxtGuard], // استخدام الـ Guard هنا
  // },

   { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class HomeRoutingModule {}
