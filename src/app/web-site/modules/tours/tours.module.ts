import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToursRoutingModule } from './tours-routing.module';
import { LandingToursComponent } from './landing-tours/landing-tours.component';
import { ToursComponent } from './components/tours/tours.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToursDetailsComponent } from './components/tours-details/tours-details.component';
import { CheckAvailpiltyComponent } from './components/check-availpilty/check-availpilty.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ConfirmPaymentComponent } from './components/confirm-payment/confirm-payment.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
@NgModule({
  declarations: [
    LandingToursComponent,
    ToursComponent,
    ToursDetailsComponent,
    CheckAvailpiltyComponent,
    PaymentComponent,
    ConfirmPaymentComponent,
  ],
  imports: [
    CommonModule,
    ToursRoutingModule,
    SharedModule,
    CalendarModule,
    MatDialogModule,
    MatSliderModule,
    GalleriaModule,
    ImageModule,
    PaginatorModule
  ],
  exports: [],
  providers: [DatePipe],
})
export class ToursModule {}
