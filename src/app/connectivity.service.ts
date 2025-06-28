import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ConnectivityService {
  private onlineStatus = new BehaviorSubject<boolean>(true);
  onlineStatus$ = this.onlineStatus.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize with browser's online status
      this.setOnlineStatus(navigator.onLine);
      
      // Add event listeners only in browser environment
      window.addEventListener('online', () => this.setOnlineStatus(true));
      window.addEventListener('offline', () => this.setOnlineStatus(false));
    }
  }

  private setOnlineStatus(isOnline: boolean) {
    this.onlineStatus.next(isOnline);
  }
}