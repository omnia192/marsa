import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BoatsRoutingModule } from './boats-routing.module';
import { LandingBoatsComponent } from './landing-boats/landing-boats.component';
import { BoatComponent } from './components/boat/boat.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterBoatsComponent } from './components/filter-boats/filter-boats.component';
import { BoatDetailsComponent } from './components/boat-details/boat-details.component';
import { PaymentBoatsComponent } from './components/payment-boats/payment-boats.component';
import { ConfirmationBoatComponent } from './components/confirmation-boat/confirmation-boat.component';
import { MatSliderModule } from '@angular/material/slider';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    LandingBoatsComponent,
    BoatComponent,
    FilterBoatsComponent,
    BoatDetailsComponent,
    PaymentBoatsComponent,
    ConfirmationBoatComponent,
  ],
  imports: [
    CommonModule,
    BoatsRoutingModule,
    SharedModule,
    MatSliderModule,
    GalleriaModule,
    ImageModule,
    PaginatorModule,
    CalendarModule
  ],
  providers: [DatePipe],
})
export class BoatsModule {}
