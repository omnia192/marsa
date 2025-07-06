import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, NgZone, OnInit, PLATFORM_ID, AfterViewInit, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of, Subject, timer } from 'rxjs';
import { catchError, map, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    L: any;
  }
}

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;

  // Basic properties
  searchValue: string = '';
  searchResults: any[] = [];
  showResults: boolean = false;
  isSearching: boolean = false;

  latitudeValue: number = 26.8206; // Default to Egypt
  longitudeValue: number = 30.8025; // Default to Egypt
  map: any = null;
  marker: any = null;
  isEditMode: boolean = false;

  private isBrowser: boolean;
  private L: any;
  mapInitialized: boolean = false;
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();
  private googleMapsApiLoaded = false;
  private googleMapsApiKey = 'AIzaSyD5vcOBqpoSG7bh0bkvPjnXhZ9Z6MIZyak'; // مفتاح المستخدم

  constructor(
    private ngZone: NgZone,
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // If data contains initial coordinates, use them
    if (data && data.latitude && data.longitude) {
      this.latitudeValue = data.latitude;
      this.longitudeValue = data.longitude;
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {
    this.spinner.show();

    if (this.isBrowser) {
      this.loadGoogleMapsApi();
    }

    // Setup search with debounce
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    // Focus the search input after view initialization
    setTimeout(() => {
      if (this.searchInput && this.searchInput.nativeElement) {
        this.searchInput.nativeElement.focus();
        this.searchInput.nativeElement.removeAttribute('readonly');
      }
    }, 500);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.map) {
      this.map.remove();
      this.map = null;
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
      this.cdr.detectChanges();
      });
    });
  }

  private performSearch(query: string): Observable<any[]> {
    if (!this.isBrowser || !query || query.trim().length < 2) {
      return of([]);
    }

    this.isSearching = true;
    this.cdr.detectChanges();

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=eg&limit=5`;
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
      }),
      catchError(error => {
        console.error('Search error:', error);
        this.isSearching = false;
        return of([]);
      })
    );
  }

  // Search for locations - deprecated, using new approach
  searchLocations(query: string): void {
    // This method is kept for backward compatibility but not used
    this.searchSubject$.next(query);
  }

  onSearchInput(event: any): void {
    const query = event.target.value;
    this.searchSubject$.next(query);
  }

  // Select a location from search results
  selectLocation(location: any): void {
    this.ngZone.run(() => {
    this.searchValue = location.name;
    this.latitudeValue = location.lat;
    this.longitudeValue = location.lon;
    this.showResults = false;

    if (this.map && this.marker) {
      this.map.setView([this.latitudeValue, this.longitudeValue], 15);
      this.marker.setLatLng([this.latitudeValue, this.longitudeValue]);
    }
      this.cdr.detectChanges();
    });
  }

  // Clear search
  clearSearch(): void {
    this.ngZone.run(() => {
    this.searchValue = '';
    this.searchResults = [];
    this.showResults = false;
      this.isSearching = false;
      this.cdr.detectChanges();
    });
  }

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
      this.spinner.hide();
    };
    document.head.appendChild(script);
  }

  initializeMap(): void {
    if (!this.isBrowser || !(window as any).google || !(window as any).google.maps) {
      this.spinner.hide();
      return;
    }
    if (this.mapInitialized) {
      this.spinner.hide();
      return;
    }
    try {
      const mapElement = document.getElementById('googleMap');
      if (!mapElement) {
        this.spinner.hide();
        return;
      }
      this.map = new (window as any).google.maps.Map(mapElement, {
        center: { lat: this.latitudeValue, lng: this.longitudeValue },
        zoom: this.isEditMode ? 12 : 6,
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
        this.spinner.hide();
      }, 500);
      this.mapInitialized = true;
      if (this.isEditMode) {
        this.reverseGeocode(this.latitudeValue, this.longitudeValue);
      }
    } catch (error) {
      console.error('Error initializing Google Map:', error);
      this.spinner.hide();
    }
  }

  // Simplified reverse geocode
  reverseGeocode(lat: number, lon: number): void {
    if (!this.isBrowser || !(window as any).google || !(window as any).google.maps) return;
    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng: lon } }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        this.ngZone.run(() => {
          this.searchValue = results[0].formatted_address;
        });
      }
    });
  }

  setCurrentLocation(): void {
    if (!this.isBrowser) return;

    this.spinner.show();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ngZone.run(() => {
            this.latitudeValue = position.coords.latitude;
            this.longitudeValue = position.coords.longitude;

            if (this.map && this.marker) {
              this.map.setView([this.latitudeValue, this.longitudeValue], 15);
              this.marker.setLatLng([this.latitudeValue, this.longitudeValue]);
              this.reverseGeocode(this.latitudeValue, this.longitudeValue);
            }

            this.spinner.hide();
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.spinner.hide();
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.spinner.hide();
    }
  }

  closeDialog(): void {
    this.dialogRef.close({
      latitude: this.latitudeValue,
      longitude: this.longitudeValue,
      address: this.searchValue
    });
  }
}
