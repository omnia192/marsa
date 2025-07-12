import { ChangeDetectorRef, Component, ElementRef, ViewChild, ViewContainerRef, NgZone, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { catchError, finalize, map, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { of, Subject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/core/services/http/profile-service.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    L: any;
  }
}

@Component({
  selector: 'app-upcoming-booking',
  templateUrl: './upcoming-booking.component.html',
  styleUrls: ['./upcoming-booking.component.scss'],
})
export class UpcomingBookingComponent implements OnDestroy {
  @ViewChild('btn') btn: ElementRef | undefined;
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

  tabs: any = [];
  other = '';
  reasons: any = [
    { id: 1, label: 'The trip too expensive.' },
    { id: 2, label: 'I Try the platform' },
    { id: 3, label: 'My vacation has been postpond' },
    { id: 4, label: 'Other' },
  ];
  choosenReason: any;
  Cancelreason: any;
  upcoming: any = [];
  Transferupcoming: any = [];
  upcomingTrips: any = [];
  allUpcoming: any = [];
  activeSection = 'all'; // Initialize with a default value
  activeBooking: any;
  customerForm!: FormGroup;
  locationValue = '';
  latitudeValue: number = 26.8206; // Default to Egypt
  longitudeValue: number = 30.8025; // Default to Egypt
  showServices: boolean = true;
  userData: any;
  booking_date: any;
  datePipe: any;
  tripId: any;
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;
  mapModalOptions: any = {
    headerTitle: 'location',
    modalname: 'mapModalDeatails',
  };
  BookingInfo: any;
  person: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private profileService: ProfileService,
    private httpService: HttpService,
    private _AuthService: AuthService,
    private fb: FormBuilder,
    private titleService: Title,
    private viewContainerRef: ViewContainerRef,
    private http: HttpClient,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  setActiveSection(section: string) {
    this.upcomingTrips = [];
    this.activeSection = section;
    if (this.activeSection == 'all') {
      this.upcomingTrips = this.allUpcoming;
    } else {
      this.upcomingTrips = this.allUpcoming.filter((item: any) => {
        console.log(this.upcomingTrips);
        if (item.categoryid == this.activeSection) {
          console.log(item.categoryid);
          return item;
        }
      });
    }
  }

  ngOnInit() {
    this.titleService.setTitle('Upcoming Booking');
    this.initForm();
    this.setupSearch();
    this.loadGoogleMapsApi();

    this.httpService.get(environment.marsa, 'profile').subscribe((res: any) => {
      this.tabs = res?.triptypes;
      console.log(this.tabs);
      this.tabs[0].category = 'Activities';
      this.tabs[1].category = 'Liveaboard';
      this.tabs[2].category = null;
      this.tabs[3].category = 'Transfer';
      this.tabs[4].category = 'Package';
    });
    this.httpService.get(environment.marsa, 'Aboutus').subscribe((res: any) => {
      this.person = res.ages;
      });
    this.loadProfiles(this.currentPage);

    this._AuthService.getUserData().subscribe(
      (data: any) => {
      },
      (error) => {
        // Handle error if needed
        console.error('Error:', error);
      }
    );
  }

  initForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      note: [''],
      pickup_point: ['', this.showServices ? [Validators.required] : []],
      locationValue: ['', Validators.required],
    });
  }

  setBookingId(arg0: any) {
    this.BookingInfo = arg0;
    this.openEditModal();
    this.customerForm.patchValue(this.BookingInfo);
    this.customerForm
      ?.get('phone')
      ?.patchValue(this.BookingInfo?.code + this.BookingInfo.phone);
  }

  setActiveBooking(bookingId: any) {
    this.activeBooking = bookingId;
  }

  setReason(reason: any) {
    this.choosenReason = reason;
    if (this.choosenReason.id !== 4) {
      this.other = '';
    }
  }

  cancelBooking() {
    if (this.choosenReason.id !== 4) {
      this.Cancelreason = this.choosenReason.label;
      console.log(this.choosenReason.label);
    } else if (this.choosenReason.id == 4) {
      this.Cancelreason = this.other;
      console.log(this.other);
    }
    const model = {
      id: this.activeBooking,
      reason: this.Cancelreason,
    };
    this.httpService
      .post(environment.marsa, 'user/book/cancel', model)
      .pipe(
        catchError((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text:
              err.error || 'An unexpected error occurred, please try again.',
            confirmButtonText: 'Ok',
          });
          return of(null);
        }),
        finalize(() => {})
      )
      .subscribe((res: any) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Your tour has been cancelled successfully!',
            confirmButtonText: 'Ok',
          });
          this.loadProfiles(this.currentPage);
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

  loadProfiles(page: number): void {
    this.profileService.getProfiles(page).subscribe((data) => {
      // this.profiles = data.userDashboard.data;
      this.upcoming = data?.userDashboard?.upcomming;
      this.Transferupcoming = data?.userDashboard?.upcommingTransfer;
      this.upcomingTrips = [
        ...(this.upcoming || []),
        ...(this.Transferupcoming || []),
      ];

      console.log(this.upcomingTrips);

      this.allUpcoming = this.upcomingTrips;

      this.cdr.markForCheck();
    });
  }

  nextPage(): void {
    if (this.currentPage < this.lastPage) {
      this.loadProfiles(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadProfiles(this.currentPage - 1);
    }
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
        note: '',
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
      };

      Object.keys(model).forEach(
        (k) => (model[k] == '' || model[k]?.length == 0) && delete model[k]
      );
      console.log(this.BookingInfo);

      this.httpService
        .post(
          environment.marsa,
          'bookinfo/' + this.BookingInfo.booking_id,
          model
        )
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.BookingInfo = res.booking_information;

            // إجبار Angular على تحديث الواجهة
            this.loadProfiles(this.currentPage);

            Swal.fire(
              'Your Booking has been sent successfully.',
              '',
              'success'
            );
            // location.reload();

            this.btn?.nativeElement.click();
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

  // map
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

  openEditModal(): void {
    // Check if we have location values in confirmRequest
    if (this.BookingInfo?.locationValue) {
      const locationMatch = this.BookingInfo.locationValue.match(/\(([-\d.]+) - ([-\d.]+)\)/);
      if (locationMatch) {
        const lng = parseFloat(locationMatch[1]);
        const lat = parseFloat(locationMatch[2]);
        
        // Set the form control values and component properties
        this.latitudeControl.setValue(lat);
        this.longitudeControl.setValue(lng);
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

  calculateEndDate(startDate: string, duration: string) {
    if (!startDate || !duration) {
      return;
    }

    const durationParts = duration.split(' ');
    const durationValue = parseInt(durationParts[0], 10);
    const durationUnit = durationParts[1].toLowerCase();

    const endDate = new Date(startDate);

    switch (durationUnit) {
      case 'Day':
      case 'day':
      case 'days':
        endDate.setDate(endDate.getDate() + durationValue - 1);
        break;
      case 'hour':
      case 'hours':
        endDate.setHours(endDate.getHours() + durationValue);
        break;
      case 'minute':
      case 'minutes':
        endDate.setMinutes(endDate.getMinutes() + durationValue);
        break;
      default:
        console.error('Invalid duration unit');
        return;
    }

    // لو محتاجاه التاريخبفورمات معين
    const formattedEndDate = this.datePipe.transform(endDate, 'yyyy/MM/dd');
    // ودا العادى
    // شوفة المناسب واعملى ليه  return
    return endDate;
  }

  ngOnDestroy() {
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
}
