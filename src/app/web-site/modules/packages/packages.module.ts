import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PackagesRoutingModule } from './packages-routing.module';
import { LandingPackagesComponent } from './landing-packages/landing-packages.component';
import { AllPackagesComponent } from './components/all-packages/all-packages.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PackageDetailsComponent } from './components/package-details/package-details.component';
import { PackagePaymentComponent } from './components/package-payment/package-payment.component';
import { PackageConfirmComponent } from './components/package-confirm/package-confirm.component';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';


@NgModule({
  declarations: [
    LandingPackagesComponent,
    AllPackagesComponent,
    PackageDetailsComponent,
    PackagePaymentComponent,
    PackageConfirmComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    PackagesRoutingModule,
    SharedModule,
      CalendarModule,
  ],
  providers:[DatePipe ]
})
export class PackagesModule { }
