import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaindetailComponent } from './maindetail/maindetail.component';
import { AllTicketsComponent } from './all-tickets/all-tickets.component';

const routes: Routes = [

  {path:'',component:MaindetailComponent},

{path:'all-tickets',component:AllTicketsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourDetailsRoutingModule { }
