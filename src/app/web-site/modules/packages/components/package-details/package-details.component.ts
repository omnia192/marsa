import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../../core/services/http/http.service';
import { AuthService } from '../../../../../shared/services/auth.service';
import { HeaderService } from '../../../../../shared/services/header.service';
import { ImageSliderModalComponent } from '../../../../../shared/sliders/image-slider-modal/image-slider-modal.component';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../../environments/environment.prod';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { PackageSliderModalComponent } from '../../../../../shared/sliders/package-slider-modal/package-slider-modal.component';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { FormControl, Validators } from '@angular/forms';
import { SEOService } from '../../../../../shared/services/seo.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  CUSTOM_DATE_FORMATS,
  CustomDateAdapter,
} from 'src/app/shared/components/Date/custom-date-adapter';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
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
export class PackageDetailsComponent {
  @ViewChild('videoModal') videoModal!: TemplateRef<any>;
  @ViewChild('checkAvailabilityButton') checkAvailabilityButton!: ElementRef;
  isMobile = false;
  rows: any;
  faq: any;
  packageID: any;
  relatedtrips: any[] = [];
  Why_chosse_us: any;
  isLogin = false;
  activeTabId: string | null = null;
  happyGuestImages: any[] = [];
  remainingImages: string[] = [];
  selectedStar = 0;
  starNumber: any = null;
  comment: any = null;
  adults: number = 1;
  children: number = 0;
  infant: number = 0;
  showAllReviews = false;
  isSmallScreen = window.innerWidth <= 768;

   responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  // duration: any;
  @ViewChild('startPicker') startPicker!: MatDatepicker<any>;
  @ViewChild('endPicker') endPicker!: MatDatepicker<Date>;

  minDate = new Date(); // Today's date
  maxDate: Date | null = null; // Maximum selectable date
  duration: string = '10 Day'; // Placeholder for API response
  startDate: any;
  endDate: Date | null = null;
  formattedStartDate: any;
  formattedEndDate: any;

  // Define selectedDateControl as a FormControl
  selectedDateControl = new FormControl('', Validators.required);
  isTestDivScrolledIntoView: any;
  today = new Date();
  constructor(
    private modalService: NgbModal,
    public translate: TranslateService,
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private el: ElementRef,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private headerService: HeaderService,
    private router: Router,
    private seoService: SEOService,
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef
  ) {
    this.today.setHours(0, 0, 0, 0);
    if (window.screen.width < 768) {
      this.isMobile = true;
    }
  }

