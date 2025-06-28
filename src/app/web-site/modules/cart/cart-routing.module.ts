import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingCartComponent } from './landing-cart/landing-cart.component';

const routes: Routes = [
  {
    path: '', component: LandingCartComponent,
    children: [
      { path: '', redirectTo: "allCarts", pathMatch: 'full' },
      //here your components on folder components
      // { path: 'yourPath', component: //your-component},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
