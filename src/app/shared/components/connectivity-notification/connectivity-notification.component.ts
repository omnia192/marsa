import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connectivity-notification',
  template: `
    <div *ngIf="!isOnline" class="offline-notification">
      You are currently offline. Please check your internet connection.
    </div>
  `,
  styles: [`
    .offline-notification {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background-color: #f44336;
      color: white;
      text-align: center;
      padding: 10px;
      z-index: 9999;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class ConnectivityNotificationComponent implements OnInit {
  isOnline: boolean = true;

  constructor() {
    this.updateOnlineStatus();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.updateOnlineStatus());
      window.addEventListener('offline', () => this.updateOnlineStatus());
    }
  }

  ngOnInit(): void {}

  private updateOnlineStatus(): void {
    if (typeof window !== 'undefined') {
      this.isOnline = window.navigator.onLine;
    }
  }
} 