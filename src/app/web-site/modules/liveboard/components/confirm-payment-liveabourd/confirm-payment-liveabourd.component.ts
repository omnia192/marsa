import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef, NgZone, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MapModalComponent } from 'src/app/shared/components/@layout-pages/map-modal/map-modal.component';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { map, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

declare global {
  interface Window {
    L: any;
  }
}

@Component({
  selector: 'app-confirm-payment-liveabourd',
  templateUrl: './confirm-payment-liveabourd.component.html',
  styleUrls: ['./confirm-payment-liveabourd.component.scss'],
})
export class ConfirmPaymentLiveabourdComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;

  // Map properties
  showMap: boolean = false;
  searchResults: any[] = [];
  showResults: boolean = false;
  isSearching: boolean = false;
  map: any = null;
  marker: any = null;
  private googleMapsApiLoaded = false;
  private googleMapsApiKey = 'AIzaSyD5vcOBqpoSG7bh0bkvPjnXhZ9Z6MIZyak';
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  // Form controls for map
  searchControl = new FormControl('');
  latitudeControl = new FormControl({ value: 26.8206, disabled: true });
  longitudeControl = new FormControl({ value: 30.8025, disabled: true });

  // Egypt bounding box
  private egyptBounds = {
    north: 31.9167, // Northernmost point
    south: 22.0,    // Southernmost point
    east: 36.8667,  // Easternmost point
    west: 24.7      // Westernmost point
  };

  tripId: any;
  confirmRequest: any;
  relatedtrips: any[] = [];
  showRelated: boolean = false;
  Bookingid: any;
  mapModalOptions: any = {
    headerTitle: 'location',
    modalname: 'mapModalDeatails',
  };
  BookingInfo: any;
  locationValue = '';
  latitudeValue: number = 26.8206; // Default to Egypt
  longitudeValue: number = 30.8025; // Default to Egypt
  showServices: boolean = true;
  customerForm!: FormGroup;
  userData: any = {};
  @ViewChild('btn') btn: ElementRef | undefined;

  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private _AuthService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private titleService: Title,
    private viewContainerRef: ViewContainerRef,
    private http: HttpClient,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Confirm Booking');

    this.initForm();
    this.setupSearch();
    this.loadGoogleMapsApi();
    
    this.route.queryParams.subscribe((params: any) => {
      const res = JSON.parse(params['res']);
      this.confirmRequest = res;
      this.tripId = params['trip_id'];
      this.Bookingid = res.Bookingid;
      this.getLiveAbourdById(this.tripId);
    });
    if (this.confirmRequest) {
      this.Bookingid = this.confirmRequest?.Bookingid;
      this.userData.name = this.confirmRequest?.name || '';
      this.userData.phone = this.confirmRequest?.Phone || '';
      this.userData.email = this.confirmRequest?.['E-mail'] || '';
      console.log(this.userData);
    }
    this.customerForm.patchValue(this.userData);
    this.customerForm
      ?.get('phone')
      ?.patchValue(this.userData.phone.replace(/[()]/g, ''));

    this.openEditModal();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map = null;
    }
    if (this.marker) {
      this.marker = null;
    }
  }

  private setupSearch(): void {
    this.searchSubject$.pipe(
      takeUntil(this.destroy$),
      debounceTime(300), // Wait 300ms after user stops typing
      distinctUntilChanged(), // Only search if query changed
      switchMap(query => this.performSearch(query))
    ).subscribe(results => {
      this.ngZone.run(() => {
        this.searchResults = results;
        this.showResults = results.length > 0;
        this.isSearching = false;
      });
    });
  }

  private performSearch(query: string): Observable<any[]> {
    if (!query || query.trim().length < 2) {
      return of([]);
    }

    this.isSearching = true;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=eg&viewbox=${this.egyptBounds.west},${this.egyptBounds.north},${this.egyptBounds.east},${this.egyptBounds.south}&bounded=1`;
    const headers = new HttpHeaders({
      'Accept-Language': 'en'
    });

    return this.http.get<any[]>(url, { headers }).pipe(
      map((results) => {
        return results.map((result) => ({
          name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        }));
      })
    );
  }

  getLiveAbourdById(activityID: any) {
    this._httpService
      .get(environment.marsa, `liveboard/details/` + activityID)
      .subscribe((res: any) => {
        if (res?.realatedtrip.data) {
          this.showRelated = true;
          this.relatedtrips = res?.realatedtrip.data;
        }
      });
  }

  onCountryChange(event: any) {
    console.log(event);
    console.log(this.customerForm.value);
    let x =
      '+' +
      event.dialCode +
      this.customerForm.value.phone.nationalNumber?.replace('-', '');
    this.customerForm?.get('phone')?.patchValue(x);
    console.log(x);
  }

  ReturnToPayment() {
    if (typeof window !== 'undefined') {
      const storedQueryParams = localStorage.getItem('queryParamsliveaboard');
      if (storedQueryParams) {
        const queryParams = JSON.parse(storedQueryParams);

        queryParams.Bookingid = this.Bookingid;
        queryParams.BookingInfo = this.confirmRequest;
        localStorage.setItem(
          'queryParamsliveaboard',
          JSON.stringify(queryParams)
        );

        // Now you can access the properties of queryParams
        localStorage['editLiveaboard'] = true;
        this.router.navigate(
          ['/', this.translate.currentLang, 'liveboard', 'liveboard-payment'],
          { queryParams }
        );
      }
    }
  }

  initForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      locationValue: [''],
      pickup_point: ['', Validators.required],
      note: [''],
    });
  }

  confirmEdit() {
    if (this.showServices) {
      this.customerForm
        .get('pickup_point')
        ?.setValidators([Validators.required]);
    } else {
      this.customerForm.get('pickup_point')?.clearValidators();
      this.customerForm.get('pickup_point')?.updateValueAndValidity();
    }
    if (this.customerForm.valid) {
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code: code,
        userid: this.userData?.id,

        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        note: '',
      };

      Object.keys(model).forEach(
        (k) => (model[k] == '' || model[k]?.length == 0) && delete model[k]
      );
      console.log(this.BookingInfo);

      this._httpService
        .post(environment.marsa, 'bookinfo/' + this.Bookingid, model)
        .subscribe({
          next: (res: any) => {
            Swal.fire(
              'Your Booking has been send successfully.',
              'The Liveaboard official will contact you as soon as possible. For Future communication, please reach out to info@marsawaves.com',
              'success'
            );
            this.btn?.nativeElement.click();
            this.confirmRequest = res.booking_information;
          },
          error: (err: any) => {
            Swal.fire(
              'Booking Failed',
              'An error occurred while processing your booking. Please try again later.',
              'error'
            ).then(() => {});
          },
        });
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.markFormGroupTouched(this.customerForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  openEditModal(): void {
    // Check if we have location values in confirmRequest
    if (this.confirmRequest?.locationValue) {
      const locationMatch = this.confirmRequest.locationValue.match(/\(([-\d.]+) - ([-\d.]+)\)/);
      if (locationMatch) {
        const lng = parseFloat(locationMatch[1]);
        const lat = parseFloat(locationMatch[2]);
        
        // Set the form control values and component properties
        this.latitudeValue = lat;
        this.longitudeValue = lng;
        
        // Show location services and set the radio button to "Yes"
        this.showServices = true;
        const yesRadio = document.getElementById('flexRadioDefault1') as HTMLInputElement;
        if (yesRadio) {
          yesRadio.checked = true;
        }
      } else {
        // If no valid location values, set to "I don't know yet"
        this.showServices = false;
        const laterRadio = document.getElementById('flexRadioDefault2') as HTMLInputElement;
        if (laterRadio) {
          laterRadio.checked = true;
        }
      }
    } else {
      // If no location value at all, set to "I don't know yet"
      this.showServices = false;
      const laterRadio = document.getElementById('flexRadioDefault2') as HTMLInputElement;
      if (laterRadio) {
        laterRadio.checked = true;
      }
    }
  }

  openMapModal(): void {
    const mapModal = document.getElementById('mapModal');
    if (mapModal) {
      // تحقق من أن المودال ليس مفتوحاً بالفعل
      const modalInstance = (window as any).bootstrap.Modal.getInstance(mapModal);
      if (modalInstance && modalInstance._isShown) {
        return; // المودال مفتوح بالفعل
      }

      const modal = new (window as any).bootstrap.Modal(mapModal);
      modal.show();

      // تهيئة الخريطة عند فتح المودال
      mapModal.addEventListener('shown.bs.modal', () => {
        setTimeout(() => {
          this.initializeMap();
        }, 100);
      }, { once: true });

      // إعادة تهيئة الخريطة عند إغلاق المودال
      mapModal.addEventListener('hidden.bs.modal', () => {
        if (this.map) {
          this.map = null;
          this.marker = null;
        }
      });
    }
  }

  // تحميل Google Maps API ديناميكياً
  loadGoogleMapsApi(): void {
    if ((window as any).google && (window as any).google.maps) {
      this.googleMapsApiLoaded = true;
      setTimeout(() => this.initializeMap(), 500);
      return;
    }
    const scriptId = 'google-maps-api';
    if (document.getElementById(scriptId)) {
      (document.getElementById(scriptId) as HTMLScriptElement).addEventListener('load', () => {
        this.googleMapsApiLoaded = true;
        setTimeout(() => this.initializeMap(), 500);
      });
      return;
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.googleMapsApiLoaded = true;
      setTimeout(() => this.initializeMap(), 500);
    };
    script.onerror = (error) => {
      console.error('Failed to load Google Maps script:', error);
    };
    document.head.appendChild(script);
  }

  initializeMap(): void {
    if (!(window as any).google || !(window as any).google.maps) {
      return;
    }
    const mapElement = document.getElementById('googleMap');
    if (!mapElement) {
      return;
    }
    if (this.map) {
      this.map = null;
      this.marker = null;
    }
    this.map = new (window as any).google.maps.Map(mapElement, {
      center: { lat: this.latitudeValue, lng: this.longitudeValue },
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    this.marker = new (window as any).google.maps.Marker({
      position: { lat: this.latitudeValue, lng: this.longitudeValue },
      map: this.map,
      draggable: true,
      icon: {
        url: 'assets/images/locatio.svg',
        scaledSize: new (window as any).google.maps.Size(37, 37),
        anchor: new (window as any).google.maps.Point(18, 37)
      }
    });
    this.map.addListener('click', (e: any) => {
      this.ngZone.run(() => {
        this.latitudeValue = e.latLng.lat();
        this.longitudeValue = e.latLng.lng();
        this.marker.setPosition({ lat: this.latitudeValue, lng: this.longitudeValue });
        this.reverseGeocode(this.latitudeValue, this.longitudeValue);
      });
    });
    this.marker.addListener('dragend', (e: any) => {
      this.ngZone.run(() => {
        const position = this.marker.getPosition();
        this.latitudeValue = position.lat();
        this.longitudeValue = position.lng();
        this.reverseGeocode(this.latitudeValue, this.longitudeValue);
      });
    });
    setTimeout(() => {
      (window as any).google.maps.event.trigger(this.map, 'resize');
    }, 500);
  }

  onSearchInput(event: any): void {
    const query = event.target.value;
    this.ngZone.run(() => {
      // إذا كان النص قصيراً، امسح النتائج
      if (!query || query.trim().length < 2) {
        this.searchResults = [];
        this.showResults = false;
        this.isSearching = false;
      } else {
        this.searchSubject$.next(query);
      }
    });
  }

  selectLocation(location: any): void {
    this.ngZone.run(() => {
      this.searchControl.setValue(location.name);
      this.latitudeValue = location.lat;
      this.longitudeValue = location.lon;
      this.showResults = false;
      if (this.map && this.marker) {
        this.map.setCenter({ lat: this.latitudeValue, lng: this.longitudeValue });
        this.map.setZoom(15);
        this.marker.setPosition({ lat: this.latitudeValue, lng: this.longitudeValue });
        this.reverseGeocode(this.latitudeValue, this.longitudeValue);
      }
    });
  }

  clearSearch(): void {
    this.ngZone.run(() => {
      this.searchControl.setValue('');
      this.searchResults = [];
      this.showResults = false;
      this.isSearching = false;
    });
  }

  setCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ngZone.run(() => {
            this.latitudeValue = position.coords.latitude;
            this.longitudeValue = position.coords.longitude;
            if (this.map && this.marker) {
              this.map.setCenter({ lat: this.latitudeValue, lng: this.longitudeValue });
              this.map.setZoom(15);
              this.marker.setPosition({ lat: this.latitudeValue, lng: this.longitudeValue });
              this.reverseGeocode(this.latitudeValue, this.longitudeValue);
            }
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }

  confirmLocation(): void {
    const lat = this.latitudeValue;
    const lon = this.longitudeValue;
    this.locationValue = `(${lon} - ${lat})`;
    this.customerForm.patchValue({
      locationValue: this.locationValue
    });
    this.showMap = false;
  }

  reverseGeocode(lat: number, lon: number): void {
    if (!(window as any).google || !(window as any).google.maps) return;
    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng: lon } }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        this.ngZone.run(() => {
          this.searchControl.setValue(results[0].formatted_address);
        });
      }
    });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    margin: 10,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      740: {
        items:3,
      },
      940: {
        items: 3,
      },
      1200: {
        items: 3,
      },
    },
    nav: true,
  };
}
