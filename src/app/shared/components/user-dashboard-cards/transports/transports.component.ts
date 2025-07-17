import { ChangeDetectorRef, Component } from '@angular/core';
import { ProfileService } from '../user-card/profile-service.service';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from 'src/app/core/services/http/http.service';

@Component({
  selector: 'app-transports',
  templateUrl: './transports.component.html',
  styleUrls: ['./transports.component.scss']
})
export class TransportsComponent {
  booking:any[] = [];
  years: { label: string; value: string }[] = [];

  activeTab: string = 'year';

  thisYear: number = new Date().getFullYear();
  filterdPackages: any = [];
  profiles: any[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;
  userdata:any;
  selectedtransfer:any;
  loadProfiles(page: number): void {
    this._httpsService.get(environment.marsa, 'profile', { page }).subscribe({
      next: (data: any)  => {
      this.profiles = data.userDashboard.data;
      this.userdata=data.userDashboard;
      this.booking = data.userDashboard.transferDetails.data; // Ensure this is correct
      this.filterdPackages = this.booking;
      this.currentPage = data.userDashboard.transferDetails.current_page;
      this.lastPage = data.userDashboard.transferDetails.last_page;
      this.total = data.userDashboard.transferDetails.total;
      this.cdr.markForCheck();
      }
    });
  }
  
  openModal(tour: any) {
    this.selectedtransfer = tour;

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
    private _httpsService: HttpService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges() {
  }

  ngOnInit() {
    this.loadProfiles(this.currentPage);
    this.filterdPackages = this.booking;
   
    this.generateYears();
    this.activeTab = this.thisYear.toString();
    
  } generateYears() {
    const currentYear = new Date().getFullYear();
    this.years = [
      { label: 'This Year', value: currentYear.toString() },
      { label: (currentYear - 1).toString(), value: (currentYear - 1).toString() },
      { label: (currentYear - 2).toString(), value: (currentYear - 2).toString() },
      { label: (currentYear - 3).toString(), value: (currentYear - 3).toString() }
    ];
  }



  setFilter(year: string) {
    this.activeTab = year;
    this.filterdPackages = this.booking?.filter((item: any) => {
      return item.time.substr(0, 4) === year;
    });
  }
}
