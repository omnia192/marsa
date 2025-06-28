import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/core/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private httpService: HttpService, 
    private authService: AuthService,
    private router: Router
  ) {}

  getProfiles(page: number): Observable<any> {
    console.log('Fetching profiles with page:', page);
    
    // Use the HttpService which already handles token inclusion
    return this.httpService.get(environment.marsa, `profile?page=${page}`).pipe(
      catchError(error => {
        console.error('Error fetching profile data:', error);
        if (error.status === 401) {
          // Token might be invalid or expired
          console.log('Unauthorized access - logging out user');
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
        return of({ 
          userDashboard: { 
            data: [],
            ActivityDetails: { data: [], current_page: 1, last_page: 1, total: 0 },
            transferDetails: { data: [], current_page: 1, last_page: 1, total: 0 },
            packageDetails: { data: [], current_page: 1, last_page: 1, total: 0 },
            liveboardDetails: { data: [], current_page: 1, last_page: 1, total: 0 }
          } 
        });
      })
    );
  }
}
