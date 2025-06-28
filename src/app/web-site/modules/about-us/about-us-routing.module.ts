import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingAboutUsComponent } from './landing-about-us/landing-about-us.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

const routes: Routes = [
  {
    path: '', component: LandingAboutUsComponent,
    children: [
      { path: '', redirectTo: "", pathMatch: 'full' },
      {path:'',component:AboutUsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class AboutUsRoutingModule { }
