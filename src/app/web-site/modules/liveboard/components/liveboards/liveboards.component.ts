import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-liveboards',
  templateUrl: './liveboards.component.html',
  styleUrls: ['./liveboards.component.scss'],
})
export class LiveboardsComponent implements OnInit {
  rows: any = [];
  search: any;
  types: any;
  destination: any = [];
  place_id: any = null;
  TypeTrip: any = null;
  start_d: any = null;
  minDate: string;
  rate: any = null;
  min_price = 0;
  min_priceChoosen: any = null;
  max_priceChoosen: any = null;
  max_price = 9999;
  isMobile = false;
  showFilter = true;
  minSelected: number = this.min_price; // To store selected min price
  maxSelected: number = this.max_price; // To store selected max price

  onSliderInput(event: any): void {
    // Retrieve the current values from the event
    this.minSelected = event.value[0]; // Assuming you're using a range slider
    this.maxSelected = event.value[1];

    // Call your functions with the current values
    this.setMinPrice(this.minSelected);
    this.setMaxPrice(this.maxSelected);
  }
  constructor(
    private httpservices: HttpService,
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
    this.route.queryParams.subscribe((params: any) => {
      if (params.place_id || params.date) {
        this.place_id = params['place_id'];
        this.start_d = params['date'];
        this.filter();
      } else {
        this.getAllLiveboard();
      }
    });
    this.titleService.setTitle('Liveaboard');

  }
  displaySelectedType: string = 'All'; // النص المعروض في الخيار الافتراضي

  getAllLiveboard() {
    this.httpservices.get(environment.marsa, 'liveboard').subscribe({
      next: (response: any) => {
        this.rows = response.trips;
        this.rows.data = this.rows.data.filter(
          (trip: any) => Object.keys(trip.Schedule).length > 0
        );

        this.search = response.search;
        this.types = response.types;
        if (this.destination?.length == 0) {
          this.getPlace();
        }
        this.TypeTrip = '';
        this.place_id = 'null';
        this.start_d = null;
        this.rate = null;
        this.min_priceChoosen = this.min_price; // Reset to default minimum price
        this.max_priceChoosen = 9999; // Reset to default maximum price
        for (let i = 2; i <= 5; i++) {
          if (i != 2) {
            document
              .getElementById('btn-' + i)
              ?.classList.remove('active-rate');
          } else {
            // this.rate = 2;
            document.getElementById('btn-' + i)?.classList.add('active-rate');
          }
        }

        // Scroll to the top of the page after the function is executed
        window.scrollTo(0, 0);
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
      this.httpservices.get(environment.marsa, 'liveboard',{ page: pageNumber }).subscribe({
        next: (response: any) => {
          this.rows = response.trips;
          this.rows.data = this.rows.data.filter(
            (trip: any) => Object.keys(trip.Schedule).length > 0
          );

          this.search = response.search;
          this.types = response.types;
          if (this.destination?.length == 0) {
            this.getPlace();
          }
          this.TypeTrip = '';
          this.place_id = 'null';
          this.start_d = null;
          this.rate = null;
          this.min_priceChoosen = this.min_price; // Reset to default minimum price
          this.max_priceChoosen = 9999; // Reset to default maximum price
          for (let i = 2; i <= 5; i++) {
            if (i != 2) {
              document
                .getElementById('btn-' + i)
                ?.classList.remove('active-rate');
            } else {
              this.rate = 2;
              document.getElementById('btn-' + i)?.classList.add('active-rate');
            }
          }

          // Scroll to the top of the page after the function is executed
          window.scrollTo(0, 0);
          this.cdr.detectChanges();
        },
      });
  }


  getPlace() {
    this.httpservices.get('marsa', 'place').subscribe({
      next: (res: any) => {
        this.destination = res.places;
      },
    });
  }
  searchDestination(ev: any) {
    this.place_id = ev.target.value;
    this.filter();
  }

  searchByType(ev: any) {
    if (ev.target.value) {
    this.TypeTrip = ev.target.value;


    }


    this.filter();
  }

  filterByDate(ev: any) {
    this.start_d = ev.target.value;
    this.filter();
  }

  filter() {
    this.httpservices
      .post(environment.marsa, 'liveboard/filter', {
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

        this.rows = response.trips;
        // this.rows = response.trips;
        this.rows.data = this.rows.data.filter(
          (trip: any) => Object.keys(trip.Schedule).length > 0
        );
        if (this.types?.length == 0) {
          this.types = response.types;
          this.search = response.search;
        }
        if (this.destination?.length == 0) {
          this.getPlace();
        }
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
}
