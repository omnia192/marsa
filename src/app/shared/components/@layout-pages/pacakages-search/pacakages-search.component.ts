import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { PackageSliderModalComponent } from 'src/app/shared/sliders/package-slider-modal/package-slider-modal.component';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-pacakages-search',
  templateUrl: './pacakages-search.component.html',
  styleUrls: ['./pacakages-search.component.scss']
})
export class PacakagesSearchComponent implements OnInit {
  packages: any = [];
  selectedTabId: number = 0; 
  showAll: boolean = false;

  showAllTrips() {
    this.showAll = true;
  }
  constructor(
    private httpService: HttpService,
    public translate: TranslateService,
    private dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.httpService.get(environment.marsa, 'package').subscribe({
      next: (res: any) => {
        this.packages = res.Packeges;

      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  selectTab(index: number) {
    this.selectedTabId = index;
  }
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }

  openPackModal(packageId: number) {
    const selectedPackage = this.packages.find((pkg: any) => pkg.id === packageId);
    const dialogRef = this.dialog.open(PackageSliderModalComponent, {
      width: '60%',
    });
    dialogRef.componentInstance.packages = selectedPackage ? selectedPackage.Trips : [];
  }



}
