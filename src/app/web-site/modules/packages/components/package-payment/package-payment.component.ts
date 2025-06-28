import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from 'src/app/core/services/http/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MapModalComponent } from 'src/app/shared/components/@layout-pages/map-modal/map-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Observable, map, startWith } from 'rxjs';
import { Code } from '../../context/code.interface';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { error } from 'node:console';

@Component({
  selector: 'app-package-payment',
  templateUrl: './package-payment.component.html',
  styleUrls: ['./package-payment.component.scss'],
})
export class PackagePaymentComponent {
  packageData: any;
  responseFromAvailableOption: any;
  customerForm!: FormGroup;
  activeTab: string = 'pills-two-example2';
  payment_method: any;
  userData: { id?: number; name?: string; phone?: string; email?: string } = {};
  canProceedToCustomerInfo: boolean = false;
  isConfirmationStepEnabled: boolean = false;
  filteredNationalities: Observable<Code[]> | undefined;
  showServices: boolean = true;
  nationalities!: Code[];
  coupon = '';
  Coupons: any;
  Total: any;
  // map
  @ViewChild('mapModalDeatails') mapModalDeatails: ElementRef | undefined;
  locationValue = '';
  latitudeValue: any;
  longitudeValue: any;
  personsMap: { [key: string]: number } = {};
  mapModalOptions: any = {
    headerTitle: 'location',
    modalname: 'mapModalDeatails',
  };

