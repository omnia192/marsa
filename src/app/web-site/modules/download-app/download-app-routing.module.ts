import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadLandingComponent } from './download-landing/download-landing.component';
import { DownloadPageComponent } from './components/download-page/download-page.component';

const routes: Routes = [
  {
    path: '', component: DownloadLandingComponent,
    children: [
      { path: '', redirectTo: "app-download", pathMatch: 'full' },
      { path: 'app-download', component: DownloadPageComponent},
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadAppRoutingModule { }
