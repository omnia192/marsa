import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPrivacyComponent } from '../privacy/landing-privacy/landing-privacy.component';
import { PrivacyPolicyComponentComponent } from './privacy-policy-component/privacy-policy-component.component';

const routes: Routes = [
/* {path:'',component:LandingPrivacyComponent,children:[
    {path:'',redirectTo:'privacy',pathMatch:'full'},
    {path:'privacy',component: PrivacyPolicyComponentComponent}
  ]}*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacyPolicyRoutingModule { }
