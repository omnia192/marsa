import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { Meta, Title } from '@angular/platform-browser';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-maindetail',
  templateUrl: './maindetail.component.html',
  styleUrls: ['./maindetail.component.scss']
})
export class MaindetailComponent implements OnInit {
  selectedSightId:any;
  tourid: any;
  placeDetails: any;
  TypeTrip: any = null;
  questions: any = [];
  allTripsFiltered: any = [];
  FilterTimeid: any = [];
  FilterDurationid: any = [];
  AllActivities: any = [];
  selectedSight: any;
  route = '/' + this.translate.currentLang + '/tours/details/';
  screenWidth: number;
   typetrips:any;
   loading: boolean = false;
   carouselItems: any[] = [];
   visibleTrips: any[] = [];
   tripsPerRow: number = 4;
   rowsToShow: number = 1;
   showFullText: boolean = false;

   selectedTrip: number | null = null;
   selectedTripType: any = null;

   hiddenTrips: any[] = [];
   totalTripsCount: number = 0;
   isMobile: boolean = false;
   custom: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1

    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3 // Add this line
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2 // Add this line
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1 // Add this line
    }
  ];
  carouselCurrentIndex = 0;
  @ViewChild('owlCarousel') owlCarousel: CarouselComponent | undefined;

  mobileCarouselOptions: OwlOptions = {
    loop: false,
    margin: 10,
    dots: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: false,
    navSpeed: 700,
    nav: true,
    navText: [
      "<div class='nav-button nav-left'><i class='fas fa-chevron-left'></i></div>",
      "<div class='nav-button nav-right'><i class='fas fa-chevron-right'></i></div>"
    ],
    responsive: {
      0: {
        items: 1
      }
    },
    autoHeight: false,
    autoWidth: false
  };







  constructor(
    private rout: ActivatedRoute,
    private router:Router,
    private httpService: HttpService,
    public translate: TranslateService,
    private titleService: Title,
    private metaService: Meta,
  ) {
    this.screenWidth = window.innerWidth;

  }


