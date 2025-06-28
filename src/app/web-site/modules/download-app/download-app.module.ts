import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadAppRoutingModule } from './download-app-routing.module';
import { DownloadLandingComponent } from './download-landing/download-landing.component';
import { DownloadPageComponent } from './components/download-page/download-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    DownloadLandingComponent,
    DownloadPageComponent
  ],
  imports: [
    CommonModule,
    DownloadAppRoutingModule,
    SharedModule
  ]
})
export class DownloadAppModule { }
