import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { Meta, Title } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss'],
})
export class ToursComponent {
  rows: any = [];
  totalActivitiesCount: number = 0;
  activeView = 'grid';
  
  FilterTimeid: any = [];
  FilterDurationid: any = [];
  isDestinationFilterActive = false;

  duration: any = [];
  time: any = [];
  types: any = [];
  destination: any = [];
  place_id: any = null;
  TypeTrip: any = null;
  start_d: any = null;
  minDate: string;
  rate: any = null;
  min_price = 0;
  min_priceChoosen: number = 0;
  max_price = 999;
  max_priceChoosen: number = 999;
  showFilter = true;
  isMobile = false;
   currentPage: number = 1;
  lastPage: number = 1;
  constructor(
    private _httpsService: HttpService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private cdr: ChangeDetectorRef
  ) {
    if (window.screen.width < 1024) {
      this.isMobile = true;
      this.showFilter = false;
    }
    const today = new Date();
    const dd: string = String(today.getDate()).padStart(2, '0');
    const mm: string = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy: number = today.getFullYear();
    // Set minDate to today's date
    this.minDate = `${yyyy}-${mm}-${dd}`;
  }
  openCalendar(event: Event) {
    const input = event.target as HTMLInputElement;
    input.showPicker(); // يجبر المتصفح على فتح التقويم
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      // استدعاء القيم من queryParams
      if (params.place_id || params.date) {
        this.place_id = params['place_id'];
        this.start_d = params['date'];
        this.filter();
      } else {
        const storedPlaceId = localStorage.getItem('placeId');
        if (storedPlaceId) {
          localStorage.removeItem('placeId'); // حذف القيم بعد استدعائها مباشرة
          this.searchDestination({ target: { value: storedPlaceId } });
        } else {
          this.getAllactivity();
        }
      }
    });

    this.titleService.setTitle('Tours & Activities');
  }


  getAllactivity() {
    this._httpsService.get(environment.marsa, 'Activtes', { page: this.currentPage }).subscribe({
      next: (response: any) => {
        this.rows = response;
        this.totalActivitiesCount = response.trips?.total || 0;
        this.duration = response.duration;
        this.lastPage = response.trips?.last_page || 1; 
        this.time = response.time;
        this.types = response.types;

        this.getPlaces();
      },
    });
  }
  prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.loadPageData(this.currentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
    this.loadPageData(this.currentPage);
     console.log(this.loadPageData(this.currentPage))

}

