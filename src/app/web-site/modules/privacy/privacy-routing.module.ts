import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPrivacyComponent } from './landing-privacy/landing-privacy.component';
import { PrivacyComponentComponent } from './privacy-component/privacy-component.component';

const routes: Routes = [
  {
    path: '', component: LandingPrivacyComponent,
    children: [
      { path: '', redirectTo: "privacy", pathMatch: 'full' },
      //here your components on folder components
       { path: 'privacy', component: PrivacyComponentComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacyRoutingModule { }
