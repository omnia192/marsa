import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../../core/services/http/http.service';
import { environment } from '../../../../../../environments/environment.prod';
import { ImageSliderModalComponent } from '../../../../../shared/sliders/image-slider-modal/image-slider-modal.component';
import { BoatSliderModalComponent } from '../../../../../shared/sliders/boat-slider-modal/boat-slider-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../shared/services/auth.service';
import { MatSelectChange } from '@angular/material/select';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HeaderService } from '../../../../../shared/services/header.service';
import { CabinInfoModalComponent } from '../../../../../shared/sliders/cabin-info-modal/cabin-info-modal.component';
import { DatePipe } from '@angular/common';
import { SEOService } from '../../../../../shared/services/seo.service';
import {
  CUSTOM_DATE_FORMATS,
  CustomDateAdapter,
} from 'src/app/shared/components/Date/custom-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'app-boat-details',
  templateUrl: './boat-details.component.html',
  styleUrls: ['./boat-details.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition(':enter, :leave', [animate(300)]),
    ]),
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
})
export class BoatDetailsComponent {
  @Output() bookNowClicked: EventEmitter<void> = new EventEmitter<void>();
  persons: number = 0;
  BoatID: any;
  activeTabId: string | null = null;
  boatData: any;
  relatedtrips: any[] = [];
  flattenedCabin: any = [];
  showRelatedtrip: boolean = false;
  selectedStar: number = 0;
  starNumber: any = null;
  comment: any = null;
  availableOptionMap!: SafeHtml;
  Why_chosse_us: any;
  cover: any;
  images: any;
  coverAndImages: any[] = [];
  happyGustImages: any[] = [];
  remainingImages: string[] = [];
  showSeeMore: boolean = false;
  videoBoatUrl!: SafeHtml;
  videoUrl!: SafeHtml;
  isLogin: boolean = false;
  showAllReviews: boolean = false;
  @ViewChild('videoModal') videoModal!: TemplateRef<any>;
  @ViewChild('videoBoatModal') videoBoatModal!: TemplateRef<any>;
  @ViewChild('selectCabinButton') selectCabinButton!: ElementRef;
  showMapFrame: boolean = false;
  googleIframe!: SafeHtml;
  selectedSchedule: any;
  selectedDateControl: FormControl<string | null> = new FormControl<
    string | null
  >('', Validators.required);
  range!: FormGroup;
  today!: Date;
  startDate: any;
  endDate: any;
  dateRange: Date[] = [];
  isSingleImage: boolean = false;
  price: any;
  discount: any;
  isMobile = false;
  isTestDivScrolledIntoView: any;
  hideMobileFooter = true;
  desplayedGustImages: any[] = [];
  displayBasic: boolean = false;
  displayBoats: boolean = false;
  displayCustom: boolean = false;
  activeIndex: number = 0;
  boatImages: any[] = [];
  items: any[] = [];
  pagedItems: any[] = [];
  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = event.first + event.rows;
    this.pagedItems = this.items.slice(startIndex, endIndex);
  }
  constructor(
    private el: ElementRef,
    private _httpService: HttpService,
    private sanitizer: DomSanitizer,
    public translate: TranslateService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private _AuthService: AuthService,
    private _Router: Router,
    private headerService: HeaderService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private seoService: SEOService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {
    if (window.screen.width < 768) {
      this.isMobile = true;
    }
  }

  seeMore: boolean = false;
  showFullDescription = false;

  // Method to toggle description visibility
  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
    // No need to toggle seeMore; it can be derived from showFullDescription
  }
getBed(item: any): any {
    if (item && item.bed ) {
     return item.bed  ;
    }
    return null;
  }

  // Method to get the displayed description
  getDisplayedDescription(): string {
    const words = this.boatData?.Description?.split(' ');
    if (this.showFullDescription || words?.length <= 150) {
      return this.boatData?.Description;
    } else {
      return words?.slice(0, 150).join(' ') + '...';
    }
  }
  getImageName(url: string): string {
    const imageName = url?.substring(
      url.lastIndexOf('/') + 1,
      url.lastIndexOf('.')
    );
    return imageName || 'Unknown photo';
  }
  @HostListener('document:scroll', ['$event'])
  isScrolledIntoView() {
    if (this.selectCabinButton) {
      const rect = this.selectCabinButton.nativeElement.getBoundingClientRect();
      const topShown = rect.top >= 0;
      const bottomShown = rect.bottom <= window.innerHeight;
      this.isTestDivScrolledIntoView = topShown && bottomShown;
      if (this.isTestDivScrolledIntoView) {
        // this.hideMobileFooter = true;
      } else {
        // this.hideMobileFooter = false;
      }
    }
  }
  responsiveOptions: any[] | undefined;
  imageClick(index: number) {
    this.desplayedGustImages = Array.from(
      Object.entries(this.happyGustImages)
    ).map(([key, value]) => ({ value }));

    this.activeIndex = index;
    this.displayCustom = true;
  }
  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 6,
      },
      {
        breakpoint: '1200px',
        numVisible: 6,
      },
      {
        breakpoint: '1024px',
        numVisible: 6,
      },
      {
        breakpoint: '768px',
        numVisible: 5,
      },
      {
        breakpoint: '560px',
        numVisible: 3,
      },
    ];
    this.range = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
    this.today = new Date();

    this.activatedRoute.params.subscribe((params: any) => {
      this.BoatID = params.id;
      this.loadData();
      this.getAbout();
    });
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
  }

  scrollToCabin() {
    this.selectCabinButton.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  loadData(): void {
    this.getActivityById(this.BoatID);
  }

  getRoundedRate(rate: number | null): number {
    if (rate !== null && !isNaN(Number(rate))) {
      return parseFloat(Number(rate).toFixed(1));
    } else {
      return 0;
    }
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src =
        '../../../../../../assets/custom/user-dasboard/avatar-place.png';
    }
  }
  getRatingDescription(rate: number): string {
    if (rate >= 1 && rate < 2) {
      return 'Average';
    } else if (rate >= 2 && rate < 3) {
      return 'Good';
    } else if (rate >= 3 && rate < 4) {
      return 'Very Good';
    } else if (rate >= 4 && rate <= 5) {
      return 'Excellent';
    } else {
      return '';
    }
  }

  onStartDateChanged(): void {
    const startDate = this.range.get('start')?.value;
    if (startDate) {
      this.startDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
    }
  }

  onEndDateChanged(): void {
    const endDate = this.range.get('end')?.value;
    if (endDate) {
      this.endDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');
    }
  }
 onStartDateChanged2(): void {
    const startDate = this.range.get('start')?.value;
    const formattedDate = this.datePipe.transform(startDate, 'yyyy/MM/dd');
    this.startDate = formattedDate;

    if (startDate) {
      const selectedStartDate = new Date(startDate);
      if (selectedStartDate < this.today) {
        this.range.get('start')?.setValue(this.today);
      }
      // Automatically set minimum date for end date
      this.range.get('end')?.setValue(null); // Reset end date when start date changes
    }
  }

  onEndDateChanged2(): void {
    const endDate = this.range.get('end')?.value;
    const formattedDate = this.datePipe.transform(endDate, 'yyyy/MM/dd');
    this.endDate = formattedDate;

    if (endDate) {
      const selectedEndDate = new Date(endDate);
      if (selectedEndDate < this.today) {
        this.range.get('end')?.setValue(this.today);
      }
    }
  }

  // New method for PrimeNG calendar
  onDateSelect(event: any): void {
    if (this.dateRange && this.dateRange.length > 0) {
      // For start date
      if (this.dateRange[0]) {
        this.startDate = this.datePipe.transform(this.dateRange[0], 'yyyy-MM-dd');
        // Update the Angular Material FormGroup for compatibility with existing code
        this.range.get('start')?.setValue(this.dateRange[0]);
      }

      // For end date
      if (this.dateRange[1]) {
        this.endDate = this.datePipe.transform(this.dateRange[1], 'yyyy-MM-dd');
        // Update the Angular Material FormGroup for compatibility with existing code
        this.range.get('end')?.setValue(this.dateRange[1]);
      }
    }
  }

  scrollTo(tabId: string) {
    this.activeTabId = tabId;
    const tabElement = document.getElementById(tabId);

    if (tabElement) {
      const elementRect = tabElement.getBoundingClientRect();
      const offset = window.scrollY + elementRect.top - 170; // Adjust offset as needed

      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    } else {
      console.error(`Element with ID ${tabId} not found.`);
    }
  }

  private setupIntersectionObserver() {
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.5, // element should be at least 70% visible
    };

    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        // Set activeTabId to the id of the first visible element
        this.activeTabId = visibleEntries[0].target.id;
      }
    }, options);

    const tabs = document.querySelectorAll('.tab-pane');
    tabs.forEach((tab) => {
      observer.observe(tab);
    });
  }

  ngAfterViewInit() {
    //   // Initialize the active tab on load
    this.setupIntersectionObserver();
  }

  share() {
    window.navigator.share({
      title: this.boatData?.Name,
      url: this._Router.url,
    });
  }

  getActivityById(BoatID: any) {
    this._httpService
      .get(environment.marsa, `Boats/details/` + BoatID)
      .subscribe((res: any) => {
        this.boatData = res?.tripDetails;
        this.items = this.boatData?.Reviwe.reverse();

        this.activatedRoute.params.subscribe((params: any) => {
          if ('name' in params) {
            this.router.navigate([
              '/',
              localStorage.getItem('lang'),
              'boats',
              params.id,
              res?.tripDetails.slugUrl,
            ]);
          }
        });
        this.googleIframe = this.sanitizer.bypassSecurityTrustHtml(
          this.boatData.PlaceOnMap
        );
        this.availableOptionMap = this.sanitizer.bypassSecurityTrustHtml(
          this.boatData.Map
        );
        this.images = Array.from(Object.entries(res?.tripDetails?.Images)).map(
          ([key, value]) => ({ value })
        );
        this.cover = { value: res?.tripDetails?.Cover };
        this.coverAndImages = [...this.images, this.cover];
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          res?.tripDetails?.Video
        );
        this.happyGustImages = this.boatData?.HappyGust;
        this.remainingImages = this.boatData?.HappyGust.slice(1);
        const boat = this.boatData?.Boats.find(
          (boat: any) => boat.id === BoatID
        );
        this.videoBoatUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          boat?.video
        );

        if (res?.relatedtrips?.data) {
          this.relatedtrips = res?.relatedtrips?.data;
          this.showRelatedtrip = true;
        }
        this.flattenedCabin = this.boatData.cabin.reduce(
          (acc: any[], curr: any[]) => {
            return acc.concat(curr);
          },
          []
        );
        this.isSingleImage = this.images.length === 1;
        if (this.boatData) {
          this.titleService.setTitle(this.boatData?.MetaTitle);

          this.metaService.addTags([
            { name: 'description', content: this.boatData?.MetaDesc },
          ]);
          const canonicalURL = this.boatData?.CanonicalUrl;
          if (canonicalURL) {
            this.seoService.setCanonicalURL(canonicalURL);
          }
        }
      });
  }

  getAbout() {
    this._httpService.get(environment.marsa, 'Aboutus').subscribe({
      next: (response: any) => {
        this.Why_chosse_us = response.Why_chosse_us;
      },
    });
  }

  openVideotrip(): void {
    this.dialog.open(this.videoModal, {
      width: '100%',
      height: '70%',
    });
  }

  openMainImagesModal(): void {
    const dialogRef = this.dialog.open(ImageSliderModalComponent, {
      width: '80%',
    });
    dialogRef.componentInstance.images = Array.from(
      Object.entries(this.boatData.Images)
    ).map(([key, value]) => ({ value }));
    dialogRef.componentInstance.title = 'Boat Images';
  }

  openImageSliderModal(): void {
    const dialogRef = this.dialog.open(ImageSliderModalComponent, {
      width: '80%',
    });
    dialogRef.componentInstance.images = this.happyGustImages;
    dialogRef.componentInstance.title = 'Traveler Photos';
  }

  openBoatSliderModal(boat: any): void {
    this.displayBoats = true;
    this.boatImages = Array.from(Object.entries(boat.images)).map(
      ([key, value]) => ({ value })
    );
  }

  openCabinSliderModal(cabin: any): void {
    const boatImages = cabin.image;
    const dialogRef = this.dialog.open(CabinInfoModalComponent, {
      width: '100%',
    });
    dialogRef.componentInstance.images = boatImages;
    dialogRef.componentInstance.data = cabin;
  }

  openVideoBoat(): void {
    this.dialog.open(this.videoBoatModal, {
      width: '100%',
      height: '70%',
    });
  }

  dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const start = group.get('start')?.value;
    const end = group.get('end')?.value;

    if (start && end && start > end) {
      return { invalidRange: true };
    }

    return null;
  }

  minDateValidator(control: AbstractControl): { [key: string]: any } | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (control.value && control.value < today) {
      return { minDate: true };
    }

    return null;
  }

  getValue(key: any): any {
    if (this.selectedDateControl && this.selectedDateControl.value) {
      return this.selectedDateControl.value[key] || 0;
    }
    return 0;
  }

  onSelectionChange(event: any): void {
    setTimeout(() => {
      this.persons = 1;
    });
  }
  

  onValueChange(event: any) {
    console.log('====================================');
    console.log(event);
    console.log('====================================');
    this.selectedSchedule = event.id;
    this.price = event.price;
    this.discount = event.discount;
  }

  showMap(): void {
    this.showMapFrame = !this.showMapFrame;
  }

  onStarHover(starNumber: number) {
    this.selectedStar = starNumber;
  }

  onStarClick(starNumber: number) {
    this.starNumber = starNumber;
  }

  bookNow() {
    // Check if dates are selected in PrimeNG calendar
    const datesValid = this.dateRange && this.dateRange.length === 2 && this.dateRange[0] && this.dateRange[1];

    if (!datesValid || this.selectedDateControl.invalid) {
      // If using PrimeNG calendar without form controls, we need to show validation visually
      if (!datesValid) {
        this.toastr.warning('Please select a date range', '', {
          timeOut: 3000,
          closeButton: true,
        });
      }

      // Still mark Angular Material form controls as touched for backwards compatibility
      this.range.markAllAsTouched();
      this.selectedDateControl.markAsTouched();
      return;
    } else {
      if (!this.isLogin) {
        window.scroll(0, 0);
        this.toastr.info('Please login first ', '', {
          disableTimeOut: false,
          titleClass: 'toastr_title',
          messageClass: 'toastr_message',
          timeOut: 1500,
          closeButton: true,
        });

        this.headerService.toggleDropdown();
      } else {
        const queryParams = {
          trip_id: this.boatData.id,
          startdate: this.startDate,
          enddate: this.endDate,
          distnation_id: this.selectedSchedule,
          // distnation_name: this.selectedSchedule,
        };
        this._Router.navigate(
          ['/', this.translate.currentLang, 'boats', 'payment'],
          { queryParams }
        );
      }
    }
  }
  addtoFavorits(btn: any, event: any) {
    if (btn.classList.contains('bg-primary')) {
      // Remove from favorites/wishlist
    } else {
      // Add to favorites/wishlist
      this._httpService
        .post(environment.marsa, 'Wishlist/add', { trip_id: this.boatData?.id })
        .subscribe({
          next: (res: any) => {
            event.target.classList.add('text-danger');
            event.target.classList.remove('text-black-50');
          },
        });
    }
  }
  addReview(): void {
    const model = {
      trip_id: this.boatData?.id,
      rating: this.starNumber,
      comment: this.comment,
    };
    if (!this.isLogin) {
      this.toastr.info('Please login first', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      window.scroll(0, 0);
      this.headerService.toggleDropdown();
    } else {
      if (
        this.starNumber !== null &&
        this.starNumber !== 0 &&
        this.comment !== null &&
        this.comment !== ''
      ) {
        this._httpService
          .post(environment.marsa, 'Review/addreview', model)
          .subscribe({
            next: (res: any) => {
              this.toastr.success(res.message);
              this.loadData();
              this.starNumber = null;
              this.comment = null;
              this.selectedStar = 0;
            },
          });
      } else {
        this.toastr.warning(
          'Please specify the number of stars and write your comment before submitting! Thank you!',
          '',
          {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          }
        );
      }
    }
  }

  customOptions: OwlOptions = {
    loop: this.relatedtrips.length > 4 ? true : false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
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
        items: 4,
      },
      940: {
        items: 4,
      },
      1200: {
        items: 4,
      },
    },
    nav: true,
  };

  imagesOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 3000,
    margin: 0,
    nav: false,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 3,
      },
      720: {
        items: 6,
      },
      1200: {
        items: 6,
      },
    },
  };

  getOverviewItems(overview: string): string[] {
    return overview.split('\n');
  }

  coverAndImagesOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    margin: 0,
    navSpeed: 900,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
      1200: {
        items: 1,
      },
    },
    nav: true,
  };
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.hideMobileFooter = true;
    this.isModalOpen = false;
  }

  selectedDestination: any = null;

  onDestinationChange(event: any) {
    this.selectedDestination = event.value;
    // إذا كنت تحتاج منطق إضافي أضفه هنا
  }
}
