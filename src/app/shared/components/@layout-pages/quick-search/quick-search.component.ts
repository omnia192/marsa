import {
  Component,
  HostListener,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { DataService } from 'src/app/web-site/modules/transfer/dataService';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss'],
})
export class QuickSearchComponent {

  transferDetails:any;
  showSearch: string = 'tour';
  @Input() changeStyle: boolean = false;
  destination: any = [];
  placeTours: any;
  dateTours: any;
  adultsNumber = 1;
    adultsNumber2 = 1;
        adultsNumber3 = 1;


  childrenNumber = 1;
  infantNumber = 1;
  activeIndex = 0;
  @ViewChild('listmobile', { static: true }) listmobile: ElementRef | undefined;
  @ViewChild('tours', { static: true }) tours: ElementRef | undefined;
  @ViewChild('liveboard', { static: true }) liveaboard: ElementRef | undefined;
  @ViewChild('transfer', { static: true }) transfer: ElementRef | undefined;
  @ViewChild('boat', { static: true }) boat: ElementRef | undefined;

  selectedFromName: string | null = null;
  searchFrom: string = '';
  constructor(
    private httpService: HttpService,
    private router: Router,
    private translate: TranslateService,
        private toastr: ToastrService,
    private headerService: HeaderService,
private dataService: DataService,
        private _AuthService: AuthService,
  ) {}
  dropdownOpen = false;
  dropdownOpen2= false;
  dropdownOpen3= false;
  dropdownOpen4= false;
  filteredFromAirports: any[] = [];
  filteredFromHotels: any[] = [];
  filteredToOptions: any[] = [];
  fromId: string = '';
  toId: any;
  availableToOptions: any[] = [];
  searchTo: string = '';
  isLogin: boolean = false;
  selectedOptionName: string | null = null;
  date: string | null = null;
  minSelectableDate: Date = new Date();
  persons: number = 2;
  returnDate: any;

   ngOnInit(): void {
    this.httpService.get('marsa', 'place').subscribe({
      next: (res: any) => {
        this.destination = res.places;
      },
    });
      this.filteredFromAirports = this.transferDetails?.airports || [];
      this.filteredFromHotels = this.transferDetails?.hotel || [];
      this.filteredToOptions = [];
      this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
        this.isLogin = isAuth;
      });

      interface Review {
        rate: any;
      }
      this.httpService.get(environment.marsa, 'transfer').subscribe({
        next: (res: any) => {
          this.transferDetails = res;


        },
        error: (err) => {
          console.error('Error fetching transfer details', err);
        }
      });


    }
  filterFromOptions() {
    // Filter the airports based on the search term for "From"
    this.filteredFromAirports = this.transferDetails?.airports?.filter((airport: { name: string; }) =>
      airport.name.toLowerCase().includes(this.searchFrom.toLowerCase())
    );

    // Filter the hotels based on the search term for "From"
    this.filteredFromHotels = this.transferDetails?.hotel?.filter((hotel: { title: string; }) =>
      hotel.title.toLowerCase().includes(this.searchFrom.toLowerCase())
    );
  }
  selectFromOption(option: any) {
    if (option.name) {
      // If an airport is selected
      this.selectedFromName = option.name;
      this.fromId = option.id;
      // Show hotels in the second dropdown
      this.availableToOptions = this.transferDetails?.hotel || [];

      // Store the word "airport" in local storage


      localStorage.setItem('selectedFromType', 'airport');

    } else if (option.title) {
      // If a hotel is selected
      this.selectedFromName = option.title;
      this.fromId = option.id;
      // Show airports in the second dropdown
      this.availableToOptions = this.transferDetails?.airports || [];

      // Store the word "hotel" in local storage (if needed)

      localStorage.setItem('selectedFromType', 'hotel');

    }
    // Reset the search and filtered options for the second dropdown
    this.searchTo = '';
    this.filterToOptions();
  }
  onDateSelect(selectedDate: Date): void {
    // تنسيق التاريخ بالشكل المطلوب: "20 June, 2025"
    const day = selectedDate.getDate();
    const month = selectedDate.toLocaleString('default', { month: 'long' });
    const year = selectedDate.getFullYear();

    // تخزين التاريخ بالتنسيق المطلوب للعرض
    const formattedDisplayDate = `${day} ${month}, ${year}`;

    // تخزين التاريخ بتنسيق YYYY-MM-DD للاستخدام في API
    this.date = this.formatDateToYYYYMMDD(selectedDate);

    console.log('Selected date (display):', formattedDisplayDate);
    console.log('Selected date (API format):', this.date);
  }
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  filterToOptions() {
    // Filter the options (airports or hotels) in the second dropdown based on the search term for "To"
    this.filteredToOptions = this.availableToOptions?.filter(option =>
      (option.name || option.title).toLowerCase().includes(this.searchTo.toLowerCase())
    );
  }
  selectOption(option: any) {
    if (option.name) {
      this.selectedOptionName = option.name; // If an airport is selected
    } else if (option.title) {
      this.selectedOptionName = option.title; // If a hotel is selected
    }
    this.toId = option.id;
  }
  increase() {
    this.persons++;
  }

  decrease() {
    if (this.persons <= 0) {
      this.persons = 0;
    } else {
      this.persons--;
    }
  }
  increaseAdults(event: Event) {
  event.stopPropagation();
  if (this.adultsNumber < 10) {
    this.adultsNumber++;
  }
}



