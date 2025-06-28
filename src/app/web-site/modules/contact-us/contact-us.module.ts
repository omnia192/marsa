import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactUsRoutingModule } from './contact-us-routing.module';
import { LandingContactUsComponent } from './landing-contact-us/landing-contact-us.component';
import { ContactComponent } from './components/contact/contact.component';


@NgModule({
  declarations: [
    LandingContactUsComponent,
    ContactComponent,

  ],
  imports: [
    CommonModule,
    ContactUsRoutingModule,
    SharedModule
  ]
})
export class ContactUsModule { }
