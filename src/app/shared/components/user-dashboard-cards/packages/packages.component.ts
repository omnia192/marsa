import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ProfileService } from 'src/app/core/services/http/profile-service.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
})
export class PackagesComponent {
  @Input() packages: any;
  activeTab: string = 'year';
  thisYear: any;
  filterdPackages: any = [];
  profiles: any[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;
  selectedpackage:any;
  loadProfiles(page: number): void {
    this.profileService.getProfiles(page).subscribe((data: any) => {
      this.profiles = data.userDashboard.data;
      this.packages = data.userDashboard.packageDetails.data; // Ensure this is correct
      this.filterdPackages = this.packages;
      this.currentPage = data.userDashboard.packageDetails.current_page;
      this.lastPage = data.userDashboard.packageDetails.last_page;
      this.total = data.userDashboard.packageDetails.total;
      this.cdr.markForCheck();
    });
  }

  nextPage(): void {
    if (this.currentPage < this.lastPage) {
      this.loadProfiles(this.currentPage + 1);
    }
  }
  openModal(packagee: any) {
    this.selectedpackage = packagee;

  }


  prevPage(): void {

    if (this.currentPage > 1) {
      this.loadProfiles(this.currentPage - 1);
    }
  }

  constructor(
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges() {
  }

  ngOnInit() {
    this.loadProfiles(this.currentPage);
    this.filterdPackages = this.packages;
    this.thisYear = new Date().getFullYear();
  }

  setFilter(interval: string) {
    // Implement your logic to filter the table based on the selected interval
    this.activeTab = interval;
    if (interval == 'year') {
      this.filterdPackages = this.packages?.filter((item: any) => {
        return item.time.substr(0, 4) == this.thisYear.toString();
      });
    } else {
      this.filterdPackages = this.packages?.filter((item: any) => {
        return item.time.substr(0, 4) == interval.toString();
      });
    }
  }
}