  model = {
    adult: '',
    booking_date: '',
    childern: '',
    infant: '',
    packege_id: '',
  };
  end_date: string = '';
  tripletails: any;
  edit: boolean = false;
  cardholderName: any;
  cvv: any;
  expirYear: any;
  expiryMonth: any;
  cardNumber: any;
  isDisable: boolean = false;
  Bookingid: any;
  constructor(
    private toastr: ToastrService,
    private location: Location,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _AuthService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Confirm Booking');
    this.initForm();

    this.edit = localStorage['editPackage']
      ? localStorage['editPackage']
      : false;
    this.getNationality();
    this.route.queryParams.subscribe((params: any) => {
      const parsedRes = JSON.parse(params['res']);
      this.responseFromAvailableOption = parsedRes;

      this.model.adult = params['adult'];
      this.model.booking_date = params['booking_date'];
      this.model.childern = params['childern'];
      this.model.infant = params['infant'];
      this.model.packege_id = params['packege_id'];
      this.end_date = params['end_date'];
      this.getDataById(this.model.packege_id);
    });
    if (JSON.parse(localStorage['queryParamsPackages']).BookingInfo) {
      this.Bookingid = JSON.parse(
        localStorage['queryParamsPackages']
      )?.BookingInfo?.Bookingid;
      this.userData.name =
        JSON.parse(localStorage['queryParamsPackages']).BookingInfo.name || '';
      this.userData.phone =
        JSON.parse(localStorage['queryParamsPackages']).BookingInfo?.Phone || '';
      this.userData.email =
        JSON.parse(localStorage['queryParamsPackages']).BookingInfo['E-mail'] ||
        '';
      console.log(this.userData);
      this.customerForm.patchValue(this.userData);
      this.customerForm?.get('phone')?.patchValue('+' + this.userData?.phone);
    } else {
      this._AuthService.getUserData().subscribe(
        (data: any) => {
          this.userData = JSON.parse(data); // Assigning the received object directly
          this.customerForm.patchValue(this.userData);
          this.customerForm
            ?.get('phone')
            ?.patchValue('+' + this.userData?.phone);
        },
        (error) => {
          // Handle error if needed
          console.error('Error:', error);
        }
      );
    }

  }
  getImageName(url: string): string {
    const imageName = url?.substring(
      url.lastIndexOf('/') + 1,
      url.lastIndexOf('.')
    );
    return imageName || 'Unknown photo';
  }
  getTripById(activityID: any) {
    this._httpService
      .get(environment.marsa, `Activtes/details/` + activityID)
      .subscribe((res: any) => {
        this.tripletails = res.tripDetails;
      });
  }
  confirmEdit(event: Event) {
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
    if (this.customerForm.valid) {
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        ...this.model,
        payment_method: this.payment_method ? this.payment_method : 'tap',
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : 0,
        lat: this.latitudeValue ? this.latitudeValue.toString() : 0,
        cardholder_name: this.cardholderName,
        cvv: this.cvv,
        expiry_year: this.expirYear,
        expiry_month: this.expiryMonth ? Number(this.expiryMonth) : null,
        card_number: this.cardNumber,
      };

      console.log(this.Bookingid);

      this._httpService
        .post(environment.marsa, 'bookinfo/' + this.Bookingid, model)
        .subscribe({
          next: (res: any) => {

            this.getTripById(this.model.packege_id);
            this.router.navigate([
              '/',
              this.translate.currentLang,
              'packages',
              'packageDetails',
              this.tripletails?.id,
              this.tripletails?.Name,
            ]);
            Swal.fire(
              'Your Booking has been send successfully',
              'Your Tour has been sent successfully. Please check your email For Future instructions.',
              'success'
            );
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
  initForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      note: [''],
      pickup_point: ['', !this.showServices ? [Validators.required] : []],
      locationValue: [''],
    });
  }

  getDataById(Id: any) {
    this._httpService
      .get(environment.marsa, `package/details/` + Id)
      .subscribe((res: any) => {
        this.packageData = res?.PackageDetails;
        console.log(res);
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

  toggleTab(tabId: string, paymentMethod: string) {
    this.activeTab = tabId;
    this.payment_method = paymentMethod;
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
  }

  goToPreviousStep(stepper: MatStepper) {
    stepper.previous();
  }

  applycoupon() {
    const model = {
      packege_id: this.model.packege_id,
      adult: this.model.adult,
      childern: this.model.childern,
      infant: this.model.infant,
      coupon_code: this.coupon,
    };

    this._httpService
      .post(environment.marsa, 'package/price', model)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.responseFromAvailableOption = res;
          this.Total = this.responseFromAvailableOption?.TotlaPrice;
        },
        error: (err) => {
          this.coupon = '';
          const model2 = {
            packege_id: this.model.packege_id,
            adult: this.model.adult,
            childern: this.model.childern,
            infant: this.model.infant,
          };
          this._httpService
            .post(environment.marsa, 'package/price', model2)
            .subscribe({
              next: (res: any) => {
                this.responseFromAvailableOption = res;
                this.Total = this.responseFromAvailableOption.TotlaPrice;
                console.log(res);
              },
            });
          console.log(err);
          this.toastr.error(err.error.message);
        },
      });


  }

  isLoading = false;

  confirmBookingByCard(event: Event) {
    this.isDisable = true;
    this.isLoading = true;

    const termsCheckbox = document.getElementById(
      'termsCheckbox'
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
      this.isDisable = false;
      this.isLoading = false; // إيقاف التحميل
      return;
    }

    if (
      this.cardholderName == undefined ||
      this.cardNumber == undefined ||
      this.expiryMonth == undefined ||
      this.expirYear == undefined ||
      this.cvv == undefined
    ) {
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
      this.isDisable = false;
      this.isLoading = false; // إيقاف التحميل
      return;
    }

    if (this.customerForm.valid) {
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code: code,
        ...this.model,
        payment_method: this.payment_method ? this.payment_method : 'tap',
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        cardholder_name: this.cardholderName,
        cvv: this.cvv,
        expiry_year: this.expirYear,
        expiry_month: this.expiryMonth ? Number(this.expiryMonth) : null,
        coupon_code: this.coupon,
        card_number: this.cardNumber,
      };

      this._httpService
        .post(environment.marsa, 'package/book', model)
        .subscribe({
          next: (res: any) => {
            this.isDisable = false;
            this.isLoading = false; // إيقاف التحميل بعد نجاح الطلب

            if (res && res.link) {
              window.location.href = res.link;
            } else {
              Swal.fire(
                'Your Booking has been sent successfully',
                'Your Tour has been sent successfully. Please check your email For Future instructions.',
                'success'
              );
            }
          },
          error: (err: any) => {
            console.error('Error during booking:', err);
            this.isDisable = false;
            this.isLoading = false; // إيقاف التحميل في حالة حدوث خطأ

            Swal.fire(
              'Booking Failed',
              'An error occurred while processing your booking. Please try again later.',
              'error'
            );
          },
        });
    } else {
      this.isDisable = false;
      this.isLoading = false; // إيقاف التحميل في حالة عدم صحة النموذج

      // Mark all form controls as touched to trigger validation messages
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
      return;
    }

    if (this.customerForm.valid) {
      this.isDisable = true;
      this.isLoading = true; // بدء التحميل

      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code: code,
        ...this.model,
        payment_method: this.payment_method ? this.payment_method : 'cash',
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        coupon_code: this.coupon,
      };

      this._httpService.post(environment.marsa, 'package/book', model).subscribe({
        next: (res: any) => {
          this.isDisable = false;
          this.isLoading = false;

          const queryParams = {
            res: JSON.stringify(res),
            packege_id: this.model.packege_id,
          };

          this.router.navigate(
            ['/', this.translate.currentLang, 'packages', 'packageConfirm'],
            { queryParams }
          );

          Swal.fire(
            'Your Booking has been sent successfully.',
            'The Tour official will contact you as soon as possible. For future communication, please reach out to info@marsawaves.com',
            'success'
          );
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

  goBack() {
    localStorage.removeItem('editPackage');
    localStorage.removeItem('queryParamsPackages');
    this.location.back();
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
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.nationalities.filter((nationality) =>
      nationality.name.toLowerCase().includes(filterValue)
    );
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