  customOptions: OwlOptions = {
    loop: this.relatedtrips.length > 4 ? true : false,
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

  seeMore: boolean = false;
  showFullDescription = false;

  // Method to toggle description visibility
  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
    // No need to toggle seeMore; it can be derived from showFullDescription
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement; // التأكد من أن الهدف هو عنصر صورة
    if (target) {
      target.src =
        '../../../../../../assets/custom/user-dasboard/avatar-place.png';
    }
  }
  // Method to get the displayed description
  getDisplayedDescription(): string {
    const words = this.rows?.Description?.split(' ');
    if (this.showFullDescription || words?.length <= 150) {
      return this.rows?.Description;
    } else {
      return words?.slice(0, 150).join(' ') + '...';
    }
  }
  ngAfterViewInit() {
    //   // Initialize the active tab on load
    this.setupIntersectionObserver();
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
  hideMobileFooter = false;

  @HostListener('window:scroll', ['$event']) isScrolledIntoView() {
    if (this.checkAvailabilityButton) {
      const rect =
        this.checkAvailabilityButton.nativeElement.getBoundingClientRect();
      const topShown = rect.top >= 0 && rect.top < window.innerHeight;
      const bottomShown = rect.bottom > 0 && rect.bottom <= window.innerHeight;

      this.isTestDivScrolledIntoView = topShown && bottomShown;

      // Set hideMobileFooter based on visibility
      this.hideMobileFooter = this.isTestDivScrolledIntoView;
    }
  }

  ngOnInit(): void {
    const modal = document.getElementById('exampleModal2');

    if (modal) {
      this.renderer.listen(modal, 'shown.bs.modal', () => {
        this.isModalOpen = true;
        this.cdRef.detectChanges(); // تحديث واجهة المستخدم فورًا
      });

      this.renderer.listen(modal, 'hidden.bs.modal', () => {
        this.isModalOpen = false;
        this.cdRef.detectChanges(); // تحديث واجهة المستخدم فورًا
      });
    }
    this.activatedRoute.params.subscribe((params: any) => {
      this.packageID = params.id;
      this.loadData();
      this.getAbout();
    });
    this.authService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
  }

  loadData(): void {
    this.getActivityById(this.packageID);
  }

  getActivityById(packageID: any) {
    this.httpService
      .get(environment.marsa, `package/details/` + packageID)
      .subscribe((res: any) => {
        this.rows = res?.PackageDetails;
        this.relatedtrips = res.Relatedtrips;
        // this.faq=res?.PackageDetails?.faq;

        this.activatedRoute.params.subscribe((params: any) => {
          if ('name' in params) {
            this.router.navigate([
              '/',
              localStorage.getItem('lang'),
              'packages',
              params.id,
              res?.PackageDetails.slugUrl,
            ]);
          }
        });
        this.duration = this.rows.duration;
        if (this.rows) {
          this.titleService.setTitle(this.rows?.MetaTitle);

          this.metaService.addTags([
            { name: 'description', content: this.rows?.MetaDesc },
          ]);
          const canonicalURL = this.rows?.CanonicalUrl;
          if (canonicalURL) {
            this.seoService.setCanonicalURL(canonicalURL);
          }
        }
        this.duration = res?.PackageDetails.duration;
        this.calculateEndDate();
      });
  }
  hasDiscount(packageData: any): boolean {
    // Check if a discount is present for adults
    return packageData?.Price?.AdultDiscount > 0;
  }

  calculateDiscountedPrice(price: number, discount: number): number {
    // Calculate the discounted price
    return Math.round(price - (discount / 100) * price);
  }

  calculateEndDate2() {
    if (!this.startDate || !this.duration) {
      return;
    }

    const durationParts = this.duration.split(' ');
    const durationValue = parseInt(durationParts[0], 10);
    const durationUnit = durationParts[1].toLowerCase();

    const endDate = new Date(this.startDate);

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

    this.endDate = endDate;
    console.log(this.endDate);

    const formattedEndDate = this.datePipe.transform(
      this.endDate,
      'yyyy/MM/dd'
    );
    this.formattedEndDate = formattedEndDate;
  }

  onStartDateChange2(event: MatDatepickerInputEvent<Date>) {
    this.startDate = event.value;
    this.calculateEndDate();
    if (this.startDate) {
      this.selectedDateControl.setValue(this.startDate);
      const formattedStartDate = this.datePipe.transform(
        this.startDate,
        'yyyy/MM/dd'
      );
      this.formattedStartDate = formattedStartDate;
    } else {
      this.selectedDateControl.setValue(null);
    }
    this.selectedDateControl.markAsTouched();
  }

  onStartDateChange(event: Date) {
    this.startDate = event;
    this.calculateEndDate();

    if (this.startDate) {
      this.selectedDateControl.setValue(this.startDate);
      const formattedStartDate = this.datePipe.transform(
        this.startDate,
        'yyyy/MM/dd'
      );
      this.formattedStartDate = formattedStartDate;
    } else {
      this.selectedDateControl.setValue(null);
    }
    this.selectedDateControl.markAsTouched();
  }

  calculateEndDate() {
    if (!this.startDate || !this.duration) {
      return;
    }

    const durationParts = this.duration.split(' ');
    const durationValue = parseInt(durationParts[0], 10);
    const durationUnit = durationParts[1].toLowerCase();

    const endDate = new Date(this.startDate);

    switch (durationUnit) {
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

    this.endDate = endDate;
    console.log(this.endDate);

    const formattedEndDate = this.datePipe.transform(
      this.endDate,
      'yyyy/MM/dd'
    );
    this.formattedEndDate = formattedEndDate;
  }

  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
    return date ? date >= today : false; // Allow only today and future dates
  };

  getAbout() {
    this.httpService.get(environment.marsa, 'Aboutus').subscribe({
      next: (response: any) => {
        this.Why_chosse_us = response.Why_chosse_us;
      },
    });
  }

  // Increment the number of adults
  incrementAdult() {
    if (this.adults < this.getMaxValue('adultsMax')) {
      this.adults++;
    } else {
      this.toastr.info(
        `Sorry, you cannot exceed the maximum limit of ${this.getMaxValue(
          'adultsMax'
        )}. Please adjust the number.`,
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

  // Decrement the number of adults
  decrementAdult() {
    if (this.adults > 1) {
      this.adults--;
    }
  }

  incrementChildren() {
    if (this.children < this.getMaxValue('childrenMax')) {
      this.children++;
    } else {
      this.toastr.info(
        `Sorry, you cannot exceed the maximum limit of ${this.getMaxValue(
          'childrenMax'
        )}. Please adjust the number.`,
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

  decrementChildren() {
    if (this.children > 0) {
      this.children--;
    }
  }

  incrementInfant() {
    if (this.infant < this.getMaxValue('infantsMax')) {
      this.infant++;
    } else {
      this.toastr.info(
        `Sorry, you cannot exceed the maximum limit of ${this.getMaxValue(
          'infantsMax'
        )}. Please adjust the number.`,
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

  decrementInfant() {
    if (this.infant > 0) {
      this.infant--;
    }
  }

  getMaxValue(category: string): number {
    if (this.rows && this.rows.Price) {
      switch (category) {
        case 'adultsMax':
          return this.rows.Price.AdultMax;
        case 'childrenMax':
          return this.rows.Price.childernMax; // Note the typo in "children"
        case 'infantsMax':
          return this.rows.Price.infantMax;
        default:
          return 0;
      }
    }
    return 0; // Return default value if rows or Price is not available
  }

  getRoundedRate(rate: number | null): number {
    if (rate !== null && !isNaN(Number(rate))) {
      return parseFloat(Number(rate).toFixed(1));
    } else {
      return 0;
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

  onStarHover(starNumber: number) {
    this.selectedStar = starNumber;
  }

  onStarClick(starNumber: number) {
    this.starNumber = starNumber;
  }

  openImageSliderModal(): void {
    const dialogRef = this.dialog.open(ImageSliderModalComponent, {
      width: '60%',
    });
    dialogRef.componentInstance.images = this.happyGuestImages;
  }

  addReview(): void {
    const model = {
      package_id: this.rows?.id,
      rating: this.starNumber,
      comment: this.comment,
      trip_id: 0,
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
        this.httpService
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

  checkPrice() {
    if (this.selectedDateControl.invalid) {
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

        this.modalService.dismissAll();
        setTimeout(() => {
          this.modalService.dismissAll();
          document.body.classList.remove('modal-open');
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach((backdrop) => backdrop.remove());
        }, 300);
      } else {
        const model = {
          packege_id: this.packageID,
          adult: this.adults,
          childern: this.children,
          infant: this.infant,
        };

        this.httpService
          .post(environment.marsa, 'package/price', model)
          .subscribe({
            next: (res: any) => {
              const queryParams = {
                res: JSON.stringify(res),
                packege_id: this.packageID,
                adult: this.adults,
                childern: this.children,
                infant: this.infant,
                booking_date: this.formattedStartDate,
                end_date: this.formattedEndDate,
              };

              this.modalService.dismissAll();
              if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(
                  'queryParamsPackages',
                  JSON.stringify(queryParams)
                );
                this.modalService.dismissAll();
              }

              this.router.navigate(
                ['/', this.translate.currentLang, 'packages', 'packagePayment'],
                { queryParams }
              );
              this.modalService.dismissAll();
              setTimeout(() => {
                this.modalService.dismissAll();
                document.body.classList.remove('modal-open');
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach((backdrop) => backdrop.remove());
              }, 300);
            },
          });
      }
    }
  }

  getImageName(url: string): string {
    const imageName = url?.substring(
      url.lastIndexOf('/') + 1,
      url.lastIndexOf('.')
    );
    return imageName || 'Unknown photo';
  }

  openPackModal(packageId: number) {
    // const selectedPackage = this.rows.find((pkg: any) => pkg.id === packageId);
    const dialogRef = this.dialog.open(PackageSliderModalComponent, {
      width: '60%',
    });
    dialogRef.componentInstance.packages = this.rows.PackageTrips;
  }
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
