import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/core/services/http/profile-service.service';

@Component({
  selector: 'app-liveboard',
  templateUrl: './liveboard.component.html',
  styleUrls: ['./liveboard.component.scss'],
})
export class LiveboardComponent implements OnInit {
  activeTab: string = 'year';
  @Input() liveaboards: any;
  thisYear: number = new Date().getFullYear();
  filterdLiveAboard: any = [];
  selectedLiveAboard: any;
  profiles: any[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;
  years: { label: string; value: string }[] = [];

  constructor(
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.generateYears();
    this.activeTab = this.thisYear.toString();
    console.log('Initial activeTab:', this.activeTab);
    this.loadProfiles(this.currentPage);
  }

  loadProfiles(page: number): void {
    this.profileService.getProfiles(page).subscribe((data: any) => {
      console.log('API Response:', data);
      
      this.profiles = data.userDashboard.data;
      this.liveaboards = data.userDashboard.liveboardDetails.data;
      this.currentPage = data.userDashboard.liveboardDetails.current_page;
      this.lastPage = data.userDashboard.liveboardDetails.last_page;
      this.total = data.userDashboard.liveboardDetails.total;
      
      console.log('Liveaboards loaded:', this.liveaboards);
      console.log('Liveaboards length:', this.liveaboards?.length);
      
      // تطبيق الفلتر بعد تحميل البيانات
      this.applyFilter();
      this.cdr.markForCheck();
    }, (error) => {
      console.error('Error loading profiles:', error);
    });
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    this.years = [
      { label: 'This Year', value: currentYear.toString() },
      { label: (currentYear - 1).toString(), value: (currentYear - 1).toString() },
      { label: (currentYear - 2).toString(), value: (currentYear - 2).toString() },
      { label: (currentYear - 3).toString(), value: (currentYear - 3).toString() }
    ];
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

  openModal(liveAboard: any) {
    this.selectedLiveAboard = liveAboard;
  }

  setFilter(year: string) {
    console.log('Setting filter for year:', year);
    this.activeTab = year;
    this.applyFilter();
  }

  applyFilter() {
    if (!this.liveaboards || !Array.isArray(this.liveaboards)) {
      console.log('No liveaboards data available');
      this.filterdLiveAboard = [];
      return;
    }

    console.log('Applying filter for year:', this.activeTab);
    console.log('Total liveaboards before filter:', this.liveaboards.length);

    // إذا كان الفلتر هو "This Year" أو لم يتم تحديد فلتر، اعرض جميع البيانات
    if (!this.activeTab || this.activeTab === 'year') {
      this.filterdLiveAboard = this.liveaboards;
      console.log('Showing all liveaboards:', this.filterdLiveAboard.length);
      return;
    }

    this.filterdLiveAboard = this.liveaboards.filter((item: any) => {
      if (!item.time) {
        console.log('Item has no time:', item);
        return false;
      }
      
      const itemYear = item.time.toString().substr(0, 4);
      const matches = itemYear === this.activeTab;
      
      if (matches) {
        console.log('Match found:', item.name, 'Year:', itemYear);
      }
      
      return matches;
    });

    console.log('Active Tab:', this.activeTab);
    console.log('Total Liveaboards:', this.liveaboards?.length);
    console.log('Filtered Liveaboards:', this.filterdLiveAboard?.length);
  }
}
