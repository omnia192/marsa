import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-landing-user-dashboard',
  templateUrl: './landing-user-dashboard.component.html',
  styleUrls: ['./landing-user-dashboard.component.scss']
})
export class LandingUserDashboardComponent {
constructor( private titleService: Title,
){}
ngOnInit(): void {
  this.titleService.setTitle('Your profile');
}
}
