import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-boat',
  templateUrl: './boat.component.html',
  styleUrls: ['./boat.component.scss'],
})
export class BoatComponent {
  boats: any = [];
  search: any;
  types: any;
  destination: any = [];
  place_id: any = null;
  TypeTrip: any = null;
  start_d: any = null;
  rate: any = null;
  min_price = 0;
  minDate: string;

  min_priceChoosen: any = null;
   max_price = 9999;
  max_priceChoosen: number = 9999;
  isMobile = false;
  showFilter = true;
  constructor(
    public translate: TranslateService,
    private _httpService: HttpService,
    private route: ActivatedRoute,
    private titleService: Title,
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

  ngOnInit(): void {
    // Initialize price range values
    this.min_priceChoosen = this.min_price;
    this.max_priceChoosen = this.max_price;
    
    this.route.queryParams.subscribe((params: any) => {
      if (params.place_id || params.date) {
        this.place_id = params['place_id'];
        this.start_d = params['date'];
        this.filter();
      } else {
        this.getBoats();
      }
    });
    this.titleService.setTitle('Private Boats');
  }
  clearSelection() {
    this.TypeTrip = '';
    this.place_id = 'null';
    this.start_d = null;
    this.rate = null;
    this.min_priceChoosen = this.min_price; // Reset to default minimum price
    this.max_priceChoosen = this.max_price; // Reset to default maximum price

    for (let i = 2; i <= 5; i++) {
      if (i != 2) {
        document.getElementById('btn-' + i)?.classList.remove('active-rate');
      } else {
        // this.rate = 2;
        document.getElementById('btn-' + i)?.classList.add('active-rate');
      }
    }

    // Scroll to the top of the page after the function is executed
    window.scrollTo(0, 0);

    this.getBoats();
  }


  getBoats() {
    this._httpService.get(environment.marsa, 'Boats').subscribe({
      next: (res: any) => {
        this.boats = res?.trips;
        this.search = res?.search;
        this.types = res?.types;
        
        // Update price range if available from API
        if (res?.search?.min_price !== undefined) {
          this.min_price = res.search.min_price;
          this.min_priceChoosen = this.min_price;
        }
        if (res?.search?.max_price !== undefined) {
          this.max_price = res.search.max_price;
          this.max_priceChoosen = this.max_price;
        }
        
        this.getPlace();
        this.cdr.detectChanges();
      },
    });
  }

  onPageChange(event: any) {
    const pageNumber = event.page + 1; // PrimeNG uses 0-based index
    this.loadPageData(pageNumber);
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  loadPageData(pageNumber: number) {
    const url = `Activtes?page=${pageNumber}`; // Properly constructed URL
      this._httpService.get(environment.marsa, 'Boats',{ page: pageNumber }).subscribe({
        next: (res: any) => {
          this.boats = res?.trips;
          this.search = res?.search;
          this.types = res?.types;
          this.getPlace();
        // Trigger change detection manually
        this.cdr.detectChanges();
      },
    });
  }
  getPlace() {
    this._httpService.get('marsa', 'place').subscribe({
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

  searchDestination(ev: any) {
    this.place_id = ev.target.value;
    this.filter();
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
    this._httpService
      .post(environment.marsa, 'Boats/filter', {
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
      })
      .subscribe((response: any) => {
        this.boats = response.trips;
        if (this.types?.length == 0) {
          this.search = response.search;
          this.types = response.types;
        }
        if (this.destination?.length == 0) {
          this.getPlace();
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
}
