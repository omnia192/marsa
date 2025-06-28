import { Component, OnInit } from '@angular/core';
import { ConnectivityService } from '../connectivity.service';

@Component({
  selector: 'app-connectivity-notification',
  templateUrl: './connectivity-notification.component.html',
  styleUrls: ['./connectivity-notification.component.scss']
})
export class ConnectivityNotificationComponent implements OnInit {
  isOnline: boolean = true;

  constructor(private connectivityService: ConnectivityService) {}

  ngOnInit() {
    this.connectivityService.onlineStatus$.subscribe(status => {
      this.isOnline = status;
    });
  }
}