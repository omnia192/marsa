import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUsRoutingModule } from './about-us-routing.module';
import { LandingAboutUsComponent } from './landing-about-us/landing-about-us.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
@NgModule({
  declarations: [
    LandingAboutUsComponent,
    AboutUsComponent
  ],
  imports: [
    CommonModule,
    AboutUsRoutingModule,
    SharedModule,
    ButtonModule,
    DialogModule
  ]
})
export class AboutUsModule { }
