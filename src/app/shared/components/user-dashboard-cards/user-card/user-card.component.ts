import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { ProfileService } from './profile-service.service';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
  userDetails: any;
  types: any;
  tabs = [
    { label: 'Overview', section: 'section1' },
    { label: 'Tours & Activities', section: 'section2' },
    { label: 'Liveaboards', section: 'section3' },
    { label: 'Packages', section: 'section4' },
    { label: 'Transfers', section: 'transports' },
  ];

  activeSection = 'section1'; // Initialize with a default value

  profiles: any[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;

  // constructor(private profileService: ProfileService) {}
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
  loadProfiles(page: number): void {
    this.profileService.getProfiles(page).subscribe((data) => {
      this.userDetails = data?.userDashboard;
      this.profiles = data.userDashboard.data;
      this.currentPage = data.userDashboard.current_page;
      this.lastPage = data.userDashboard.last_page;
      this.total = data.userDashboard.total;
    });
  }

  nextPage(): void {
    if (this.currentPage < this.lastPage) {
      this.loadProfiles(this.currentPage + 1);
    }
  }

  prevPage(): void {

    if (this.currentPage > 1) {
      this.loadProfiles(this.currentPage - 1);
    }
  }

  constructor(
    private httpService: HttpService,
    private profileService: ProfileService,
    private AuthService: AuthService
  ) {}
  setActiveSection(section: string) {
    console.log('Setting active section to:', section);
    this.activeSection = section;
  }

  ngOnInit() {
    this.AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      if (isAuth) {
        this.fetchProfileInformation();
      }
    });
  }

  private fetchProfileInformation(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.httpService.get(environment.marsa, 'profile').subscribe((res: any) => {
        console.log('Profile information received:', res);
        this.userDetails = res?.userDashboard;
        this.types = res?.triptypes;
        console.log('Types set to:', this.types);
      }, (error) => {
        console.error('Error fetching profile information:', error);
      });
    }
  }
}
