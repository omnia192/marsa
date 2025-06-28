import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { PackageSliderModalComponent } from 'src/app/shared/sliders/package-slider-modal/package-slider-modal.component';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-package-edit',
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.scss'],
})
export class PackageEditComponent implements OnInit {
  isSmallScreen = window.innerWidth <= 768;
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isSmallScreen = window.innerWidth <= 768;
  }
  

  activeSection = 'section1';

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  packages: any = [];
  selectedTabId: number = 0;
  showAll: boolean = false;

  showAllTrips() {
    this.showAll = true;
  }

  constructor(
    private httpService: HttpService,
    public translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.httpService.get(environment.marsa, 'package').subscribe({
      next: (res: any) => {
        this.packages = res.packages;
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      },
    });
  }

  selectTab(index: number) {
    this.selectedTabId = index;
  }

  openPackModal(packageId: number) {
    const selectedPackage = this.packages.find(
      (pkg: any) => pkg.id === packageId
    );
    const dialogRef = this.dialog.open(PackageSliderModalComponent, {
      width: '60%',
    });
    dialogRef.componentInstance.packages = selectedPackage
      ? selectedPackage.Trips
      : [];
  }
}


