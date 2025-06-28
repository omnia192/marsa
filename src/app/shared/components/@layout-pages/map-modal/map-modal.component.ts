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
      this.loadLeafletCSS();
      this.loadLeaflet();
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

  loadLeafletCSS(): void {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }
  }

  loadLeaflet(): void {
    if (!this.isBrowser) {
      this.spinner.hide();
      return;
    }

    if (window.L && typeof window.L.map === 'function') {
      this.L = window.L;
      setTimeout(() => this.initializeMap(), 500);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => {
      this.L = window.L;
      setTimeout(() => this.initializeMap(), 500);
    };
    script.onerror = (error) => {
      console.error('Failed to load Leaflet script:', error);
      this.spinner.hide();
    };
    document.head.appendChild(script);
  }

  initializeMap(): void {
    if (!this.isBrowser || !this.L) {
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

      this.map = this.L.map('googleMap', {
        center: [this.latitudeValue, this.longitudeValue],
        zoom: this.isEditMode ? 12 : 6,
        zoomControl: true
      });

      this.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(this.map);

      const customIcon = this.L.icon({
        iconUrl: 'assets/images/locatio.svg',
        iconSize: [37, 37],
        iconAnchor: [18, 37]
      });

      this.marker = this.L.marker([this.latitudeValue, this.longitudeValue], {
        icon: customIcon,
        draggable: true
      }).addTo(this.map);

      this.map.on('click', (e: any) => {
        this.ngZone.run(() => {
          this.latitudeValue = e.latlng.lat;
          this.longitudeValue = e.latlng.lng;
          this.marker.setLatLng([this.latitudeValue, this.longitudeValue]);
          this.reverseGeocode(this.latitudeValue, this.longitudeValue);
        });
      });

      this.marker.on('dragend', (e: any) => {
        this.ngZone.run(() => {
          const position = this.marker.getLatLng();
          this.latitudeValue = position.lat;
          this.longitudeValue = position.lng;
          this.reverseGeocode(this.latitudeValue, this.longitudeValue);
        });
      });

      setTimeout(() => {
        this.map.invalidateSize();
        this.spinner.hide();
      }, 500);

      this.mapInitialized = true;

      if (this.isEditMode) {
        this.reverseGeocode(this.latitudeValue, this.longitudeValue);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      this.spinner.hide();
    }
  }

  // Simplified reverse geocode
  reverseGeocode(lat: number, lon: number): void {
    if (!this.isBrowser) return;

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    const headers = new HttpHeaders({
      'Accept-Language': 'en'
    });

    this.http.get(url, { headers }).pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Reverse geocoding error:', error);
        return of(null);
      })
    ).subscribe((result: any) => {
      if (result && result.display_name) {
        this.ngZone.run(() => {
          // Just update the model value
          this.searchValue = result.display_name;
          console.log('Updated search value:', this.searchValue);
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
