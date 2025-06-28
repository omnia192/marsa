import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss'],
})
export class StepThreeComponent implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  Coupons: boolean=false;
  total: any;
  coupon: any;
  price: any;
  kilometr: any;
  selected: boolean = true;
  formData: any = {};
  activeTab: string = 'pills-two-example2';
  payment_method: any;
  fromId: any;
  toId: any;
  person: any;
  carId: any;
  pickuptime: any;
  way: any;
  bookingTime: any;
  bookingDate: any;
  returnbookingtime: any;
  returnbookingdate: any;
  bookdetail: any;
  selectedCar: any;
  selectedOption: any = [{}];
  selectedOptionID: any = [];
  responseData: any;
  fromName: any;
  toName: any;
  formData1: any;
  flightNumper: any;
  numberOption: any;
  cardholderName: any;
  cvv: any;
  expirYear: any;
  expiryMonth: any;
  cardNumber: any;
  activeSection: any;
  SavedaddOnDetails: any;
  AllbookingOption: any;
  phoneNumber:any;
  countrycode:any;
  constructor(
    private _httpService: HttpService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit() {
    const addOnDetails = localStorage.getItem('Add-on-details');
    if (addOnDetails) {
      this.SavedaddOnDetails = JSON.parse(addOnDetails);
      this.kilometr = this.SavedaddOnDetails?.kilometer || '';
      this.person = this.SavedaddOnDetails.Numberofpeople || '';
      this.bookingTime = this.SavedaddOnDetails.booking_time || '';
      this.fromName = this.SavedaddOnDetails?.from || '';
      this.toName = this.SavedaddOnDetails?.to || '';
      this.price = this.SavedaddOnDetails?.Subtotal || '';
      this.total = this.SavedaddOnDetails?.Total || '';
      // this.returnbookingdate = this.SavedaddOnDetails?.return_booking_date || '';
      this.returnbookingtime =
        this.SavedaddOnDetails?.return_booking_time || null;
      this.AllbookingOption = this.SavedaddOnDetails?.Option || [];
      //this.bookingDate=this.SavedaddOnDetails.booking_date || '';

      const bookingDateString = this.SavedaddOnDetails.booking_date || '';
      const dateString = this.SavedaddOnDetails?.return_booking_date || '';
      if (dateString || bookingDateString) {
        if (dateString) {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          this.returnbookingdate = `${year}-${month}-${day}`;
        } else {
          this.returnbookingdate = '';
        }

        if (bookingDateString) {
          const date2 = new Date(bookingDateString);
          const year2 = date2.getFullYear();
          const month2 = String(date2.getMonth() + 1).padStart(2, '0');
          const day2 = String(date2.getDate()).padStart(2, '0');
          this.bookingDate = `${year2}-${month2}-${day2}`;
        } else {
          this.bookingDate = '';
        }
      } else {
        this.returnbookingdate = '';
        this.bookingDate = '';
      }

      console.log(this.bookingDate);
      console.log(this.returnbookingdate);
    }

    const bookingDetail = localStorage.getItem('bookdetail');
    if (bookingDetail) {
      this.bookdetail = JSON.parse(bookingDetail);
      this.fromId = this.bookdetail.from_id || '';
      this.toId = this.bookdetail.to_id || '';
    }
    const savedSelectedCar = localStorage.getItem('selectedCar');
    if (savedSelectedCar) {
      this.selectedCar = JSON.parse(savedSelectedCar);
      this.carId = this.selectedCar.id;
    }
    const savedSelectedOption = localStorage.getItem('selectedOptions');
    if (savedSelectedOption) {
      this.selectedOption = JSON.parse(savedSelectedOption);
    }
    const savedFlightNumper = localStorage.getItem('formData');
    if (savedFlightNumper) {
      this.formData1 = JSON.parse(savedFlightNumper);
      this.flightNumper = this.formData1?.flightNumber;
      this.phoneNumber=this.formData1?.phoneNumber;
      this.countrycode=this.formData1?.countrycode;
    }

    const savedResponseData = localStorage.getItem('responseData');
    if (savedResponseData) {
      this.responseData = JSON.parse(savedResponseData);
    }
    const savedSection = localStorage.getItem('activeSection');
    if (savedSection) {
      this.activeSection = savedSection;
    }
    this.way = localStorage.getItem('activeSection') || '';
    console.log('hiiii step 33333');
  }

  getImageName(url: string): string {
    const imageName = url?.substring(
      url.lastIndexOf('/') + 1,
      url.lastIndexOf('.')
    );
    return imageName || 'Unknown photo';
  }

  applycoupon() {
    const bookingOption = [];
    for (const key in this.selectedOption) {
      if (this.selectedOption.hasOwnProperty(key)) {
        const option = this.selectedOption[key];
        if (option && option.id) {
          bookingOption.push({
            id: option.id,
            persons: option.number,
          });
        }
      }
    }
    const model = {
      from_id: this.fromId,
      to_id: this.toId,
      person: this.person,
      car_id: this.carId,
      way: this.way,
      booking_time: this.bookingTime,
      booking_date: this.bookingDate,
      return_booking_time: this.returnbookingtime,
      return_booking_date: this.returnbookingdate,
      booking_option: bookingOption,
      flight_n: this.flightNumper,
      coupon_code: this.coupon,
    };

    this._httpService
      .post(environment.marsa, 'transfer/get/price', model)
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.Coupons =true;
            this.SavedaddOnDetails = res;
            this.kilometr = this.SavedaddOnDetails?.kilometer || '';
            this.person = this.SavedaddOnDetails.Numberofpeople || '';
            this.bookingTime = this.SavedaddOnDetails.booking_time || '';
            this.fromName = this.SavedaddOnDetails?.from || '';
            this.toName = this.SavedaddOnDetails?.to || '';
            this.price = this.SavedaddOnDetails?.Subtotal || '';
            this.total = this.SavedaddOnDetails?.Total || '';
            // this.returnbookingdate = this.SavedaddOnDetails?.return_booking_date || '';
            this.returnbookingtime =
              this.SavedaddOnDetails?.return_booking_time || null;
            this.AllbookingOption = this.SavedaddOnDetails?.Option || [];
            //this.bookingDate=this.SavedaddOnDetails.booking_date || '';

            const bookingDateString = this.SavedaddOnDetails.booking_date || '';
            const dateString =
              this.SavedaddOnDetails?.return_booking_date || '';
            if (dateString || bookingDateString) {
              if (dateString) {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                this.returnbookingdate = `${year}-${month}-${day}`;
              } else {
                this.returnbookingdate = '';
              }

              if (bookingDateString) {
                const date2 = new Date(bookingDateString);
                const year2 = date2.getFullYear();
                const month2 = String(date2.getMonth() + 1).padStart(2, '0');
                const day2 = String(date2.getDate()).padStart(2, '0');
                this.bookingDate = `${year2}-${month2}-${day2}`;
              } else {
                this.bookingDate = '';
              }
            } else {
              this.returnbookingdate = '';
              this.bookingDate = '';
            }

            console.log(this.bookingDate);
            console.log(this.returnbookingdate);
          }
          console.log(res);
        },
        error: (err: any) => {
          this.Coupons=false
          this.spinner.hide();
          this.toastr.error(err.error.message);
          this.coupon = '';
          const model = {
            from_id: this.fromId,
            to_id: this.toId,
            person: this.person,
            car_id: this.carId,
            way: this.way,
            booking_time: this.bookingTime,
            booking_date: this.bookingDate,
            return_booking_time: this.returnbookingtime,
            return_booking_date: this.returnbookingdate,
            booking_option: this.AllbookingOption,
            flight_n: this.flightNumper,
          };
          this._httpService
            .post(environment.marsa, 'transfer/get/price', model)
            .subscribe({
              next: (res: any) => {
                if (res) {
                  this.SavedaddOnDetails = res;
                  this.kilometr = this.SavedaddOnDetails?.kilometer || '';
                  this.person = this.SavedaddOnDetails.Numberofpeople || '';
                  this.bookingTime = this.SavedaddOnDetails.booking_time || '';
                  this.fromName = this.SavedaddOnDetails?.from || '';
                  this.toName = this.SavedaddOnDetails?.to || '';
                  this.price = this.SavedaddOnDetails?.Subtotal || '';
                  this.total = this.SavedaddOnDetails?.Total || '';
                  // this.returnbookingdate = this.SavedaddOnDetails?.return_booking_date || '';
                  this.returnbookingtime =
                    this.SavedaddOnDetails?.return_booking_time || null;
                  this.AllbookingOption = this.SavedaddOnDetails?.Option || [];
                  //this.bookingDate=this.SavedaddOnDetails.booking_date || '';

                  const bookingDateString =
                    this.SavedaddOnDetails.booking_date || '';
                  const dateString =
                    this.SavedaddOnDetails?.return_booking_date || '';
                  if (dateString || bookingDateString) {
                    if (dateString) {
                      const date = new Date(dateString);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        '0'
                      );
                      const day = String(date.getDate()).padStart(2, '0');
                      this.returnbookingdate = `${year}-${month}-${day}`;
                    } else {
                      this.returnbookingdate = '';
                    }

                    if (bookingDateString) {
                      const date2 = new Date(bookingDateString);
                      const year2 = date2.getFullYear();
                      const month2 = String(date2.getMonth() + 1).padStart(
                        2,
                        '0'
                      );
                      const day2 = String(date2.getDate()).padStart(2, '0');
                      this.bookingDate = `${year2}-${month2}-${day2}`;
                    } else {
                      this.bookingDate = '';
                    }
                  } else {
                    this.returnbookingdate = '';
                    this.bookingDate = '';
                  }

                  console.log(this.bookingDate);
                  console.log(this.returnbookingdate);
                }
                console.log(res);
              },
            });
          // Swal.fire(err.error.message,
          //   'error'
          // ).then(() => {
          // });
        },
      });
    // this._httpService.get(environment.marsa, `Coupon`).subscribe((res: any) => {
    //   this.Coupons = res.coupon.filter((item: any) => item.code == this.coupon);
    //   if (this.Coupons.length > 0) {
    //     this.total = this.total - this.Coupons[0].amount;
    //   } else {
    //     console.warn('No matching coupons found');
    //   }
    // });
  }

  nextStep(): void {
    this.next.emit(this.formData);
  }

  previousStep(): void {
    this.previous.emit();
  }

  toggleSelected(): void {
    this.selected = !this.selected;
  }

  buttonDisabled = false;


  confirmBookingByCard() {
    const termsCheckbox = document.getElementById('termsCheckbox') as HTMLInputElement;
    if (!termsCheckbox.checked) {
      this.toastr.warning(
        'Please agree to the Terms and Conditions before proceeding.',
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

    if (!this.cardholderName || !this.cardNumber || !this.expiryMonth || !this.expirYear || !this.cvv) {
      this.toastr.info(
        'Please fill in all the required fields before confirming your booking.',
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

    if (this.buttonDisabled) {
      return;
    }

    this.buttonDisabled = true;

    const bookingOption = [];
    for (const key in this.selectedOption) {
      if (this.selectedOption.hasOwnProperty(key)) {
        const option = this.selectedOption[key];
        if (option && option.id) {
          bookingOption.push({
            id: option.id,
            persons: option.number,
          });
        }
      }
    }

    const model = {
      from_id: this.fromId,
      to_id: this.toId,
      person: this.person,
      car_id: this.carId,
      way: this.way,
      code: this.countrycode,
      phone: this.phoneNumber,
      booking_time: this.bookingTime,
      booking_date: this.bookingDate,
      return_booking_time: this.returnbookingtime || '',
      return_booking_date: this.returnbookingdate || '',
      payment_method: this.payment_method ? this.payment_method : 'tab',
      booking_option: bookingOption,
      flight_n: this.flightNumper,
      coupon_code: this.coupon,
      cardholder_name: this.cardholderName,
      cvv: this.cvv?.toString(),
      expiry_year: this.expirYear,
      expiry_month: this.expiryMonth,
      card_number: this.cardNumber?.toString(),
    };

    this._httpService.post(environment.marsa, 'transfer/book', model).subscribe({
      next: (res: any) => {
        this.buttonDisabled = false;

        if (res && res.link) {
          window.location.href = res.link;
        } else {
          const queryParams = { res: JSON.stringify(res) };
          this.router.navigate(
            ['/', this.translate.currentLang, 'transfer', 'confirm'],
            { queryParams }
          );
          Swal.fire(
            'Your Booking has been sent successfully.',
            'The Transfer official will contact you as soon as possible. For Future communication, please reach out to info@marsawaves.com',
            'success'
          );
        }
      },
      error: (err: any) => {
        console.error('Error during booking:', err);
        this.buttonDisabled = false;

        const errorMessage =
          err.error?.message ||
          'An error occurred while processing your booking. Please try again later.';
        Swal.fire('Booking Failed', errorMessage, 'error');
      },
      complete: () => {
        this.buttonDisabled = false;
      },
    });
  }

  confirmBooking() {
    const termsCheckbox = document.getElementById('termsCheckbox2') as HTMLInputElement;
    if (!termsCheckbox.checked) {
      this.toastr.warning(
        'Please agree to the Terms and Conditions before proceeding.',
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

    if (this.buttonDisabled) {
      return;
    }

    this.buttonDisabled = true;

    const bookingOption = [];
    for (const key in this.selectedOption) {
      if (this.selectedOption.hasOwnProperty(key)) {
        const option = this.selectedOption[key];
        if (option && option.id) {
          bookingOption.push({
            id: option.id,
            persons: option.number,
          });
        }
      }
    }

    const model = {
      from_id: this.fromId,
      to_id: this.toId,
      person: this.person,
      car_id: this.carId,
      way: this.way,
      code: this.countrycode,
      phone: this.phoneNumber,
      booking_time: this.bookingTime,
      booking_date: this.bookingDate,
      return_booking_time: this.returnbookingtime,
      return_booking_date: this.returnbookingdate,
      payment_method: this.payment_method ? this.payment_method : 'cash',
      booking_option: bookingOption,
      flight_n: this.flightNumper,
      coupon_code: this.coupon,
    };

    this._httpService.post(environment.marsa, 'transfer/book', model).subscribe({
      next: (res: any) => {
        this.buttonDisabled = false;

        if (res && res.link) {
          window.location.href = res.link;
        } else {
          const queryParams = { res: JSON.stringify(res) };
          this.router.navigate(
            ['/', this.translate.currentLang, 'transfer', 'confirm'],
            { queryParams }
          );
          Swal.fire(
            'Your Booking has been sent successfully.',
            'The Transfer official will contact you as soon as possible. For Future communication, please reach out to info@marsawaves.com',
            'success'
          );
        }
      },
      error: (err: any) => {
        console.error('Error during booking:', err);
        this.buttonDisabled = false;

        Swal.fire(
          'Booking Failed',
          'An error occurred while processing your booking. Please try again later.',
          'error'
        );
      },
      complete: () => {
        this.buttonDisabled = false;
      },
    });
  }





  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }
  goback() {
    this.router.navigate(['/', this.translate.currentLang, 'transfer']);
  }

  toggleTab(tabId: string, paymentMethod: string) {
    this.activeTab = tabId;
    this.payment_method = paymentMethod;
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
  }
  letterOnly(event: any) {
    var charCode = event.keyCode;


    if (
      (charCode > 64 && charCode < 91) || // A-Z
      (charCode > 96 && charCode < 123) || // a-z
      charCode === 8 || // Backspace
      charCode === 32 // Space
    ) {
      return true;
    } else {
      return false;
    }
  }

  public OnlyNumbers(event: any) {
    let regex: RegExp = new RegExp(/^[0-9]{1,}$/g);
    let specialKeys: Array<string> = [
      'Backspace',
      'Tab',
      'End',
      'Home',
      'ArrowRight',
      'ArrowLeft',
    ];
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    } else {
      if (regex.test(event.key)) {
        return true;
      } else {
        return false;
      }
    }
  }
}
