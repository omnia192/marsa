import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { LandingFaqComponent } from './landing-faq/landing-faq/landing-faq.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FaqComponent } from './components/faq/faq.component';
import { AllFaqComponent } from './components/all-faq/all-faq.component';

@NgModule({
  declarations: [
    LandingFaqComponent,
    AllFaqComponent
  ],
  imports: [
    CommonModule,
    FaqRoutingModule,
    SharedModule,
    FaqComponent

  ]
})
export class FaqModule { }
