import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-cabin-info-modal',
  templateUrl: './cabin-info-modal.component.html',
  styleUrls: ['./cabin-info-modal.component.scss'],
})
export class CabinInfoModalComponent {
  @Input() images: string[] = [];
  @Input() data: any;

  constructor(
    public dialogRef: MatDialogRef<CabinInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public imageData: any
  ) {}

  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
  closeModal(): void {
    this.dialogRef.close(); // Close the modal
  }
  imagesOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    margin: 25,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      720: {
        items: 1,
      },
      1200: {
        items: 1,
      },
    },
    nav: true,
  };
}
