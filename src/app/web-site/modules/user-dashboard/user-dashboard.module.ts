import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { LandingUserDashboardComponent } from './landing-user-dashboard/landing-user-dashboard.component';
import { UserProfileComponent } from './page-components/user-profile/user-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    LandingUserDashboardComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
    SharedModule
  ]
})
export class UserDashboardModule { }
