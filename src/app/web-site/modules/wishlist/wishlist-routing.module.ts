import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingWishlistComponent } from './landing-wishlist/landing-wishlist.component';
import { WishlistPageComponent } from './wishlist-page/wishlist-page.component';
import { WishlistSingleComponent } from './wishlist-single/wishlist-single.component';

const routes: Routes = [
  {
    path: '', component: LandingWishlistComponent,
    children: [
      { path: '', redirectTo: 'wishlist', pathMatch: 'full' },
      { path: 'wishlist', component: WishlistPageComponent },
      {path: 'wishname', component: WishlistSingleComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WishlistRoutingModule { }
