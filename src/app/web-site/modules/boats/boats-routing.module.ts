import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingBoatsComponent } from './landing-boats/landing-boats.component';
import { BoatComponent } from './components/boat/boat.component';
import { BoatDetailsComponent } from './components/boat-details/boat-details.component';
import { PaymentBoatsComponent } from './components/payment-boats/payment-boats.component';
import { ConfirmationBoatComponent } from './components/confirmation-boat/confirmation-boat.component';

const routes: Routes = [
  {
    path: '', component: LandingBoatsComponent,
    children: [
      { path: '', redirectTo: "allBoats", pathMatch: 'full' },
      {path:'allBoats',component:BoatComponent},
      {path:'payment',component:PaymentBoatsComponent},
      {path:'details/:id/:name',component:BoatDetailsComponent},
      {path:':id/:slug',component:BoatDetailsComponent},
      { path: 'confirm', component: ConfirmationBoatComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class BoatsRoutingModule { }
