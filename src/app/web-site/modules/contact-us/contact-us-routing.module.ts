import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingContactUsComponent } from './landing-contact-us/landing-contact-us.component';
import { ContactComponent } from './components/contact/contact.component';

const routes: Routes = [
  {
    path: '', component: LandingContactUsComponent,
    children: [
      { path: '', redirectTo: "", pathMatch: 'full' },
      //here your components on folder components
      { path: '', component: ContactComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactUsRoutingModule { }
