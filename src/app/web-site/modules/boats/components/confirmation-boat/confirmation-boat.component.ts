import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-confirmation-boat',
  templateUrl: './confirmation-boat.component.html',
  styleUrls: ['./confirmation-boat.component.scss']
})
export class ConfirmationBoatComponent {
  tripId:any;
  confirmRequest: any;
  relatedtrips: any[] = [];
  showRelated : boolean = false;
  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute,
  )
  {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      const res = JSON.parse(params['res']);
      this.confirmRequest = res;
      this.tripId = params['trip_id'];

      this.getBoatById(this.tripId)
    })
  }
  getBoatById(BoatID: any) {
    this._httpService
      .get(
        environment.marsa,
        `Boats/details/` + BoatID
      )
      .subscribe((res: any) => {
        if(res?.relatedtrips?.data) {
          this.showRelated = true;
          this.relatedtrips = res?.relatedtrips.data;
        }

      });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay:true,
    margin:10,
    navSpeed: 700,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      740: {
        items: 4
      },
      940: {
        items: 4
      },
      1200: {
        items: 4
      }
    },
    nav: true
  }
}
