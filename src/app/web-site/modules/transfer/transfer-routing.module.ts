import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingTransferComponent } from './landing-transfer/landing-transfer.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { MultiStepComponent } from './components/multi-step/multi-step.component';
import { StepFourComponent } from 'src/app/shared/components/@layout-pages/transfer-multi-step-form/step-four/step-four.component';

const routes: Routes = [
  {
    path: '', component: LandingTransferComponent,
    children: [
      { path: '', redirectTo: "allTransfers", pathMatch: 'full' },
      //here your components on folder components
      { path: 'allTransfers', component: TransferComponent},
      { path: 'multi-step', component: MultiStepComponent},
      { path: 'confirm', component: StepFourComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRoutingModule { }
