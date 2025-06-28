import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingLiveboardComponent } from './landing-liveboard/landing-liveboard.component';
import { LiveboardsComponent } from './components/liveboards/liveboards.component';
import { LiveboardDetailsComponent } from './components/liveboard-details/liveboard-details.component';
import { LiveboardPaymentComponent } from './components/liveboard-payment/liveboard-payment.component';
import { ConfirmPaymentLiveabourdComponent } from './components/confirm-payment-liveabourd/confirm-payment-liveabourd.component';

const routes: Routes = [
  {
    path: '', component: LandingLiveboardComponent,
    children: [
      { path: '', redirectTo: "allLiveboards", pathMatch: 'full' },
      //here your components on folder components
      { path: 'allLiveboards', component: LiveboardsComponent},
      {path:'liveboardDetails/:id/:name',component:LiveboardDetailsComponent},
      {path:'liveboard-payment',component:LiveboardPaymentComponent},
      { path: 'confirm', component: ConfirmPaymentLiveabourdComponent},
      {path:':id/:slug',component:LiveboardDetailsComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class LiveboardRoutingModule { }
