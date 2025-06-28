import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSiteRoutingModule } from './web-site-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SharedModule } from '../shared/shared.module';
import { MatSliderModule } from '@angular/material/slider'; // Import MatSliderModule
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    LayoutComponent,

  ],
  imports: [
    CommonModule,
    WebSiteRoutingModule,
    SharedModule,
    MatSliderModule,
    MatButtonModule, // Optional

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebSiteModule { }
