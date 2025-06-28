import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DataService } from 'src/app/web-site/modules/transfer/dataService';
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})

export class StepOneComponent implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();

  responseData: any;
  selectedItemId: number | null = null;
  userDetails: any;
  phone: any;
  country_Code:any;
  phoneNumber: any;
  bookdetail: any;
  personCount = 0;
  selectedCarId: any;
  return_date: any;
  return_time: any;
  activeSection: any;
  Isairport: boolean = false;
  selectedCar: any = null;  // To store the selected car object
  details: any;
  email: any;
  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    center: false,
    dots: false,
    margin: 10,
    rtl: false,
    nav: true,
    navText: [
      '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
      '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  };

  formData: any = {
    from: '',
    from_id: '',
    to: '',
    flightNumber: '',
    phoneNumber: '',
    countrycode:'',
    date: '',
    pickuptime: '',
    personTotal: 0,
    specialRequirements: '',
    selectedCarId: null,
    email: ''

  };
  countries: any;
  picupDate: any;

  constructor(public translate: TranslateService, private toastr: ToastrService, private httpService: HttpService) { }
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      return emailPattern.test(control.value) ? null : { invalidEmail: { value: control.value } };
    };
  }
  ngOnInit() {

    // Fetch user details and country data
    this.httpService.get(environment.marsa, 'profile').subscribe((res: any) => {
      this.userDetails = res?.userDashboard;
      this.phone = this.userDetails?.overviwe?.phonenumber;
      this.email = this.userDetails?.overviwe?.email
      this.country_Code = this.userDetails?.overviwe?.countrycode;

      this.phoneNumber = '+' + this.userDetails?.overviwe?.countrycode + this.phone.replace(/\s/g, '');
      this.formData.phoneNumber = this.phoneNumber || '';
      this.formData.countrycode = this.country_Code || '';
      this.formData.email = this.email || '';

    });

    this.httpService.get(environment.marsa, 'countrycode').subscribe((res: any) => {
      this.countries = res;
    });

    // Retrieve saved data from localStorage

    const savedResponseData = localStorage.getItem('responseData');
    const bookingDetail = localStorage.getItem('bookdetail');
    const savedSelectedCar = localStorage.getItem('selectedCar');  // Retrieve selected car from localStorage
    this.return_date = localStorage.getItem('returnDate');
    const dateString = localStorage.getItem('returnDate') || '';

    if (dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      this.return_date = `${year}-${month}-${day}`;
    } else {
      this.return_date = '';
    }
    // this.return_time = localStorage.set('returnPickuptime');
    const savedSection = localStorage.getItem('activeSection');

    if (savedSection) {
      this.activeSection = savedSection;

    }
    const selectedFromType = localStorage.getItem('selectedFromType');
    if (selectedFromType === 'airport') {
      this.Isairport = true;

    }


    this.formData.from_id = this.details?.from_id || '';
    if (savedResponseData) {
      this.responseData = JSON.parse(savedResponseData);

    }
    if (bookingDetail) {
      this.bookdetail = JSON.parse(bookingDetail);

    }
    if (savedSelectedCar) {
      this.selectedCar = JSON.parse(savedSelectedCar);  // Load the saved car object
      this.formData.selectedCarId = this.selectedCar.id;  // Set the car ID in formData
    }

    this.formData.from = this.responseData?.booking?.from || '';
    this.formData.to = this.responseData?.booking?.to || '';
   this.formData.personTotal=this.bookdetail?.person;
    const PicupdateString = this.bookdetail?.date || '';


    if (PicupdateString) {
      const date = new Date(PicupdateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      this.formData.date  = `${year}-${month}-${day}`;
    } else {
      this.formData.date  = '';
    }
    if (this.responseData?.car && this.responseData.car.length > 0) {
      const firstCar = this.responseData.car[0];
      this.onCarClick(null, firstCar.id);
    }

  }

  onCountryChange(event: any) {
    if (event) {
      this.formData.countrycode = event.dialCode;
    }
  }
  onPhoneNumberChange(event: any) {
    if (event) {
      this.formData.phoneNumber = event.nationalNumber || ''; // حفظ الرقم بدون كود الدولة
    }
  }


  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }

  // Save selected car in local storage when a car is clicked
  onCarClick(event: any, carId: number): void {
    this.selectedCarId = carId;
    this.formData.selectedCarId = carId;

    const selectedCarObject = this.responseData?.car?.find((car: any) => car.id === carId);

    if (selectedCarObject) {
      this.selectedCar = selectedCarObject;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('selectedCar', JSON.stringify(this.selectedCar));
      }
    }
  }

 
  // Function to proceed to the next step
  saveFormData(form: NgForm): void {
    let hasError = false; // متغير لتتبع الأخطاء

    if (!form.valid) {
      this.toastr.info('Please enter all required fields.', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      hasError = true;
    }

    if (!this.selectedCarId) {
      this.toastr.info('Please choose a car before booking.', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      hasError = true;
    }

    if (!this.formData.pickuptime) {
      this.toastr.info('Please choose your pickup time.', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      hasError = true;
    }
    if (this.activeSection == 2){


     if( !this.return_time) {
      this.toastr.info('Please choose your return time.', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      hasError = true;
    }
  }

    if (!hasError) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('formData', JSON.stringify(this.formData));
        localStorage.setItem('returnPickuptime', this.return_time || '');
      }
      this.next.emit();
      window.scrollTo(0, 0);
    }
  }


  previousStep(): void {
    this.previous.emit();
  }
}