nextPage() {
  if (this.currentPage < this.lastPage) {
    this.currentPage++;
    this.loadPageData(this.currentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}


  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.loadPageData(this.currentPage);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
      this.loadPageData(this.currentPage);

  }

  loadPageData(pageNumber: number) {
     

    // If we have active filters, use filter endpoint
    if (this.hasActiveFilters()) {
       console.log('loadPageData triggered for page:', pageNumber); // مهم جدًا
      this._httpsService.post(environment.marsa, 'Activtes/filter', {
        Place_id: this.place_id == 'null' ? null : this.place_id,
        TypeTrip: this.TypeTrip == 'null' ? null : this.TypeTrip,
        start_d: this.start_d,
        rating: this.rate ? 'rating' : null,
        value: this.rate,
        price: this.min_priceChoosen || this.max_priceChoosen ? 'price' : null,
        start: this.min_priceChoosen
          ? this.min_priceChoosen
          : this.min_price.toString(),
        end: this.max_priceChoosen
          ? this.max_priceChoosen
          : this.max_price.toString(),
        filterid: this.FilterDurationid.concat(this.FilterTimeid),
        page: pageNumber,
        per_page: 12
      }).subscribe((response: any) => {
         console.log('loadPageData triggered for page:', pageNumber); // مهم جدًا
        this.rows = response;
        this.totalActivitiesCount = response.trips?.total || 0;
        if (this.types?.length == 0) {
          this.duration = response.duration;
          this.time = response.time;
          this.types = response.types;
        }
        if (this.destination?.length == 0) {
          this.getPlaces();
        }
      });
    } else {
      // If no filters, use normal pagination
      this._httpsService.get(environment.marsa, 'Activtes', { page: pageNumber }).subscribe({
        next: (response: any) => {
        console.log('raw response:', response); // اطبع الاستجابة
    console.log('Trips data:', response.trips.data); // عناصر الصفحة
          this.rows = response;
          this.totalActivitiesCount = response.trips?.total || 0;

          this.duration = response.duration;
          this.lastPage = response.trips?.last_page || 1; // خزِّن آخر صفحة
          this.time = response.time;
          this.types = response.types;
          this.getPlaces();
        }
      });
    }
  }
  selectedTimeId: number | null = null;
  clearSelection() {
    this.TypeTrip = '';
    this.place_id = 'null';
    this.start_d = null;
    this.rate = null;
    this.isDestinationFilterActive = false;
    this.min_priceChoosen = this.min_price;
    this.max_priceChoosen = this.max_price;
    this.FilterDurationid = [];
    this.FilterTimeid = [];
    this.currentPage = 1; // Reset to first page
    
    for (let i = 2; i <= 5; i++) {
      if (i != 2) {
        document.getElementById('btn-' + i)?.classList.remove('active-rate');
      } else {
        document.getElementById('btn-' + i)?.classList.add('active-rate');
      }
    }
    window.scrollTo(0, 0);

    this.getAllactivity();
  }
  getPlaces() {
    this._httpsService.get('marsa', 'place').subscribe({
      next: (res: any) => {
        this.destination = res.places;
      },
    });
  }
  setMinPrice(event: any) {
    this.min_priceChoosen = event.target.value;
    this.filter();
  }
  setMaxPrice(event: any) {
    this.max_priceChoosen = event.target.value;
    this.filter();
  }

  filterDuration(ev: any) {
    this.selectedTimeId = ev;
    if (ev == 'all') {
      this.FilterDurationid = [];
      // Get total count when "All" is selected
      this._httpsService.get(environment.marsa, 'Activtes/count').subscribe({
        next: (response: any) => {
          this.totalActivitiesCount = response.total || 0;
        }
      });
    } else {
      this.FilterDurationid = [];
      this.FilterDurationid.push(ev);
    }
    this.filter();
  }

  filterTime(ev: any) {
    if (ev == 'all') {
      this.FilterTimeid = [];
      // Get total count when "All" is selected
      this._httpsService.get(environment.marsa, 'Activtes/count').subscribe({
        next: (response: any) => {
          this.totalActivitiesCount = response.total || 0;
        }
      });
    } else {
      this.FilterTimeid = [];
      this.FilterTimeid.push(ev);
    }
    this.filter();
  }

  searchDestination(ev: any) {
    this.place_id = ev.target.value;
    this.isDestinationFilterActive = this.place_id !== 'null' && this.place_id !== null;
    this.currentPage = 1; // Reset to first page when changing destination
    
    if (!this.isDestinationFilterActive) {
      this.getAllactivity();
    } else {
      this._httpsService
        .post(environment.marsa, 'Activtes/filter', {
          Place_id: this.place_id,
          TypeTrip: this.TypeTrip == 'null' ? null : this.TypeTrip,
          start_d: this.start_d,
          rating: this.rate ? 'rating' : null,
          value: this.rate,
          price: this.min_priceChoosen || this.max_priceChoosen ? 'price' : null,
          start: this.min_priceChoosen
            ? this.min_priceChoosen
            : this.min_price.toString(),
          end: this.max_priceChoosen
            ? this.max_priceChoosen
            : this.max_price.toString(),
          filterid: this.FilterDurationid.concat(this.FilterTimeid),
          page: this.currentPage,
          per_page: 12
        })
        .subscribe((response: any) => {
          this.rows = response;
          this.totalActivitiesCount = response.trips?.total || 0;
          if (this.types?.length == 0) {
            this.duration = response.duration;
            this.time = response.time;
            this.types = response.types;
          }
          if (this.destination?.length == 0) {
            this.getPlaces();
          }
        });
    }
  }

  setRate(number: any) {
    for (let i = 2; i <= 5; i++) {
      if (i != number) {
        document.getElementById('btn-' + i)?.classList.remove('active-rate');
      } else {
        this.rate = number;
        document.getElementById('btn-' + i)?.classList.add('active-rate');
        this.filter();
      }
    }
  }

  filter() {
    this.currentPage = 1;
    this._httpsService.post(environment.marsa, 'Activtes/filter', {
      Place_id: this.place_id == 'null' ? null : this.place_id,
      TypeTrip: this.TypeTrip == 'null' ? null : this.TypeTrip,
      start_d: this.start_d,
      rating: this.rate ? 'rating' : null,
      value: this.rate,
      price: this.min_priceChoosen || this.max_priceChoosen ? 'price' : null,
      start: this.min_priceChoosen
        ? this.min_priceChoosen
        : this.min_price.toString(),
      end: this.max_priceChoosen
        ? this.max_priceChoosen
        : this.max_price.toString(),
      filterid: this.FilterDurationid.concat(this.FilterTimeid),
      page: this.currentPage,
      per_page: 12
    }).subscribe((response: any) => {
      this.rows = response;
      this.totalActivitiesCount = response.trips?.total || 0;
      if (this.types?.length == 0) {
        this.duration = response.duration;
        this.time = response.time;
        this.types = response.types;
      }
      if (this.destination?.length == 0) {
        this.getPlaces();
      }
    });
  }

  searchByType(ev: any) {
    this.TypeTrip = ev.target.value;
    this.filter();
  }

  filterByDate(ev: any) {
    this.start_d = ev.target.value;
    this.filter();
  }

  hasActiveFilters(): boolean {
    return (
      (this.place_id !== 'null' && this.place_id !== null && this.place_id !== '') ||
      (this.TypeTrip !== 'null' && this.TypeTrip !== null && this.TypeTrip !== '') ||
      (this.start_d !== null && this.start_d !== '') ||
      (this.rate !== null && this.rate !== '') ||
      (this.min_priceChoosen !== null && this.min_priceChoosen !== this.min_price) ||
      (this.max_priceChoosen !== null && this.max_priceChoosen !== this.max_price) ||
      (this.FilterDurationid && this.FilterDurationid.length > 0) ||
      (this.FilterTimeid && this.FilterTimeid.length > 0)
    );
  }
}
