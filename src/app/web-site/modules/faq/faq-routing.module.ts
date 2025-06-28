import { AllFaqComponent } from './components/all-faq/all-faq.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingFaqComponent } from './landing-faq/landing-faq/landing-faq.component';
import { FaqComponent } from './components/faq/faq.component';

const routes: Routes = [
  {
    path: '', component: LandingFaqComponent,
    children: [
      { path: '', redirectTo: "", pathMatch: 'full' },
      { path: '', component: AllFaqComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule {
  
 }
