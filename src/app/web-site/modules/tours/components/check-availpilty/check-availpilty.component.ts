import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { environment } from 'src/environments/environment.prod';
import { format, parse, subHours } from 'date-fns';
@Component({
  selector: 'app-check-availpilty',
  templateUrl: './check-availpilty.component.html',
  styleUrls: ['./check-availpilty.component.scss'],
})
export class CheckAvailpiltyComponent {
  @Input() dataCheck: any;
  avilableOptions: any;
  activityData: any;
  tripId: any;
  googleIframe!: SafeHtml;
  showMapFrame: boolean = false;
  isLogin: boolean = false;
  booking_date: any;
  class: any;
  selectedTime: any;
  time: any;
  avilable_option_id: any;
  adult: any;
  childern: any;
  infant: any;
  showLoginForm: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private _httpService: HttpService,
    private sanitizer: DomSanitizer,
    private _AuthService: AuthService,
    private toastr: ToastrService,
    private headerService: HeaderService // @Inject(MAT_DIALOG_DATA) public data: any // public dialogRef: MatDialogRef<CheckAvailpiltyComponent>
  ) {}

  ngOnInit(): void {
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
  }

  ngOnChanges() {
    if (this.dataCheck) {
      const parsedRes = JSON.parse(this.dataCheck['res']);
      const trip_id = this.dataCheck['trip_id'];
      this.tripId = trip_id;
      this.avilableOptions = parsedRes;
      this.booking_date = this.dataCheck['booking_date'];

      this.class = this.dataCheck['class'];
      this.avilable_option_id = Number(this.dataCheck['avilable_option_id']);
      this.adult = this.dataCheck['adult'];
      this.childern = this.dataCheck['childern'];
      this.time = this.dataCheck['time'];
      this.infant = this.dataCheck['infant'];
      this.getTripById(this.tripId);
    }
  }
  formatDate(
    CancelationtTime: number,
    PickUpTime: string,
    selected_date: string
  ): string {
    if (!CancelationtTime || !PickUpTime || !selected_date) return '';

    // Parse the selected date (assuming format "DD/MM/YYYY")
    const [day, month, year] = selected_date.split('/').map(Number);
    const selectedDate = new Date(year, month - 1, day);

    // Parse the pickup time
    const [hours, minutes, seconds] = PickUpTime.split(':').map(Number);
    selectedDate.setHours(hours, minutes, seconds);

    // Subtract cancellation time (in hours) from the selected date
    const cancellationDate = new Date(selectedDate);
    cancellationDate.setHours(cancellationDate.getHours() - CancelationtTime);

    // Format the date in the desired way: "Sunday, 8 Jun, 2025 12:00 AM"
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', // "Sunday"
      day: 'numeric', // "8"
      month: 'short', // "Jun"
      year: 'numeric', // "2025"
      hour: 'numeric', // "12"
      minute: '2-digit', // "00"
      hour12: true, // "AM/PM"
    };
    return cancellationDate.toLocaleString('en-US', options);
  }
  subtract12Hours(dateString: any) {
    let [datePart, hourPart] = dateString.split(' ');
    let [day, month, year] = datePart.split('/').map(Number);
    let hour = Number(hourPart);

    // Create Date object in UTC to avoid timezone issues
    let date = new Date(year, month - 1, day, hour, 0); // Month is 0-based

    // Subtract 12 hours
    date.setHours(date.getHours() - 12);

    // Format output as "DD/MM/YYYY HH:mm"
    let newDay = String(date.getDate()).padStart(2, '0');
    let newMonth = String(date.getMonth() + 1).padStart(2, '0'); // Convert 0-based month
    let newYear = date.getFullYear();
    let newHour = String(date.getHours()).padStart(2, '0');

    return `${newDay}/${newMonth}/${newYear} ${newHour}:00`;
  }

  // Example usage
  // const inputDate = "26/02/2025 14:30"; // Input date with time
  // const result = subtract12Hours(inputDate);
  // console.log(result); // Output: "26/02/2025 02:30"

  // Example usage
  // const inputDate = "26/02/2025 14:30"; // Input date with time
  // const result = subtract12Hours(inputDate);
  // console.log(result); // Output: "26/02/2025 02:30"
  getAvailableOptionIndexById(id: number): number {
    if (this.activityData && this.activityData.AvailableOption) {
      return this.activityData.AvailableOption.findIndex(
        (option: any) => option.id === id
      );
    }
    return -1; // Return -1 if the array or id is not found
  }

  getTripById(activityID: any) {
    this._httpService
      .get(environment.marsa, `Activtes/details/` + activityID)
      .subscribe((res: any) => {
        this.activityData = res?.tripDetails;
        this.googleIframe = this.sanitizer.bypassSecurityTrustHtml(
          this.activityData.PlaceOnMap
        );
        if (
          this.activityData?.TypeOfRepeat === 'w' ||
          this.activityData?.TypeOfRepeat === 'd'
        ) {
          this.selectedTime =
            this.activityData?.AvailableOption[
              this.getAvailableOptionIndexById(this.avilable_option_id)
            ]?.PickUpTime;
        } else if (
          this.activityData?.TypeOfRepeat === 'h' ||
          this.activityData?.TypeOfRepeat === 'm'
        ) {
          const parts = this.time.split(' ');
          const timeParts = parts[0].split(':');
          let hours = parseInt(timeParts[0]);
          const minutes = parseInt(timeParts[1]);

          // Convert 12-hour time to 24-hour time if needed
          if (parts[1] === 'PM' && hours !== 12) {
            hours += 12;
          } else if (parts[1] === 'AM' && hours === 12) {
            hours = 0;
          }

          // Format the time as HH:mm:ss
          this.selectedTime = `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:00`;
        }
      });
  }

  showMap(): void {
    this.showMapFrame = !this.showMapFrame;
  }
  bookNow(): void {
    if (!this.isLogin) {
      // this.dialogRef.close();
      this.toastr.info('Please login first ', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      this.headerService.toggleDropdown();
    } else {
      // this.dialogRef.close();
      this.toastr.success('Please complete reservation cycle');
      const queryParams = {
        tripId: this.tripId,
        avilableOptions: JSON.stringify(this.avilableOptions),
        booking_date: this.booking_date,
        class: this.class,
        avilable_option_id: this.avilable_option_id,
        adult: this.adult,
        childern: this.childern,
        infant: this.infant,
        booking_time: this.selectedTime,
      };
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('queryParams', JSON.stringify(queryParams));
      }
      this.router.navigate(
        ['/', this.translate.currentLang, 'tours', 'payment'],
        { queryParams }
      );
    }
  }
}
