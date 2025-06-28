import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveboardRoutingModule } from './liveboard-routing.module';
import { LandingLiveboardComponent } from '../liveboard/landing-liveboard/landing-liveboard.component';
import { LiveboardsComponent } from './components/liveboards/liveboards.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivityFilterComponent } from './components/activity-filter/activity-filter.component';
import { LiveboardDetailsComponent } from './components/liveboard-details/liveboard-details.component';
import { LiveboardPaymentComponent } from './components/liveboard-payment/liveboard-payment.component';
import { ConfirmPaymentLiveabourdComponent } from './components/confirm-payment-liveabourd/confirm-payment-liveabourd.component';
import { MatSliderModule } from '@angular/material/slider';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    LandingLiveboardComponent,
    LiveboardsComponent,
    ActivityFilterComponent,
    LiveboardDetailsComponent,
    LiveboardPaymentComponent,
    ConfirmPaymentLiveabourdComponent,
  ],
  imports: [
    CommonModule,
    LiveboardRoutingModule,
    SharedModule,
    MatSliderModule,
    GalleriaModule,
    ImageModule,
    PaginatorModule,
    DropdownModule
  ],
})
export class LiveboardModule {}
