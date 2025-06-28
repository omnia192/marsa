import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss'],
})
export class UpcomingComponent {
  upcoming: any = [{}, {}];
  constructor(public translatee: TranslateService,
    private httpService: HttpService) {}

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: false,
    margin: 20,
    navSpeed: 9900,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],

    responsive: {
      0: {
        items: 1,
        margin: 10,
      },
      740: {
        items: 2,
        margin: 10,
      },
      940: {
        items: 2,
        margin: 10,
      },
      1200: {
        items: 2,
      },
    },
    nav: false,
  };
  getFirstSchedule(card: any): any {
    if (!card?.Schedule || typeof card.Schedule !== 'object') {
      return null;
    }
    const scheduleArray = Object.values(card.Schedule);
    return scheduleArray.length > 0 ? scheduleArray[0] : null;
  }



  ngOnInit(): void {
    this.httpService
      .get(environment.marsa, 'upcoming')
      .subscribe((res: any) => {
        this.upcoming = res.Liveaboard;

      });
  }
}
