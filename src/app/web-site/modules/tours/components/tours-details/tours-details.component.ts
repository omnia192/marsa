import {
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  TemplateRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from '../../../../../core/services/http/http.service';
import { environment } from '../../../../../../environments/environment.prod';
import { ImageSliderModalComponent } from '../../../../../shared/sliders/image-slider-modal/image-slider-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BoatSliderModalComponent } from '../../../../../shared/sliders/boat-slider-modal/boat-slider-modal.component';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../../../shared/services/auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { HeaderService } from '../../../../../shared/services/header.service';
import { CheckAvailpiltyComponent } from '../check-availpilty/check-availpilty.component';
import { SEOService } from '../../../../../shared/services/seo.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  CUSTOM_DATE_FORMATS,
  CustomDateAdapter,
} from 'src/app/shared/components/Date/custom-date-adapter';
import { Galleria } from 'primeng/galleria';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Meta, Title } from '@angular/platform-browser';
// Define the participant types and their corresponding properties
type ParticipantType = 'adults' | 'children' | 'infant';
@Component({
  selector: 'app-tours-details',
  templateUrl: './tours-details.component.html',
  styleUrls: ['./tours-details.component.scss'],
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
export class ToursDetailsComponent implements AfterViewInit {
  today = new Date();

  activityID: any;
  isMobile = false;
  activityData: any;
  relatedtrips: any[] = [];
  showMapFrame: boolean = false;
  googleIframe!: SafeHtml;
  availableOptionMap!: SafeHtml;
  Why_chosse_us: any;
  cover: any;
  images: any[] = [];
  coverAndImages: any[] = [];
  boatImages: any[] = [];
  happyGustImages: any[] = [];
  remainingImages: string[] = [];
  showSeeMore: boolean = false;
  videoBoatUrl!: SafeHtml;
  dataCheck: any;
  bookedOptionId: any;
  videoUrl!: SafeResourceUrl;
  selectedImage: string | null = null;
  selectedOption: string = 'collective';
  @ViewChild('videoModal') videoModal!: TemplateRef<any>;
  @ViewChild('videoBoatModal') videoBoatModal!: TemplateRef<any>;
  @ViewChild('checkAvailabilityButton') checkAvailabilityButton!: ElementRef;
  @ViewChild('videoElement', { static: true })
  videoElement: ElementRef<HTMLVideoElement> | null = null;
  isTestDivScrolledIntoView: any;
  showAllReviews: boolean = false;
  isLogin: boolean = false;
  activeTabId: string | null = null;
  selectedDateControl = new FormControl('', Validators.required);
  selectedTimeControl = new FormControl('', Validators.required);
  timePickerStep: number = 1;
  availabilityChecked: boolean = false;
  adults: number = 1;
  children: number = 0;
  infant: number = 0;
  isShow = false;
  formattedDate: any;
  selectedTime: any;
  selectedStar: number = 0;
  starNumber: any = null;
  comment: any = null;
  isSingleImage: boolean = false;
  showBookingOption = false;
  hideMobileFooter = false;
  imageStyles = {
    width: '100%',
    height: '265px',
  };
  desplayedGustImages: any[] = [];
  displayBasic: boolean = false;
  displayBoats: boolean = false;
  displayCustom: boolean = false;

  activeIndex: number = 0;
  items: any[] = [];
  pagedItems: any[] = [];
  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = event.first + event.rows;
    this.pagedItems = this.items.slice(startIndex, endIndex);
  }
  @ViewChild('galleria') galleria: Galleria | undefined;
  constructor(
    private _httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    public translate: TranslateService,
    private el: ElementRef,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private _AuthService: AuthService,
    private headerService: HeaderService,
    private seoService: SEOService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: any,
    private cd: ChangeDetectorRef
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
  getImageName(url: string): string {
    const imageName = url?.substring(
      url.lastIndexOf('/') + 1,
      url.lastIndexOf('.')
    );
    return imageName || 'Unknown photo';
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
    const words = this.activityData?.Description?.split(' ');
    if (this.showFullDescription || words?.length <= 150) {
      return this.activityData?.Description;
    } else {
      return words?.slice(0, 150).join(' ') + '...';
    }
  }

  @ViewChild('myDiv') myDiv!: ElementRef;

  scrollToTop() {
    this.myDiv?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  ngAfterViewInit() {
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.style.width = '100%';
      this.videoElement.nativeElement.style.height = '100%';
    }
    this.setupIntersectionObserver();
  }

  scrollTo(tabId: string, tab?: boolean, index?: number) {
    console.log(index);

    if (tab && index !== 0) {
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
      return;
    }
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
      return 0.5; // default threshold
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        console.log(this.activeTabId);
        console.log(visibleEntries);
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

  @HostListener('window:scroll', ['$event'])
  isScrolledIntoView() {
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

  responsiveOptions: any[] | undefined;
  imageClick(index: number) {
    this.desplayedGustImages = Array.from(
      Object.entries(this.happyGustImages)
    ).map(([key, value]) => ({ value }));

    this.activeIndex = index;
    this.displayCustom = true;
  }
  // constructor() {}
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
      this.activityID = params.id;

      this.loadData();
      this.getAbout();
    });
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
  }

  share() {
    window.navigator.share({
      title: this.activityData?.Name,
      url: this.router.url,
    });
  }

  loadData(): void {
    this.getActivityById(this.activityID);
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

  // Increment the number of adults
  incrementAdult() {
    if (this.selectedOption === 'collective') {
      const maxAdults = this.getFirstValue('AdultMax');
      if (this.adults < maxAdults) {
        this.adults++;
      } else {
        this.toastr.info(
          `Sorry, you cannot exceed the maximum limit of ${maxAdults} adults. Please adjust the number.`,
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
      this.adults++;
    }
  }

  decrementAdult() {
    const minAdults = this.getMinValue('Adultmin');
    if (this.selectedOption === 'collective') {
      if (this.adults > minAdults) {
        this.adults--;
      } else {
        this.toastr.info(
          `Sorry, the minimum required number of adults is ${minAdults}. Please adjust the number.`,
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
      if (this.adults <= this.getFirstValue('AdultMax')) {
        this.toastr.info(
          `Sorry, the minimum required number of adults is ${this.getFirstValue(
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
      } else {
        this.adults--;
      }
    }
  }

  incrementChildren() {
    const maxChildren = this.getFirstValue('childernMax');
    if (this.children < maxChildren) {
      this.children++;
    } else {
      this.toastr.info(
        `Sorry, you cannot exceed the maximum limit of ${maxChildren} children. Please adjust the number.`,
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
    const minChildren = this.getMinValue('childernmin');
    if (this.children > minChildren) {
      this.children--;
    } else {
      this.toastr.info(
        `Sorry, the minimum required number of children is ${minChildren}. Please adjust the number.`,
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

  incrementInfant() {
    const maxInfants = this.getFirstValue('infantMax');
    if (this.infant < maxInfants) {
      this.infant++;
    } else {
      this.toastr.info(
        `Sorry, you cannot exceed the maximum limit of ${maxInfants} infants. Please adjust the number.`,
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
    const minInfants = this.getMinValue('infantmin');
    if (this.infant > minInfants) {
      this.infant--;
    } else {
      this.toastr.info(
        `Sorry, the minimum required number of infants is ${minInfants}. Please adjust the number.`,
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

  toggle(): void {
    this.isShow = !this.isShow;
  }

  scrollToCheckAvailabilityButton() {
    if (this.checkAvailabilityButton) {
      // Get the position of the button
      const rect =
        this.checkAvailabilityButton.nativeElement.getBoundingClientRect();
      const scrollToY = rect.top + window.scrollY - 70; // Adjusting 50px from the top

      // Smoothly scroll to the adjusted position
      window.scrollTo({
        top: scrollToY,
        behavior: 'smooth',
      });
    }
    this.hideMobileFooter = false;
  }
  disabledDays: number[] = [];
  showNavigation: any;
  getActivityById(activityID: any) {
    this._httpService
      .get(environment.marsa, `Activtes/details/` + activityID)
      .subscribe((res: any) => {
        this.activityData = res?.tripDetails;
        this.items = this.activityData?.Reviwe.reverse();
        console.log(this.activityData);

        this.activatedRoute.params.subscribe((params: any) => {
          if ('name' in params) {
            this.router.navigate([
              '/',
              localStorage.getItem('lang'),
              'tours',
              params.id,
              res?.tripDetails.slugUrl,
            ]);
          }
        });
        this.adults = this.getMinValue('Adultmin');
        this.infant = this.getMinValue('infantmin');
        this.children = this.getMinValue('childernmin');
        this.disabledDays = this.getDisabledDays(
          this.activityData.TimeOfRepeat
        );
        this.googleIframe = this.sanitizer.bypassSecurityTrustHtml(
          this.activityData.Map
        );

        this.availableOptionMap = this.sanitizer.bypassSecurityTrustHtml(
          this.activityData.Map
        );
        this.images = Array.from(Object.entries(res?.tripDetails?.Images)).map(
          ([key, value]) => ({ value })
        );
        this.cover = { value: res?.tripDetails?.Cover };
        this.coverAndImages = [...this.images, this.cover];
        this.showNavigation = this.coverAndImages.length >= 5;

        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          res?.tripDetails?.Video
        );
        this.relatedtrips = res.Relatedtrips;
        this.happyGustImages = this.activityData?.HappyGust;

        this.remainingImages = this.activityData?.HappyGust.slice(1);

        const boat = this.activityData?.Boats.find(
          (boat: any) => boat.id === activityID
        );

        this.videoBoatUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          boat?.video
        );

        this.isSingleImage = this.images.length === 1;
        if (this.activityData?.MetaTitle) {
          this.titleService.setTitle(this.activityData.MetaTitle);
        }
        if (this.activityData) {
          this.metaService.addTags([
            { name: 'description', content: this.activityData?.MetaDesc },
          ]);
          const canonicalURL = this.activityData?.CanonicalUrl;
          if (canonicalURL) {
            this.seoService.setCanonicalURL(canonicalURL);
          }
        }
      });
  }
  // This function disables dates before today
  // Date filter function
  // Create an array for days to disable
  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return true; // Allow all dates if date is null
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to compare only dates

    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Check if the date is today or in the future and not in the disabled days
    return date >= today && !this.disabledDays.includes(day);
  };

  getAbout() {
    this._httpService.get(environment.marsa, 'Aboutus').subscribe({
      next: (response: any) => {
        this.Why_chosse_us = response.Why_chosse_us;
      },
    });
  }

  private dialogRef!: MatDialogRef<any>;

  // Method to open the modal
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
      width: '70%',
    });
    dialogRef.componentInstance.images = this.images;
  }

  openImageSliderModal(): void {
    // this.showSeeMore = true;
    const happyGustImages = Array.from(
      Object.entries(this.happyGustImages)
    ).map(([key, value]) => ({ value }));
    const dialogRef = this.dialog.open(ImageSliderModalComponent, {
      width: '100%',
    });
    dialogRef.componentInstance.images = happyGustImages;
  }

  openBoatSliderModal(boat: any): void {
    this.displayBoats = true;
    this.boatImages = Array.from(Object.entries(boat.images)).map(
      ([key, value]) => ({ value })
    );
  }

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

  toggleVisibility(item: any): void {
    item.showAnswer = !item.showAnswer;
  }
  getOverviewItems(overview: string): string[] {
    return overview.split('\n');
  }

  // showMap(): void {
  //   this.showMapFrame = !this.showMapFrame;
  // }

  onTimeSelection(time: string) {
    this.selectedTime = time;
  }
  getDayNameToNumber(day: string): number {
    const dayNameMappings: { [day: string]: number } = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    return dayNameMappings[day];
  }

  filterDates = (date: Date | null): boolean => {
    if (!date) {
      return false; // Disable empty date
    }

    const today = new Date(); // Get the current date
    today.setHours(0, 0, 0, 0);

    if (date <= today) {
      return date ? date >= today : false; // Disable past dates
    }

    const dayOfWeek = date.getDay();

    if (this.activityData?.TypeOfRepeat === 'w') {
      const selectedDays = this.activityData.TimeOfRepeat?.split('/').map(
        (day: string) => this.getDayNameToNumber(day)
      );
      return selectedDays.includes(dayOfWeek) && this.isTimeBeforeCutOff(date);
    }

    return this.isTimeBeforeCutOff(date);
  };

  isTimeBeforeCutOff = (date: Date): boolean => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const cutOffTime = this.activityData.CutOfTime;

    if (this.activityData.TypeOfRepeat === 'd') {
      return date >= new Date() && currentTime < cutOffTime;
    }

    return date >= new Date();
  };
  getTimeOptions = (): string[] => {
    const start = this.activityData.start;
    const end = this.activityData.end;
    let timeOfRepeat = this.activityData.TimeOfRepeat;

    if (this.activityData.TypeOfRepeat === 'h') {
      timeOfRepeat *= 60; // Convert hours to minutes
    } else if (this.activityData.TypeOfRepeat === 'm') {
      // TimeOfRepeat is already in minutes
      timeOfRepeat = this.activityData.TimeOfRepeat;
    }

    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);

    const timeOptions: string[] = [];

    let currentTime = startTime;
    while (currentTime <= endTime) {
      const time = currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      timeOptions.push(time);

      currentTime = new Date(currentTime.getTime() + timeOfRepeat * 60 * 1000); // Increment by TimeOfRepeat minutes
    }

    return timeOptions;
  };

  // Function to get disabled days from the TimeOfRepeat string
  private getDisabledDays(timeOfRepeat: string): number[] {
    const daysMap: { [key: string]: number } = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    // Get the days from timeOfRepeat and map them to their corresponding numbers
    const selectedDays = new Set(
      timeOfRepeat
        ?.split('/')
        .map((day) => daysMap[day.trim()])
        .filter((day) => day !== undefined)
    );

    // All days of the week
    const allDays = Object.values(daysMap);
    if (this.activityData?.TypeOfRepeat === 'w') {
      return allDays.filter((day) => !selectedDays.has(day));
    }
    // Return days that are not in the selectedDays set
    return [];
  }

  // في component.ts
  // تحديد التاريخ الأدنى مع استبعاد الأيام الممنوعة
  minAllowedDate: Date = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison

    // Ensure disabledDays is initialized
    if (!this.disabledDays || this.disabledDays.length === 0) {
      return today; // If no disabled days, allow today
    }

    // Find the first available date
    let currentDate = new Date(today);
    while (this.disabledDays.includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return currentDate; // Return the first allowed date
  })();

  addEvent2(event: MatDatepickerInputEvent<Date>): void {
    this.formattedDate = this.datePipe.transform(event.value, 'dd/MM/yyyy');
  }
  addEvent(date: Date) {
    this.formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  addAvailableOptions() {
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
      return;
    }
    if (this.selectedDateControl.invalid) {
      this.selectedDateControl.markAsTouched();
      return;
    }

    this.availabilityChecked = true;

    const now = new Date();
    const cutoffTimeInMillis = this.activityData.CutOfTime * 60 * 60 * 1000;

    // Function to check if the selected date is after a certain cutoff
    const isDateAfterCutoff = (selectedDate: Date): boolean => {
      return selectedDate > new Date(now.getTime() + cutoffTimeInMillis);
    };

    // Parse the selected date
    const selectedDate = this.selectedDateControl.value
      ? new Date(this.selectedDateControl.value)
      : null;

    if (
      this.activityData?.TypeOfRepeat === 'w' ||
      this.activityData?.TypeOfRepeat === 'd'
    ) {
      if (selectedDate && isDateAfterCutoff(selectedDate)) {
      } else {
        this.showWarning(cutoffTimeInMillis);
        return;
      }
    } else {
      // Parse the selected date and time from the inputs
      const selectedDateValue = this.selectedDateControl.value; // Assume format "YYYY-MM-DD"
      const selectedTimeValue = this.selectedTimeControl.value; // Assume format "HH:mm AM/PM"

      // Combine selected date and time into a single Date object
      let selectedDateTime: Date | null = this.getSelectedDateTime(
        selectedDateValue ? new Date(selectedDateValue) : null,
        selectedTimeValue
      );

      if (selectedDateTime && isDateAfterCutoff(selectedDateTime)) {
      } else {
        this.showWarning(cutoffTimeInMillis);
        return;
      }
    }
    // if (this.validateParticipants()) return;
    if (!this.validateMinimumParticipants() || !this.validateParticipants()) {
      return; // Stop execution if any validation fails
    }

    this.bookNow(this.activityData?.AvailableOption[0]?.id);
    this.scrollTo('availableOptions');
  }

  private getSelectedDateTime(
    selectedDate: Date | null,
    selectedTimeValue: string | null
  ): Date | null {
    if (!selectedDate || !selectedTimeValue) return null;

    const { hours, minutes } = this.parseTimeTo24HourFormat(selectedTimeValue);
    selectedDate.setHours(hours, minutes, 0, 0); // Set hours and minutes
    return selectedDate;
  }

  // Function to parse time in "HH:mm AM/PM" format
  private parseTimeTo24HourFormat(time: string): {
    hours: number;
    minutes: number;
  } {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    // Adjust hours based on AM/PM
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
  }
  private showWarning(cutoffTimeInMillis: number) {
    this.toastr.warning(
      `You cannot book within ${this.activityData.CutOfTime} hours. Choose another date.`,
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

  bookNow(avilable_option_id: number, index?: number) {
    console.log(index);

    if (!this.availabilityChecked) {
      this.toastr.info(
        'Please choose a date and click on "Check availability" first.'
      );
      this.scrollToCheckAvailabilityButton();
      this.selectedDateControl.markAsTouched();
      return;
    }

    // if (this.validateParticipants()) return;
    if (!this.validateMinimumParticipants() || !this.validateParticipants()) {
      return; // Stop execution if any validation fails
    }

    if (this.bookedOptionId === avilable_option_id) {
      this.showBookingOption = !this.showBookingOption; // Toggle booking option
      // this.scrollTo('openOption' + avilable_option_id + index, true, index);
      const model = this.createBookingModel(avilable_option_id);
      this._httpService
        .post(environment.marsa, 'Activtes/AvailableOption/price', model)
        .subscribe({
          next: (res: any) => {
            this.dataCheck = this.createDataCheck(res, model);
            // this.showBookingOption = true;
          },
        });
    } else {
      this.scrollTo('openOption' + avilable_option_id + index, true, index);
      this.bookedOptionId = avilable_option_id;
      this.showBookingOption = true;

      const model = this.createBookingModel(avilable_option_id);
      this._httpService
        .post(environment.marsa, 'Activtes/AvailableOption/price', model)
        .subscribe({
          next: (res: any) => {
            this.dataCheck = this.createDataCheck(res, model);
          },
        });
    }
  }

  private validateParticipants(): boolean {
    console.log(this.selectedOption);

    const maxAdults = this.getFirstValue('AdultMax');
    const maxChildren = this.getFirstValue('childernMax');
    const maxInfant = this.getFirstValue('infantMax');

    const validationMessages = [
      { type: 'adults', max: maxAdults },
      { type: 'children', max: maxChildren },
      { type: 'infant', max: maxInfant },
    ];

    const participantCounts: Record<ParticipantType, number> = {
      adults: this.adults,
      children: this.children,
      infant: this.infant,
    };

    for (const { type, max } of validationMessages) {
      if (this.selectedOption === 'privete') {
        return true;
      }
      if (participantCounts[type as ParticipantType] > max) {
        this.toastr.info(
          `Sorry, you cannot exceed the maximum limit of ${type} is ${max}. Please adjust the number.`,
          '',
          {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          }
        );
        return false;
      }
    }

    return true;
  }
  private validateMinimumParticipants(): boolean {
    const minAdults = this.getMinValue('Adultmin');
    const minChildren = this.getMinValue('childernmin');
    const minInfant = this.getMinValue('infantmin');

    if (this.selectedOption === 'collective') {
      if (this.adults < minAdults) {
        this.toastr.info(
          `Sorry, the minimum required number of adults is ${minAdults}. Please adjust the number.`,
          '',
          {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          }
        );
        return false;
      }
    } else {
      if (this.adults < this.getFirstValue('AdultMax')) {
        this.toastr.info(
          `Sorry, the minimum required number of adults is ${this.getFirstValue(
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
        return false;
      }
    }

    const validationMessages = [
      { type: 'children', min: minChildren },
      { type: 'infant', min: minInfant },
    ];

    const participantCounts: Record<ParticipantType, number> = {
      children: this.children,
      adults: this.adults,
      infant: this.infant,
    };

    for (const { type, min } of validationMessages) {
      if (participantCounts[type as ParticipantType] < min) {
        this.toastr.info(
          `Sorry, the minimum required number of ${type} is ${min}. Please adjust the number.`,
          '',
          {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          }
        );
        return false;
      }
    }

    return true;
  }

  private getMinValue(property: string): number {
    let value = 0;
    if (this.selectedOption === 'collective') {
      value = this.getFirstAdultPrice()?.PriceColective[property] || 0;
    } else if (this.selectedOption === 'privete') {
      value = this.getFirstAdultPrice()?.PricePrivte[property] || 0;
    }
    return value;
  }

  private createBookingModel(avilable_option_id: number) {
    return {
      trip_id: this.activityData.id,
      avilable_option_id,
      class: this.selectedOption === 'collective' ? 'collective' : 'privete',
      adult: this.adults,
      childern: this.children,
      infant: this.infant,
    };
  }

  private createDataCheck(res: any, model: any) {
    return {
      res: JSON.stringify(res),
      trip_id: this.activityData.id,
      booking_date: this.formattedDate,
      class: model.class,
      time: this.selectedTime,
      avilable_option_id: model.avilable_option_id,
      adult: model.adult,
      childern: model.childern,
      infant: model.infant,
    };
  }

  showImage(img: string) {
    this.coverAndImages = [{ value: img }];
  }

  resetCoverAndImages() {
    this.coverAndImages = [];
  }

  changeOption(option: string) {
    this.adults = 1;
    this.selectedOption = option;
  }

  getFirstValue(property: string): number {
    let value = 0;
    if (this.selectedOption === 'collective') {
      value = this.getFirstAdultPrice()?.PriceColective[property] || 0;
    } else if (this.selectedOption === 'privete') {
      value = this.getFirstAdultPrice()?.PricePrivte[property] || 0;
    }
    return value;
  }

  getFirstAdultPrice(): any {
    if (
      !this.activityData ||
      !this.activityData.AvailableOption ||
      this.activityData.AvailableOption.length === 0
    ) {
      return null;
    }
    return this.activityData.AvailableOption[0];
  }

  onStarHover(starNumber: number) {
    this.selectedStar = starNumber;
  }

  onStarClick(starNumber: number) {
    this.starNumber = starNumber;
  }

  addReview(): void {
    const model = {
      trip_id: this.activityData?.id,
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
  addtoFavorits(btn: any, event: any) {
    if (btn.classList.contains('bg-primary')) {
    } else {
      // Add to favorites/wishlist
      this._httpService
        .post(environment.marsa, 'Wishlist/add', {
          trip_id: this.activityData?.id,
        })
        .subscribe({
          next: (res: any) => {
            event.target.classList.add('text-danger');
            event.target.classList.remove('text-black-50');
          },
        });
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
    autoplay: false,
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
  formatTimeTo12Hour(timeString: string): string {
    if (!timeString) return '';

    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);

    // Convert to 12-hour format
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const twelveHour = hourNum % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${twelveHour}:${minutes} ${period}`;
  }
}
