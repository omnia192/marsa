import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-package-slider-modal',
  templateUrl: './package-slider-modal.component.html',
  styleUrls: ['./package-slider-modal.component.scss']
})
export class PackageSliderModalComponent {
  @Input() images: string[] = [];
  @Input() packages: any = [];

  constructor(
    public dialogRef: MatDialogRef<PackageSliderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public imageData: any,
    public translate: TranslateService

  ) {}
  closeModal(): void {
    this.dialogRef.close(); // Close the modal
  }
  imagesOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: true,
    margin: 25,
    navSpeed: 700,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1,
      },
      720: {
        items: 3,
      },
      1200: {
        items: 3,
      },
    },
    nav: true
  }
}
