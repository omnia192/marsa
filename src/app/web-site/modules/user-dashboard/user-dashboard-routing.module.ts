import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingUserDashboardComponent } from './landing-user-dashboard/landing-user-dashboard.component';
import { UserProfileComponent } from './page-components/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '', component: LandingUserDashboardComponent,
    children: [
      { path: '', redirectTo: "userDashboard", pathMatch: 'full' },
      { path: 'userDashboard', component: UserProfileComponent },
      // Add more routes for other components if needed
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDashboardRoutingModule { }
