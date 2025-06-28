import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../../core/services/http/http.service';
import { environment } from '../../../../../../environments/environment.prod';
import { ImageSliderModalComponent } from '../../../../../shared/sliders/image-slider-modal/image-slider-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
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
import { CabinInfoModalComponent } from '../../../../../shared/sliders/cabin-info-modal/cabin-info-modal.component';
import { FormControl, Validators } from '@angular/forms';
import { HeaderService } from '../../../../../shared/services/header.service';
import { SEOService } from '../../../../../shared/services/seo.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-liveboard-details',
  templateUrl: './liveboard-details.component.html',
  styleUrls: ['./liveboard-details.component.scss'],
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
})
export class LiveboardDetailsComponent {
  @Output() bookNowClicked: EventEmitter<void> = new EventEmitter<void>();
  persons: number = 1;
  liveabourdID: any;
  activeTabId: string | null = null;
  liveabourdData: any;
  relatedtrips: any = [];
  flattenedCabin: any = [];
  showRelatedtrip: boolean = false;
  selectedStar: number = 0;
  starNumber: any = null;
  comment: any = null;
  availableOptionMap!: SafeHtml;
  Why_chosse_us: any;
  cover: string = '';
  images: any;
  coverAndImages: any;
  happyGustImages: any[] = [];
  remainingImages: string[] = [];
  showSeeMore: boolean = false;
  videoBoatUrl!: SafeHtml;
  videoUrl!: SafeHtml;
  isLogin: boolean = false;
  hideMobileFooter = false;
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
  isSingleImage: boolean = false;
  isMobile = false;
  isTestDivScrolledIntoView: any;
  showScrollToTopButton: boolean = false;
  schedules_id: any;
  desplayedGustImages: any[] = [];
  displayBasic: boolean = false;
  displayBoats: boolean = false;
  displayCustom: boolean = false;
  activeIndex: number = 0;
  boatImages: any[] = [];
  items: any[] = [];
  pagedItems: any[] = [];
  selectedOption: string = 'collective';
  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = event.first + event.rows;
    this.pagedItems = this.items.slice(startIndex, endIndex);
  }
  isScrolling: boolean = false;
  sections: string[] = [
    'overview',
    'itinerary',
    'cabin',
    'boat',
    'reviews',
    'faq',
    'important',
  ];
  activeSection: string = 'overview';
  private scrollTimeout: any;
  constructor(
    private el: ElementRef,
    private _httpService: HttpService,
    private sanitizer: DomSanitizer,
    public translate: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    // public dialogRef: MatDialogRef<LiveboardDetailsComponent>,
    private activatedRoute: ActivatedRoute,
    private _AuthService: AuthService,
    private cdr: ChangeDetectorRef,
    private _Router: Router,
    private headerService: HeaderService,
    private seoService: SEOService,
    private titleService: Title,
    private metaService: Meta
  ) {
    if (window.screen.width < 768) {
      this.isMobile = true;
    }
  }
  changeOption(option: string) {
    this.selectedOption = option;
  }

  @HostListener('document:scroll', ['$event'])
  isScrolledIntoView() {
    if (this.selectCabinButton) {
      const rect = this.selectCabinButton.nativeElement.getBoundingClientRect();
      const topShown = rect.top >= 0 && rect.top < window.innerHeight;
      const bottomShown = rect.bottom > 0 && rect.bottom <= window.innerHeight;

      this.isTestDivScrolledIntoView = topShown && bottomShown;

      if (this.isTestDivScrolledIntoView) {
        this.hideMobileFooter = true;
      } else {
        this.hideMobileFooter = false;
      }
    }
  }
  seeMore: boolean = false;
  showFullDescription = false;

  // Method to toggle description visibility
  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
    // No need to toggle seeMore; it can be derived from showFullDescription
  }
  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src =
        '../../../../../../assets/custom/user-dasboard/avatar-place.png';
    }
  }

  // Method to get the displayed description
  getDisplayedDescription(): string {
    const words = this.liveabourdData?.Description?.split(' ');
    if (this.showFullDescription || words?.length <= 150) {
      return this.liveabourdData?.Description;
    } else {
      return words?.slice(0, 150).join(' ') + '...';
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
    this.activatedRoute.params.subscribe((params: any) => {
      this.liveabourdID = params.id;
      this.loadData();
      this.getAbout();
    });
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
  }

  loadData(): void {
    this.getActivityById(this.liveabourdID);
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
    // Determine threshold based on activeId
    const getThreshold = (id: string | null) => {
      if (id === 'importantInformation') return 1;
      if (id === 'faq') return 0.01;
      return 0.1; // default threshold
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (visibleEntries.length > 0) {
          // Set activeTabId to the id of the first visible element
          this.activeTabId = visibleEntries[0].target.id;
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: getThreshold(this.activeTabId), // Use dynamic threshold
      }
    );

    const tabs = document.querySelectorAll('.tab-pane');
    tabs.forEach((tab) => {
      observer.observe(tab);
    });
  }

  ngAfterViewInit() {
    //   // Initialize the active tab on load
    this.setupIntersectionObserver();
  }
  scrollToselectCabinButton(schedule: any) {
    this.selectedDateControl.setValue(schedule);
    this.selectedSchedule = schedule.id;
    console.log(schedule);
    this.bookNow();
  }

  scrollToCabin() {
    this.selectCabinButton.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
   getFirstSchedule(item: any): any {
    if (item && item.Schedule && Array.isArray(item.Schedule) && item.Schedule.length > 0) {
      return item.Schedule[0];
    }
    return null;
  }
  shareLiveaboard(id: string) {
    window.navigator.share({
      title: this.liveabourdData?.Name,
      url: this.router.url,
    });
  }
  getOverviewItems(overview: string): string[] {
    return overview.split('\n');
  }
  formatCancellationTime(hours: string): string {
    let hour = Number(hours);
    if (!hour) return 'No data'; // Handle case where hour is null or undefined

    const years = Math.floor(hour / 8760); // 1 year = 8760 hour
    hour %= 8760; // Remaining hour after calculating years

    const months = Math.floor(hour / 720); // 1 month = 720 hour
    hour %= 720; // Remaining hour after calculating months

    const days = Math.floor(hour / 24); // 1 day = 24 hour
    const remainingHours = hour % 24; // Remaining hours after calculating days

    // Create an array to hold the strings
    const timeParts: string[] = [];

    if (years) timeParts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months) timeParts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days) timeParts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (remainingHours)
      timeParts.push(`${remainingHours} hour${remainingHours > 1 ? 's' : ''}`);

    return timeParts.join(' ') || 'Now'; // Return the formatted string or default if no time
  }
  getActivityById(liveabourdID: any) {
    this._httpService
      .get(environment.marsa, `liveboard/details/` + liveabourdID)
      .subscribe((res: any) => {
        this.liveabourdData = res?.tripDetails;
        this.items = this.liveabourdData?.Reviwe.reverse();

        console.log(this.liveabourdData);

        this.activatedRoute.params.subscribe((params: any) => {
          if ('name' in params) {
            this.router.navigate([
              '/',
              localStorage.getItem('lang'),
              'liveboard',
              params.id,
              res?.tripDetails?.slugUrl,
            ]);
          }
        });
        this.googleIframe = this.sanitizer.bypassSecurityTrustHtml(
          this.liveabourdData.PlaceOnMap
        );
        this.availableOptionMap = this.sanitizer.bypassSecurityTrustHtml(
          this.liveabourdData.Map
        );

        this.images = res?.tripDetails?.Images;
        this.cover = res?.tripDetails?.Cover;
        this.coverAndImages = [...this.images, this.cover];
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          res?.tripDetails?.Video
        );
        this.happyGustImages = this.liveabourdData?.HappyGust;

        this.remainingImages = this.liveabourdData?.HappyGust.slice(1);
        const boat = this.liveabourdData?.Boats.find(
          (boat: any) => boat.id === liveabourdID
        );
        this.videoBoatUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          boat?.video
        );
        if (res?.realatedtrip) {
          this.relatedtrips = res?.realatedtrip?.data;
          this.showRelatedtrip = true;
        }
        this.flattenedCabin = this.liveabourdData.cabin.reduce(
          (acc: any[], curr: any[]) => {
            return acc.concat(curr);
          },
          []
        );

        this.isSingleImage = this.images.length === 1;
        if (this.liveabourdData) {
          this.titleService.setTitle(this.liveabourdData?.MetaTitle);

          this.metaService.addTags([
            { name: 'description', content: this.liveabourdData?.MetaDesc },
          ]);
          const canonicalURL = this.liveabourdData?.CanonicalUrl;
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
    this.dialogRef = this.dialog.open(this.videoModal, {
      width: '100%',
      height: '70%',
    });
  }

  // Method to close the modal
  closeVideoModal(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  openMainImagesModal(): void {
    const dialogRef = this.dialog.open(ImageSliderModalComponent, {
      width: '100%',
    });
    dialogRef.componentInstance.images = Array.from(
      Object.entries(this.liveabourdData.Images)
    ).map(([key, value]) => ({ value }));
  }

  openImageSliderModal(): void {
    // this.showSeeMore = true;
    const dialogRef = this.dialog.open(ImageSliderModalComponent, {
      width: '60%',
    });
    dialogRef.componentInstance.images = this.happyGustImages;
  }

  openBoatSliderModal(boat: any): void {
    this.displayBoats = true;
    this.boatImages = Array.from(Object.entries(boat.images)).map(
      ([key, value]) => ({ value })
    );
  }

  openCabinSliderModal(cabin: any): void {
    const boatImages = cabin.images;
    const dialogRef = this.dialog.open(CabinInfoModalComponent, {
      width: '100%',
    });
    dialogRef.componentInstance.images = boatImages;
    dialogRef.componentInstance.data = cabin;
  }

  // Reference to the dialog
  private dialogRef!: MatDialogRef<any>;

  // Method to open the modal
  openVideoBoat(): void {
    this.dialogRef = this.dialog.open(this.videoBoatModal, {
      width: '100%',
      height: '70%',
    });
  }

  // Method to close the modal
  closeVideoBoatModal(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  incrementAdult() {
    if (this.selectedOption === 'collective') {
      if (this.persons < this.getValue('AdultMax')) {
        setTimeout(() => {
          this.persons++;
          this.cdr.detectChanges();
        });
      } else {
        this.toastr.info(
          `Sorry, you cannot exceed the maximum limit of ${this.getValue(
            'AdultMax'
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
    } else {
      if (this.persons < this.getValue('AdultMax')) {
        setTimeout(() => {
          this.persons++;
          this.cdr.detectChanges();
        });
      } else {
        this.toastr.info(
          `Sorry, you cannot exceed the maximum limit of ${this.getValue(
            'AdultMax'
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
  }

  decrementAdult() {
    if (this.selectedOption === 'collective') {
      if (this.persons >= 1) {
        setTimeout(() => {
          this.persons--;
          this.cdr.detectChanges();
        });
      } else {
        this.toastr.info(
          `Sorry, you cannot exceed the minimum cant be 1. Please adjust the number.`,
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
    } else {
      if (this.persons <= this.getValue('Adultmin')) {
        this.toastr.info(
          `Sorry, you cannot exceed the minimum limit of ${this.getValue(
            'Adultmin'
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
      } else {
        setTimeout(() => {
          this.persons--;
          this.cdr.detectChanges();
        });
      }
    }
  }

  getValue(key: any): any {
    if (this.selectedDateControl && this.selectedDateControl.value) {
      let value = 0;
      if (this.selectedOption === 'collective') {
        let data = this.liveabourdData.Schedules;

        return data.reduce(
          (max: number, item: { Available: number }) =>
            item.Available > max ? item.Available : max,
          -Infinity
        );
      } else if (this.selectedOption === 'privete') {
        return this.liveabourdData?.Priceprivet[key];
      }
      return value;
      // return this.selectedDateControl.value[key] || 0;
    }
    // return 0;
  }

  onSelectionChange(event: MatSelectChange): void {
    setTimeout(() => {
      this.persons = 1;
    });
  }

  onValueChange(event: any) {
    this.selectedSchedule = event.id;
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
  hasId(value: any): value is { id: string } {
    return typeof value === 'object' && 'id' in value;
  }
  bookNow() {
    if (this.selectedOption === 'collective') {
      if (this.persons >= 1) {
      } else {
        this.toastr.info(
          `Sorry, you cannot exceed the minimum cant be 1. Please adjust the number.`,
          '',
          {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          }
        );
        return;
      }
    } else {
      if (this.persons < this.getValue('Adultmin')) {
        this.toastr.info(
          `Sorry, you cannot exceed the minimum limit of ${this.getValue(
            'Adultmin'
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
        return;
      }
    }

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

        this.headerService.toggleDropdown();
      } else {
        if (this.hasId(this.selectedDateControl.value)) {
          this.schedules_id = this.selectedDateControl.value.id;
        }
        const model = {
          trip_id: this.liveabourdData.id,
          class: this.selectedOption,
          adult: this.persons,
          schedules_id: this.schedules_id,
        };
        console.log(this.selectedOption);

        this._httpService
          .post(environment.marsa, 'liveboard/cabin/price', model)
          .subscribe({
            next: (res: any) => {
              const queryParams = {
                res: JSON.stringify(res),
                trip_id: this.liveabourdData.id,
                class: this.selectedOption,
                adult: this.persons,
                schedules_id: this.schedules_id,
              };
              if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(
                  'queryParamsliveaboard',
                  JSON.stringify(queryParams)
                );
              }
              this._Router.navigate(
                [
                  '/',
                  this.translate.currentLang,
                  'liveboard',
                  'liveboard-payment',
                ],
                { queryParams }
              );
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
  addtoFavorits(btn: any, event: any) {
    if (btn.classList.contains('bg-primary')) {
    } else {
      // Add to favorites/wishlist
      this._httpService
        .post(environment.marsa, 'Wishlist/add', {
          trip_id: this.liveabourdData?.id,
        })
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
      trip_id: this.liveabourdData?.id,
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

  calculateSlideWidth(): string {
    if (this.images.length < 6) {
      return `${100 / this.images.length}%`;
    } else {
      return '16.66667%'; // Equal width for 6 items
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
    this.isModalOpen = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.isScrolling) return;

    // Debounce scroll events
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollThreshold = windowHeight * 0.3; // 30% of viewport height

      const sections = this.sections
        .map((section: string) => {
          const element = document.getElementById(section);
          if (!element) return null;

          const rect = element.getBoundingClientRect();
          const offset = rect.top + window.scrollY;
          const height = rect.height;
          const isVisible = rect.top <= scrollThreshold && rect.bottom >= 0;

          return {
            id: section,
            element,
            offset,
            height,
            isVisible,
            distanceFromTop: Math.abs(rect.top),
          };
        })
        .filter(Boolean);

      // Find the most visible section
      const currentSection = sections.reduce((closest: any, section: any) => {
        if (!section.isVisible) return closest;
        return section.distanceFromTop < closest.distanceFromTop
          ? section
          : closest;
      }, sections[0]);

      if (currentSection && this.activeSection !== currentSection.id) {
        this.activeSection = currentSection.id;
        // this.scrollToSection(currentSection.id);
      }
    }, 100); // Debounce time
  }

  scrollToSection(sectionId: string) {
    this.isScrolling = true;
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Increased offset for better positioning
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Reset scrolling flag after animation completes
      setTimeout(() => {
        this.isScrolling = false;
      }, 800); // Reduced timeout for better responsiveness
    }
  }
}
