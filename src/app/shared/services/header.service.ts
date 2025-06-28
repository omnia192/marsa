import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private toggleDropdownSubject = new Subject<void>();

  // Observable to subscribe to for toggling dropdown
  toggleDropdown$ = this.toggleDropdownSubject.asObservable();

  // Method to trigger toggleDropdown
  toggleDropdown() {
    this.toggleDropdownSubject.next();
  }
}
