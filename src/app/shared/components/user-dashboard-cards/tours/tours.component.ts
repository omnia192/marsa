import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { ProfileService } from 'src/app/core/services/http/profile-service.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss'],
})
export class ToursComponent {
  @Input() tours: any;
  @Input() types: any;
  activityTypes: any = [];
  filteredTours: any = [];
  activeSection = 'all'; // Initialize with a default value

  profiles: any[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;


  loadProfiles(page: number): void {
   
    this ._httpsService.get(environment.marsa, 'profile', { page }).subscribe({
      next: (data: any)  => {
      this.profiles = data.userDashboard.data;
      this.tours = data.userDashboard.ActivityDetails.data; // Ensure this is correct
      this.currentPage = data.userDashboard.ActivityDetails.current_page;
      this.lastPage = data.userDashboard.ActivityDetails.last_page;
      this.total = data.userDashboard.ActivityDetails.total;
      console.log(this.tours);
      console.log(this.currentPage);
      this.cdr.markForCheck();
      },
    });
  }

  nextPage(): void {
    if (this.currentPage < this.lastPage) {
      this.loadProfiles(this.currentPage + 1);
      console.log(this.tours);
      console.log(this.currentPage);
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
    private _httpsService: HttpService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProfiles(this.currentPage);
  }


  ngOnChanges() {
    this.activityTypes = this.types[0].types;
  }

  setActiveSection(section: string) {
    this.activeSection = section;

    if (this.activeSection !== 'all') {
      this.filteredTours = this.tours.filter((item: any) => item.tripTypeid === section);
    } else {
      this.filteredTours = [...this.tours];
    }

    this.cdr.detectChanges();
  }


}
