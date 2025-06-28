import { Component, Inject, Input , AfterViewInit, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-boat-slider-modal',
  templateUrl: './boat-slider-modal.component.html',
  styleUrls: ['./boat-slider-modal.component.scss'],
})
export class BoatSliderModalComponent {
  @Input() images: any[] = [];
  displayBasic: boolean = true;
  responsiveOptions: any[] = [
    {
        breakpoint: '1500px',
        numVisible: 5
    },
    {
        breakpoint: '1024px',
        numVisible: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];
  imagesOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
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
  constructor(
    public dialogRef: MatDialogRef<BoatSliderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public imageData: any,
    private renderer: Renderer2  ) {}

  closeModal(): void {
    this.dialogRef.close(); // Close the modal
  }
  ngAfterViewInit() {
    const closeButton = document.querySelector('.p-ripple.p-element.p-galleria-close.p-link.ng-star-inserted');

    if (closeButton) {
      this.renderer.listen(closeButton, 'click', () => {
        this.closeGalleria();
      });
    }
  }

  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }

  closeGalleria() {
    this.displayBasic = false; // This correctly sets displayBasic to false
  }

}
