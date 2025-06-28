import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingBookingComponent } from './landing-booking/landing-booking.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';

const routes: Routes = [
  {
    path: '', component: LandingBookingComponent,
    children: [
      { path: '', redirectTo: "booking", pathMatch: 'full' },
      //here your components on folder components
      { path: 'booking', component: BookingPageComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
