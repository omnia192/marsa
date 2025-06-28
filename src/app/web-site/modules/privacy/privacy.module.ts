import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyRoutingModule } from './privacy-routing.module';
import { LandingPrivacyComponent } from './landing-privacy/landing-privacy.component';
import { PrivacyComponentComponent } from './privacy-component/privacy-component.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    LandingPrivacyComponent,
    PrivacyComponentComponent
  ],
  imports: [
    CommonModule,
    PrivacyRoutingModule,
    SharedModule
  ]
})
export class PrivacyModule { }
