import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from 'src/app/core/services/http/http.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MapModalComponent } from 'src/app/shared/components/@layout-pages/map-modal/map-modal.component';
import Swal from 'sweetalert2';
import { Code } from '../../context/code.interface';
import { Observable, map, startWith } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
  selectedNationality: any;
  isConfirmationStepEnabled: boolean = false;
  booking_date: any;
  class: any;
  avilableOptions: any;
  activityData: any;
  tripId: any;
  checkboxChecked: boolean = false;
  checkboxStatus: boolean[] = [];
  avilable_option_id: any;
  personsInputValues: number[] = [];
  adult: any;
  childern: any;
  infant: any;
  responseFromAvailableOption: any;
  time: any;
  userData: { id?: number; name?: string; phone?: string; email?: string } = {};
  customerForm!: FormGroup;
  payment_method: any;
  activeTab: string = 'pills-two-example2';
  filteredNationalities: Observable<Code[]> | undefined;
  showServices: boolean = true;
  coupon: any;
  Coupons: boolean = false;
  Total: any;
  nationalities!: Code[];
  cardholderName: any;
  cvv: any;
  expirYear: any;
  expiryMonth: any;
  cardNumber: any;
  // map
  @ViewChild('mapModalDeatails') mapModalDeatails: ElementRef | undefined;
  @ViewChild('stepper') stepper!: MatStepper;

  locationValue = '';
  latitudeValue: any;
  longitudeValue: any;

  

  mapModalOptions: any = {
    headerTitle: 'location',
    modalname: 'mapModalDeatails',
  };
  edit: boolean = false;
  tripletails: any;
  isDisable: boolean = false;
  Bookingid: any;
  constructor(
    private titleService: Title,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private _httpService: HttpService,
    private toastr: ToastrService,
    private _AuthService: AuthService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  @ViewChild('myDiv') myDiv!: ElementRef;
  scrollToTop() {
    this.myDiv?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  ngOnInit(): void {
    this.titleService.setTitle('Confirm Booking');
    this.initForm();
    this.edit = localStorage['editTour'];
    this.route.queryParams.subscribe((params: any) => {
      const parsedRes = JSON.parse(params['avilableOptions']);
      const trip_id = params['tripId'];
      this.tripId = trip_id;
      this.Bookingid = params.Bookingid;

      this.avilableOptions = parsedRes;
      const addetionalCost = this.avilableOptions?.AddetionalCost;

      this.Total = this.avilableOptions?.TotlaPrice;
      this.booking_date = params['booking_date'];
      this.class = params['class'];
      this.avilable_option_id = params['avilable_option_id'];
      this.time = params['booking_time'];
      this.adult = params['adult'];
      this.childern = params['childern'];
      this.infant = params['infant'];
      // this.getDataById(this.tripId);
    });
    this.activityData?.bookingOption.forEach(() =>
      this.checkboxStatus.push(false)
    );

    if (JSON.parse(localStorage['queryParams']).BookingInfo) {
      this.userData.name =
        JSON.parse(localStorage['queryParams']).BookingInfo.name || '';
      this.userData.phone =
        JSON.parse(localStorage['queryParams']).BookingInfo.Phone || '';
      this.userData.email =
        JSON.parse(localStorage['queryParams']).BookingInfo['E-mail'] || '';
      this.customerForm.patchValue(this.userData);
      console.log(this.userData);
      
      this.customerForm?.get('phone')?.patchValue('+' + this.userData.phone);
    } else {
      this._AuthService.getUserData().subscribe(
        (data: any) => {
          this.userData = JSON.parse(data); // Assigning the received object directly
          this.customerForm.patchValue(this.userData);
      console.log(this.userData);

          this.customerForm
            ?.get('phone')
            ?.patchValue('+' + this.userData.phone);
        },
        (error) => {
          // Handle error if needed
          console.error('Error:', error);
        }
      );
    }

    this.getNationality();
  }
  applycoupon() {
    const model = {
      trip_id: this.tripId,
      avilable_option_id: this.avilable_option_id,
      class: this.class,
      adult: this.adult,
      childern: this.childern,
      infant: this.infant,
      coupon_code: this.coupon,
      booking_option: this.activityData?.bookingOption.reduce(
        (acc: any[], item: any, index: number) => {
          if (this.checkboxStatus[index]) {
            acc.push({
              id: item.id,
              persons: this.personsInputValues[index] || 0,
            });
          }
          return acc;
        },
        []
      ),
    };
    this._httpService
      .post(environment.marsa, 'Activtes/AvailableOption/price', model)
      .subscribe({
        next: (res: any) => {
          this.responseFromAvailableOption = res;
          this.Total = this.responseFromAvailableOption.TotlaPrice;
          this.Coupons = true;
          //   this.Coupons[0]?.amount
          // : this.avilableOptions?.TotlaPrice - this.Coupons[0]?.amount;
          // console.log(this.Coupons.length);
        },
        error: (err: any) => {
          this.Coupons = false;
          this.toastr.error(err.error.message);
          this.coupon = '';
          const model2 = {
            trip_id: this.tripId,
            avilable_option_id: this.avilable_option_id,
            class: this.class,
            adult: this.adult,
            childern: this.childern,
            infant: this.infant,
            booking_option: this.activityData?.bookingOption.reduce(
              (acc: any[], item: any, index: number) => {
                if (this.checkboxStatus[index]) {
                  acc.push({
                    id: item.id,
                    persons: this.personsInputValues[index] || 0,
                  });
                }
                return acc;
              },
              []
            ),
          };
          this._httpService
            .post(environment.marsa, 'Activtes/AvailableOption/price', model2)
            .subscribe({
              next: (res: any) => {
                this.responseFromAvailableOption = res;
                this.Total = this.responseFromAvailableOption.TotlaPrice;
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
    //   this.Total = this.responseFromAvailableOption
    //     ? this.responseFromAvailableOption.TotlaPrice - this.Coupons[0]?.amount
    //     : this.avilableOptions?.TotlaPrice - this.Coupons[0]?.amount;
    // });
    // Coupon
  }
  onCountryChange(event: any) {
    console.log(event);
    console.log(this.customerForm.value);
    let x =
      '+' +
      event.dialCode +
      this.customerForm.value.phone.nationalNumber?.replace('-', '');
    this.customerForm?.get('phone')?.patchValue(x);
    console.log(x);
  }
  toggleTab(tabId: string, paymentMethod: string) {
    this.activeTab = tabId;
    this.payment_method = paymentMethod;
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
  }

  initForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      note: [''],
      pickup_point: ['', this.showServices ? [Validators.required] : []],
      locationValue: [''],
    });
  }
  getImageName(url: string): string {
    const imageName = url?.substring(
      url.lastIndexOf('/') + 1,
      url.lastIndexOf('.')
    );
    return imageName || 'Unknown photo';
  }
  ngAfterViewInit(): void {

    this.getDataById(this.tripId);
  }

  getDataById(activityID: any) {
    this._httpService
      .get(environment.marsa, `Activtes/details/` + activityID)
      .subscribe((res: any) => {
        this.activityData = res?.tripDetails;
        console.log(res?.tripDetails?.bookingOption.length);
      });
  }

  goBack() {
    localStorage.removeItem('editTour');
    localStorage.removeItem('queryParams');
    this.location.back();
  }

  // toggleCheckbox(event: Event, index: number) {
  //   this.checkboxStatus[index] = !this.checkboxStatus[index];
  //   const checkbox = event.target as HTMLInputElement;
  //   const input = document.getElementById(
  //     `persons-input-${index}`
  //   ) as HTMLInputElement;
  //   if (checkbox.checked) {
  //     input.classList.add('required');
  //   } else {
  //     input.classList.remove('required');
  //   }
  // }
  increaseValue(index: number) {
    this.personsInputValues[index] = (this.personsInputValues[index] || 0) + 1;
    this.toggleCheckboxByInput(index);
  }

  decreaseValue(index: number) {
    if (this.personsInputValues[index] > 0) {
      this.personsInputValues[index] -= 1;
    }
    this.toggleCheckboxByInput(index);
  }

  toggleCheckbox(event: Event, index: number) {
    this.checkboxStatus[index] = !this.checkboxStatus[index];
    const checkbox = event.target as HTMLInputElement;
    this.updateInputClass(index, checkbox.checked);
  }
  toggleCheckboxByInput(index: number) {
    if (this.personsInputValues[index] > 0) {
      this.checkboxStatus[index] = true;
    } else {
      this.checkboxStatus[index] = false;
    }
  }

  updateInputClass(index: number, isChecked: boolean) {
    const input = document.getElementById(
      `persons-input-${index}`
    ) as HTMLInputElement;
    if (isChecked) {
      input.classList.add('required');
    } else {
      input.classList.remove('required');
    }
  }

  getAvailableOptionIndexById(id: number): number {
    if (this.activityData && this.activityData.AvailableOption) {
      return this.activityData.AvailableOption.findIndex(
        (option: any) => option.id === id
      );
    }
    return -1;
  }

  isInputRequired(index: number): boolean {
    return this.checkboxChecked && !this.personsInputValues[index];
  }

  goToNextStep(stepper: MatStepper | undefined) {
    console.log(stepper);
    const missingValues = this.activityData?.bookingOption?.map(
      (item: any, index: number) =>
        this.checkboxStatus[index] && !this.personsInputValues[index]
    );

    if (missingValues.some((value: any) => value)) {
      this.toastr.info('Please enter the number of people ');
      return;
    }
    stepper?.next();
    this.scrollToTop();
    const model = {
      trip_id: this.tripId,
      avilable_option_id: this.avilable_option_id,
      class: this.class,
      adult: this.adult,
      childern: this.childern,
      coupon_code: this.coupon,
      infant: this.infant,
      booking_option: this.activityData?.bookingOption.reduce(
        (acc: any[], item: any, index: number) => {
          if (this.checkboxStatus[index]) {
            acc.push({
              id: item.id,
              persons: this.personsInputValues[index] || 0,
            });
          }
          return acc;
        },
        []
      ),
    };
    this._httpService
      .post(environment.marsa, 'Activtes/AvailableOption/price', model)
      .subscribe({
        next: (res: any) => {
          this.responseFromAvailableOption = res;
          this.Total = this.responseFromAvailableOption.TotlaPrice;
          // console.log(this.Coupons.length);
        },
      });
  }

  goToPayment(stepper: MatStepper) {
    if (!this.showServices) {
      this.locationValue = 'ddd';
    }

    // Update pickup_point validator based on showServices
    if (this.showServices) {
      this.customerForm
        .get('pickup_point')
        ?.setValidators([Validators.required]);
    } else {
      this.customerForm.get('pickup_point')?.clearValidators();
      this.customerForm.get('pickup_point')?.updateValueAndValidity();
    }

    // Adjusted conditional to handle TypeScript's type checking
    if (
      this.customerForm.valid &&
      this.locationValue &&
      this.locationValue != ''
    ) {
      stepper.next();
    } else {
      this.markFormGroupTouched(this.customerForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goToPreviousStep(stepper: MatStepper) {
    this.goBack();
    stepper.previous();
  }
  preventStepNavigation(stepper: MatStepper, stepIndex: number) {
    stepper.selectedIndex = stepIndex; // Set the selected index to the current step
  }
  getTripById(activityID: any) {
    this._httpService
      .get(environment.marsa, `Activtes/details/` + activityID)
      .subscribe((res: any) => {
        this.tripletails = res.tripDetails;
      });
  }
  confirmEdit(event: Event) {
    console.log(123);
    // Update pickup_point validator based on showServices
    if (this.showServices) {
      this.customerForm
        .get('pickup_point')
        ?.setValidators([Validators.required]);
    } else {
      this.customerForm.get('pickup_point')?.clearValidators();
      this.customerForm.get('pickup_point')?.updateValueAndValidity();
    }
    if (this.customerForm.valid) {
      const parts = this.booking_date?.split('/');
      const formattedDate = new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0])
      );

      // Format the date using DatePipe
      const formattedDateString = this.datePipe.transform(
        formattedDate,
        'yyyy/MM/dd'
      );
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code: code,
        trip_id: this.tripId,
        userid: this.userData?.id,
        avilable_option_id: this.avilable_option_id,
        class: this.class,
        adult: this.adult,
        childern: this.childern,
        infant: this.infant,
        booking_date: formattedDateString,
        payment_method: this.payment_method ? this.payment_method : 'cash',
        coupon_code: this.coupon,
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        booking_time: this.time,
        cardholder_name: this.cardholderName,
        cvv: this.cvv,
        expiry_year: this.expirYear,
        expiry_month: this.expiryMonth ? Number(this.expiryMonth) : null,
        card_number: this.cardNumber,
        booking_option: this.activityData?.bookingOption.reduce(
          (acc: any[], item: any, index: number) => {
            if (this.checkboxStatus[index]) {
              acc.push({
                id: item.id,
                persons: this.personsInputValues[index] || 0,
              });
            }
            return acc;
          },
          []
        ),
      };

      Object.keys(model).forEach(
        (k) => (model[k] == '' || model[k]?.length == 0) && delete model[k]
      );
      this._httpService
        .post(environment.marsa, 'bookinfo/' + this.Bookingid, model)
        .subscribe({
          next: (res: any) => {
            Swal.fire(
              'Your Booking has been send successfully.',
              'The Tour official will contact you as soon as possible. For Future communication, please reach out to info@marsawaves.com',
              'success'
            );

            localStorage.removeItem('editTour');
            localStorage.removeItem('queryParams');
            this.router.navigate(['/', this.translate.currentLang]);
            // }
          },
          error: (err: any) => {
            Swal.fire(
              'Booking Failed',
              'An error occurred while processing your booking. Please try again later.',
              'error'
            ).then(() => {
              this.goBack();
            });
          },
        });
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.markFormGroupTouched(this.customerForm);
    }
  }
  isLoading = false;

  confirmBookingByCard(event: Event) {
    this.isDisable = true;
    this.isLoading = true;

    const termsCheckbox = document.getElementById(
      'termsCheckbox'
    ) as HTMLInputElement;

    // Check if the terms and conditions checkbox is selected
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
      this.isDisable = false;
      this.isLoading = false;
      return; // Stop further execution
    }
    this.isDisable = true;
    if (
      this.cardholderName == undefined ||
      this.cardNumber == undefined ||
      this.expiryMonth == undefined ||
      this.expirYear == undefined ||
      this.cvv == undefined
    ) {
      this.toastr.info(
        'Please fill in all the required fields before confirming your booking. ',
        '',
        {
          disableTimeOut: false,
          titleClass: 'toastr_title',
          messageClass: 'toastr_message',
          timeOut: 5000,
          closeButton: true,
        }
      );
      this.isDisable = false;
      this.isLoading = false;
      return;
    }
    event.preventDefault();
    if (this.customerForm.valid) {
      const parts = this.booking_date.split('/');
      const formattedDate = new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0])
      );

      const formattedDateString = this.datePipe.transform(
        formattedDate,
        'yyyy/MM/dd'
      );
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code: code,
        trip_id: this.tripId,
        userid: this.userData?.id,
        avilable_option_id: this.avilable_option_id,
        class: this.class,
        adult: this.adult,
        childern: this.childern,
        infant: this.infant,
        booking_date: formattedDateString,
        payment_method: this.payment_method ? this.payment_method : 'tap',
        coupon_code: this.coupon,
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        booking_time: this.time,
        cardholder_name: this.cardholderName,
        cvv: this.cvv,
        expiry_year: this.expirYear,
        expiry_month: this.expiryMonth ? Number(this.expiryMonth) : null,
        card_number: this.cardNumber,
        booking_option: this.activityData?.bookingOption.reduce(
          (acc: any[], item: any, index: number) => {
            if (this.checkboxStatus[index]) {
              acc.push({
                id: item.id,
                persons: this.personsInputValues[index] || 0,
              });
            }
            return acc;
          },
          []
        ),
      };

      Object.keys(model).forEach(
        (k) => (model[k] == '' || model[k]?.length == 0) && delete model[k]
      );

      this._httpService
        .post(environment.marsa, 'Activtes/book', model)
        .subscribe({
          next: (res: any) => {
            this.isDisable = false;
            this.isLoading = false;
            if (res && res.link) {
              window.location.href = res.link;
            } else {
              const queryParams = {
                res: JSON.stringify(res),
                trip_id: this.tripId,
              };
              this.router.navigate(
                ['/', this.translate.currentLang, 'tours', 'confirm'],
                { queryParams }
              );
              Swal.fire(
                'Your Booking has been send successfully.',
                'The Tour official will contact you as soon as possible. For Future communication, please reach out to info@marsawaves.com',
                'success'
              );
            }
          },
          error: (err: any) => {
            console.error('Error during booking:', err);
            this.isDisable = false;
            this.isLoading = false;
            // Extract and display error details if available
            const errorMessage =
              err.error?.message ||
              'An error occurred while processing your booking. Please try again later.';

            Swal.fire('Booking Failed', errorMessage, 'error');
          },
        });
    } else {
      this.isDisable = false;
      this.isLoading = false;
      this.markFormGroupTouched(this.customerForm);
    }
  }

  confirmBooking() {
    const termsCheckbox = document.getElementById(
      'termsCheckbox2'
    ) as HTMLInputElement;
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
      return; // Stop further execution
    }

    if (this.customerForm.valid) {
      this.isDisable = true;
      this.isLoading = true;

      const parts = this.booking_date?.split('/');
      console.log(this.booking_date);
      const formattedDate = new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0])
      );

      // Format the date using DatePipe
      const formattedDateString = this.datePipe.transform(
        formattedDate,
        'yyyy/MM/dd'
      );
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code: code,
        trip_id: this.tripId,
        userid: this.userData?.id,
        avilable_option_id: this.avilable_option_id,
        class: this.class,
        adult: this.adult,
        childern: this.childern,
        infant: this.infant,
        booking_date: formattedDateString,
        payment_method: this.payment_method ? this.payment_method : 'cash',
        coupon_code: this.coupon,
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        booking_time: this.time,
        booking_option: this.activityData?.bookingOption.reduce(
          (acc: any[], item: any, index: number) => {
            if (this.checkboxStatus[index]) {
              acc.push({
                id: item.id,
                persons: this.personsInputValues[index] || 0,
              });
            }
            return acc;
          },
          []
        ),
      };

      Object.keys(model).forEach(
        (k) => (model[k] == '' || model[k]?.length == 0) && delete model[k]
      );

      this._httpService
        .post(environment.marsa, 'Activtes/book', model)
        .subscribe({
          next: (res: any) => {
            this.isDisable = false;
            this.isLoading = false;
            if (res && res.link) {
              window.location.href = res.link;
            } else {
              const queryParams = {
                res: JSON.stringify(res),
                trip_id: this.tripId,
              };
              this.router.navigate(
                ['/', this.translate.currentLang, 'tours', 'confirm'],
                { queryParams }
              );
              Swal.fire(
                'Your booking has been sent successfully.',
                'The Tour official will contact you as soon as possible. For Future communication, please reach out to info@marsawaves.com',
                'success'
              );
            }
          },
          error: (err: any) => {
            this.isDisable = false;
            this.isLoading = false;
            console.error('Error during booking:', err);
            Swal.fire(
              'Booking Failed',
              'An error occurred while processing your booking. Please try again later.',
              'error'
            );
          },
        });
    } else {
      this.isDisable = false;
      this.isLoading = false;
      this.markFormGroupTouched(this.customerForm);
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }

  // map
  openMapModal(): void {
    const dialogRef = this.dialog.open(MapModalComponent, {
      width: '100%',
      data: {
        mapModalOptions: this.mapModalOptions,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.latitudeValue = result.latitude;
      this.longitudeValue = result.longitude;
      this.locationValue = `(${result.longitude} - ${result.latitude})`;
    });
  }

  closeMapModal() {
    if (this.mapModalDeatails) {
      this.mapModalDeatails.nativeElement.closeModal();
    }
  }
  letterOnly(event: any) {
    var charCode = event.keyCode;

    // Allow letters (uppercase and lowercase), backspace, and space
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
  getNationality() {
    this._httpService.get('marsa', 'countrycode').subscribe({
      next: (nationalities: any) => {
        this.nationalities = nationalities.code;
        if (this.customerForm && this.customerForm.get('nationality')) {
          this.filteredNationalities = this.customerForm
            .get('nationality')
            ?.valueChanges.pipe(
              startWith(''),
              map((value) => this._filterNationalities(value))
            );
        }
      },
    });
  }

  private _filterNationalities(value: any): Code[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : ''; // Convert value to lowercase if it's a string, otherwise use an empty string
    return this.nationalities.filter((nationality) =>
      nationality.name.toLowerCase().includes(filterValue)
    );
  }
}
