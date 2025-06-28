import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishlistRoutingModule } from './wishlist-routing.module';
import { LandingWishlistComponent } from './landing-wishlist/landing-wishlist.component';
import { WishlistPageComponent } from './wishlist-page/wishlist-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WishlistSingleComponent } from './wishlist-single/wishlist-single.component';

@NgModule({
  declarations: [
    LandingWishlistComponent,
    WishlistPageComponent,
    WishlistSingleComponent
  ],
  imports: [
    CommonModule,
    WishlistRoutingModule,
    SharedModule
  ]
})
export class WishlistModule { }
