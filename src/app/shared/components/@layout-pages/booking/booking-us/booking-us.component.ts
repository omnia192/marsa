import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-booking-us',
  templateUrl: './booking-us.component.html',
  styleUrls: ['./booking-us.component.scss']
})
export class BookingUsComponent {
  isMobile = false;
  backgroundImageUrl: any = [];
  data:any;

  constructor( private _HttpService: HttpService,){
    if (window.screen.width < 992) {
      this.isMobile = true;
    }
}
ngOnInit(): void {

  this.getAbout();
}
getAbout() {

  this._HttpService.get(environment.marsa, 'Aboutus').subscribe({
    next: (response: any) => {
      this.data = response;
    },
  });
}
  aboutOptions: OwlOptions = {
     loop: true,
     mouseDrag: true,
     touchDrag: true,
     pullDrag: true,
     dots: true,
     margin: 10,
     autoplay: false,
     navSpeed: 700,
     navText: [
       "<i class='fa fa-angle-left'></i>",
       "<i class='fa fa-angle-right'></i>",
     ],
     responsive: {
       0: {
         items: 1,
         center: true,
       },
       400: {
         items: 1,
         center: true,
       },
       740: {
         items: 4,
       },
       940: {
         items: 4,
       },
       1200: {
         items: 4,
       },
     },
     nav: false,
   };
   getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
}