decreaseAdults(event: Event) {
  event.stopPropagation();
  if (this.adultsNumber > 0) {
    this.adultsNumber--;
  }
}
decreaseAdults2(event: Event) {
  event.stopPropagation();
  if (this.adultsNumber2 > 0) {
    this.adultsNumber2--;
  }
}
increaseAdults2(event: Event) {
  event.stopPropagation();
  if (this.adultsNumber2 < 10) {
    this.adultsNumber2++;
  }
}
decreaseAdults3(event: Event) {
  event.stopPropagation();
  if (this.adultsNumber2 > 0) {
    this.adultsNumber2--;
  }
}
increaseAdults3(event: Event) {
  event.stopPropagation();
  if (this.adultsNumber2 < 10) {
    this.adultsNumber2++;
  }
}


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const dropdownElement = document.querySelector('.dropdown');
    if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
      this.dropdownOpen = false;
      this.dropdownOpen2 = false;
      this.dropdownOpen3 = false;
      this.dropdownOpen4 = false;
    }
  }
  toggleDropdown2() {
    this.dropdownOpen2 = !this.dropdownOpen2;
  }
  toggleDropdown3() {
    this.dropdownOpen3 = !this.dropdownOpen3;
  }
  toggleDropdown4() {
    this.dropdownOpen4 = !this.dropdownOpen4;
  }

  showSearchForm(value: string) {
    this.showSearch = value;
    this.scrollToActive(value);
  }
  selectedCategory: string = 'adults';
  onSelectionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
  }

  getCurrentTabLabel(): string {
    switch (this.showSearch) {
      case 'tour':
        return 'Tours & Activities';
      case 'liveboard':
        return 'Liveaboard';
      case 'boat':
        return 'Boat';
      case 'transfer':
        return 'Transfer';
      default:
        return '';
    }
  }

  selectTab(tab: string) {
    this.showSearchForm(tab);
  }


  scrollToActive(value: any) {
    let activeElement: any;
    if (value == 'tour') {
      activeElement = this.tours!.nativeElement;
    } else if (value == 'liveboard') {
      activeElement = this.liveaboard!.nativeElement;
    } else if (value == 'boat') {
      activeElement = this.boat!.nativeElement;
    } else {
      activeElement = this.transfer!.nativeElement;
    }
    const containerElement = this.listmobile!.nativeElement;
    const activeElementLeft = activeElement.offsetLeft;
    const activeElementWidth = activeElement.offsetWidth;
    const containerScrollLeft = containerElement.scrollLeft;
    const containerWidth = containerElement.clientWidth;

    const activeElementRight = activeElementLeft + activeElementWidth;
    const containerRightEdge = containerScrollLeft + containerWidth;
    if (activeElementLeft < containerScrollLeft) {
      containerElement.scrollLeft = activeElementLeft - 120;
    } else if (activeElementRight > containerRightEdge) {
      containerElement.scrollLeft = activeElementRight - containerWidth + 120;
    }
  }
  seePrice() {
    if (!this.isLogin) {
      this.toastr.info('Please login first ', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      this.headerService.toggleDropdown();
      return;
    }

    if (this.fromId == undefined || this.toId == undefined) {
      this.toastr.info('Please choose the location first ', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      return;
    }


    if (!this.date || this.date.trim() === '')
      {
      this.toastr.info('Please enter date ', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      return;
    }

    else {
      let body: any = {
        from_id: this.fromId,
        to_id: this.toId,
        date: this.date,
        person: this.persons,
      };

      Object.keys(body).forEach(
        (k: any) => (body[k] === '' || body[k] === null) && delete body[k]
      );


      localStorage.setItem('bookdetail', JSON.stringify(body));
      localStorage.setItem('returnDate', this.returnDate || '');



      this.httpService.post(environment.marsa, 'transfer/get/car', body).subscribe({
        next: (res: any) => {
          this.dataService.setResponseData(res);
          localStorage.setItem('responseData', JSON.stringify(res));
          this.router.navigate(['/', this.translate.currentLang, 'transfer', 'multi-step']);
        },
        error: (err) => {
          console.error('Error:', err);
          this.toastr.warning(err.error?.error || 'An error occurred while ordering, please try again.');
        }
      });
    }

  }

  setplace(ev: any) {
    this.placeTours = ev.target.value;
  }

  setDate(ev: any) {
    this.dateTours = ev.target.value;
  }

  search(route: any) {
    this.router.navigate([this.translate.currentLang + route], {
      queryParams: { place_id: this.placeTours, date: this.dateTours },
    });
  }
}
