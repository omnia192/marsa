import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingToursComponent } from './landing-tours/landing-tours.component';
import { ToursComponent } from './components/tours/tours.component';
import { ToursDetailsComponent } from './components/tours-details/tours-details.component';
import { CheckAvailpiltyComponent } from './components/check-availpilty/check-availpilty.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ConfirmPaymentComponent } from './components/confirm-payment/confirm-payment.component';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: LandingToursComponent,
    children: [
      { path: '', redirectTo: 'allTours', pathMatch: 'full' },
      { path: 'allTours', component: ToursComponent },
      { path: 'details/:id/:name', component: ToursDetailsComponent },
      { path: 'check', component: CheckAvailpiltyComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'confirm', component: ConfirmPaymentComponent },
      { path: ':id/:slug', component: ToursDetailsComponent },
      // { path: '**', component: NotFoundComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToursRoutingModule {}
