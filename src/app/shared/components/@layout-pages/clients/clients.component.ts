import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    center: false,
    dots: true,
    margin:60,
     autoplay: false,
    navSpeed: 700,
    // navText: [],
    responsive: {
      0: {
        items: 1,
        margin:20,
      },
      740: {
        items: 1,
        margin:20,
      },
      940: {
        items:3,
        margin:20,
      },
      1200: {
        items: 3
      }
    },
    nav: false
  }
  data: any;
  constructor( private _HttpService: HttpService,
    public translate: TranslateService)
{}
ngOnInit(): void {
  this._HttpService.get(environment.marsa, 'Aboutus').subscribe({
    next: (response: any) => {
      // تحميل مسبق للصور
      if (response?.SocialReview && response.SocialReview.length > 0) {
        response.SocialReview.forEach((item: any) => {
          if (item.Reviwe) {
            const img = new Image();
            img.src = item.Reviwe;
          }
        });
      }

      this.data = response;
    },
    error: (err) => {
      console.error('Error fetching data', err);
    }
  });
}
adjustImageSize(event: any) {
  const img = event.target;
  const container = img.parentElement;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // Get natural image dimensions
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  // Remove all classes first
  img.classList.remove('img-fill', 'img-contain', 'img-stretch');

  // If image is too small (both dimensions smaller than container)
  if (imgWidth < containerWidth && imgHeight < containerHeight) {
    // Small images will be stretched to fill the container
    img.classList.add('img-stretch');
  }
  // If image is too large in either dimension
  else if (imgWidth > containerWidth || imgHeight > containerHeight) {
    // Large images will be contained to show the entire image
    img.classList.add('img-contain');
  }
  // Otherwise use cover
  else {
    img.classList.add('img-fill');
  }

  // Alternatively, you could calculate a specific scale factor
  // if you want more precise control
}

  onImgError(event: any) {
    event.target.src = 'assets/custom/user-dasboard/user.jpeg';
  }
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
}
