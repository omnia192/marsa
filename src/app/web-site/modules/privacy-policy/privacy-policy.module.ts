import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PrivacyPolicyComponentComponent } from './privacy-policy-component/privacy-policy-component.component';


@NgModule({
  declarations: [
    LandingPageComponent,
    PrivacyPolicyComponentComponent
  ],
  imports: [
    CommonModule,
    PrivacyPolicyRoutingModule
  ]
})
export class PrivacyPolicyModule { }
