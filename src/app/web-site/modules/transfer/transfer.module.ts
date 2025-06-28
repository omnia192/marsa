import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TransferRoutingModule } from './transfer-routing.module';
import { LandingTransferComponent } from './landing-transfer/landing-transfer.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MultiStepComponent } from './components/multi-step/multi-step.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    LandingTransferComponent,
    TransferComponent,
    MultiStepComponent
  ],
  imports: [
    CommonModule,
    TransferRoutingModule,
    SharedModule,
    MatDialogModule,
    NgxMaterialTimepickerModule,
    CalendarModule,
  ],
  providers: [DatePipe],

})
export class TransferModule { }