toggleText() {
  this.showFullText = !this.showFullText;
}
  ngOnInit() {


      this.tourid = localStorage.getItem('destinationId');
    this.httpService.get(environment.marsa, 'place/details/' + this.tourid).subscribe((res: any) => {
        this.placeDetails = res;

        // Set the first sight as the selected one
        if (this.placeDetails?.places?.placesshigts && this.placeDetails.places.placesshigts.length > 0) {
          this.selectedSight = this.placeDetails.places.placesshigts[0];
          this.selectedSightId = this.selectedSight.id;
        }

        this.typetrips = res.typeTrip;

        // Filter trips based on totalTripsCount
        if (this.typetrips && this.typetrips.length > 0) {
          this.typetrips = this.typetrips.filter((trip: any) => trip.trip.length > 0);
          const firstTrip = this.typetrips[0];
          this.selectTrip(firstTrip.id);

          // Set the first trip as selected
          this.selectedTrip = firstTrip.id;
          this.selectedTripType = firstTrip;
          this.totalTripsCount = firstTrip.trip.length;
          this.visibleTrips = firstTrip.trip.slice(0, this.tripsPerRow);
          this.hiddenTrips = firstTrip.trip.slice(this.tripsPerRow);
        }

        this.AllActivities = this.placeDetails?.alltrips;
        this.allTripsFiltered = this.placeDetails.alltrips.filter(
          (item: any) => item.place === this.placeDetails.places.name
        );
        this.titleService.setTitle(this.placeDetails.places.name);


      });

      this.checkScreenWidth();

    }
    manualSelectionActive = false;

    onCarouselTranslated(event: any) {
      this.carouselCurrentIndex = event.startPosition;
      
      if (this.isMobile && this.placeDetails?.places?.placesshigts && this.placeDetails.places.placesshigts.length > 0) {
        const activeSightIndex = this.carouselCurrentIndex;

        if (activeSightIndex >= 0 && activeSightIndex < this.placeDetails.places.placesshigts.length) {
          const sight = this.placeDetails.places.placesshigts[activeSightIndex];
          this.selectedSight = sight;
          this.selectedSightId = sight.id;
        }
      }
    }
    onSightHoverExit(){

    }

    carouselOptions: OwlOptions = {
      loop: false,
      margin: 20, // Increase margin between items
      dots: false,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      autoplay: false,
      navSpeed: 900,
      nav: true,
      navText: [
        "<div class='nav-button nav-left'><i class='fas fa-chevron-left'></i></div>",
        "<div class='nav-button nav-right'><i class='fas fa-chevron-right'></i></div>"
      ],
      responsive: {
        0: {
          items: 1,
          stagePadding: 0
        },
        600: {
          items: 2,
          stagePadding: 0
        },
        1000: {
          items: 3,
          stagePadding: 0
        }
      },
      autoHeight: true,
      autoWidth: false,
      rewind: false, // Prevent rewinding to first slide
      smartSpeed: 500, // Smooth transition
      // fluidSpeed: 500,
      dragEndSpeed: 500
    };
  isFewItems(): boolean {
    return this.placeDetails?.places?.placesshigts?.length < 3;
  }

    getImageName(url: string): string {
      const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
      return imageName || 'Unknown photo';
    }


    toggleSeeMore(rec: any) {
      rec.seeMore = !rec.seeMore;

    }

    onMobileCarouselTranslated(event: any) {
      // جلب رقم العنصر الحالي من الكاروسيل
      const index = event.startPosition ?? event.item?.index ?? 0;
      if (this.placeDetails?.places?.placesshigts && this.placeDetails.places.placesshigts.length > 0) {
        // تأكد أن الـ index ضمن الحدود
        const safeIndex = Math.max(0, Math.min(index, this.placeDetails.places.placesshigts.length - 1));
        this.selectedSight = this.placeDetails.places.placesshigts[safeIndex];
        this.selectedSightId = this.selectedSight.id;
      }
    }

  isFirstTripSelected(): boolean {
    const firstTripId = this.placeDetails?.typeTrip?.[0]?.id;
    return this.selectedTrip === firstTripId;
  }



  selectTrip(tripId: number): void {
    this.selectedTrip = tripId;
    this.selectedTripType = this.placeDetails?.typeTrip.find(
      (type: { id: number }) => type.id === tripId
    );

    if (this.selectedTripType) {
      this.totalTripsCount = this.selectedTripType.trip.length;
      this.visibleTrips = this.selectedTripType.trip.slice(0, this.tripsPerRow);
      this.hiddenTrips = this.selectedTripType.trip.slice(this.tripsPerRow);
    }
  }

  @Input() item: any;


  addtoFavorits(btn: any, event: any, tripId: number) {
    if (btn.classList.contains('bg-primary')) {
    } else {

      this.httpService
        .post(environment.marsa, 'Wishlist/add', {
          trip_id: tripId,
        })
        .subscribe({
          next: (res: any) => {

           // btn.classList.add('bg-primary');
            event.target.classList.add('text-danger');
            event.target.classList.remove('text-black-50');

          }
        });
    }
  }




  showMore(): void {
    this.loading = true;
    setTimeout(() => {
      const nextTrips = this.hiddenTrips.slice(0, this.tripsPerRow);
      this.visibleTrips = [...this.visibleTrips, ...nextTrips];
      this.hiddenTrips = this.hiddenTrips.slice(this.tripsPerRow);
      this.loading = false;
      if (this.hiddenTrips.length === 0) {
        this.hideShowMoreButton();
      }
    }, 1000);
  }

  hideShowMoreButton(): void {
    this.hiddenTrips = [];
  }
  getIndex(array: any[], item: any): number {
    return array.indexOf(item);
  }
  storeSelectedSight(): void {
    if (typeof window !== 'undefined' && window.localStorage){

      localStorage.setItem('selectedSight', JSON.stringify(this.selectedSight));
    }

    //this.router.navigate(['/', this.translate.currentLang, 'destination', 'all-tickets']);
  }

  savePlaceId(placeId: string | undefined): void {
    if (placeId) {
      localStorage.setItem('placeId', placeId);
    }
  }



  filterTripType(event: any) {
    this.TypeTrip = event.target.value;
    this.filter();
  }

  filterDuration(ev: any) {
    if (ev.target.value == 'all') {
      this.FilterDurationid = [];
    } else {
      this.FilterDurationid = [];
      this.FilterDurationid.push(ev.target.value);
    }
    this.filter();
  }

  filterTime(ev: any) {
    if (ev.target.value == 'all') {
      this.FilterTimeid = [];
    } else {
      this.FilterTimeid = [];
      this.FilterTimeid.push(ev.target.value);
    }
    this.filter();
  }

  filter() {
    this.httpService
      .post(environment.marsa, 'Activtes/filter', {
        Place_id: this.placeDetails.placesid,
        TypeTrip: this.TypeTrip == 'null' ? null : this.TypeTrip,
        filterid: this.FilterDurationid.concat(this.FilterTimeid),
      })
      .subscribe((response: any) => {
        this.AllActivities = response.trips?.data;
      });
  }

  onImgError(event: any) {
    event.target.src =
      '../../../../../../assets/images/sharm-elnaga-beach 1.png';
    //Do other stuff with the event.target
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenWidth();
  }
  private checkScreenWidth() {
    this.isMobile = window.innerWidth <= 560;
  }
  setActiveSight(sight: any, isManualClick = true) {
    if (sight && sight.id) {
      // Only update the selected sight if this is a manual click
      if (isManualClick) {
        this.selectedSight = sight;
        this.selectedSightId = sight.id;
        this.manualSelectionActive = true;
        
        // إعادة تعيين علامة الاختيار اليدوي بعد فترة لتجنب تداخل الأحداث
        setTimeout(() => {
          this.manualSelectionActive = false;
        }, 1000); // ضبط المدة المناسبة لتجنب تداخل الأحداث
      }
    }
  }




  getRoundedRate(rate: number | null): number {
    if (rate !== null && !isNaN(Number(rate))) {
      return parseFloat(Number(rate).toFixed(1));
    } else {
      return 0;
    }
  }
}
