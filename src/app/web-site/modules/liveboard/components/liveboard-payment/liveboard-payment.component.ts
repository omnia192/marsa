import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DatePipe, Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from 'src/app/core/services/http/http.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MapModalComponent } from 'src/app/shared/components/@layout-pages/map-modal/map-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CabinInfoModalComponent } from '../../../../../shared/sliders/cabin-info-modal/cabin-info-modal.component';
import Swal from 'sweetalert2';
import { Observable, map, startWith } from 'rxjs';
import { Code } from '../../context/code.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-liveboard-payment',
  templateUrl: './liveboard-payment.component.html',
  styleUrls: ['./liveboard-payment.component.scss'],
})
export class LiveboardPaymentComponent implements OnInit {
  class: any;
  liveabourdData: any;
  cabins: any;
  tripId: any;
  responseFromAvailableOption: any;
  adult: any;
  persons: number = 0;
  customerForm!: FormGroup;
  activeTab: string = 'pills-two-example2';
  payment_method: any;
  canProceedToCustomerInfo: boolean = false;
  isConfirmationStepEnabled: boolean = false;
  schedules_id: any;
  filteredNationalities: Observable<Code[]> | undefined;
  showServices: boolean = true;
  coupon = '';
  Coupons: boolean = false;
  Total: any;
  nationalities!: Code[];
  cardholderName: any;
  cvv: any;
  expirYear: any;
  expiryMonth: any;
  cardNumber: any;
  isDisable = false;
  userData: { id?: number; name?: string; phone?: string; email?: string } = {};

  // map
  @ViewChild('mapModalDeatails') mapModalDeatails: ElementRef | undefined;
  locationValue = '';
  latitudeValue: any;
  longitudeValue: any;
  activeexclude: any = -1;
  personsMap: { [key: string]: number } = {};
  mapModalOptions: any = {
    headerTitle: 'location',
    modalname: 'mapModalDeatails',
  };
  liveabourd: any;
  edit: boolean = false;
  tripletails: any;
  Bookingid: any;
  selectedSchedule: any;
  selectedOption: any;
  constructor(
    private spinner: NgxSpinnerService,

    private location: Location,
    private _httpService: HttpService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _AuthService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog,
    private titleService: Title,
    private cdRef: ChangeDetectorRef
  ) {}

  setDisplay(id: any) {
    this.activeexclude = id;
    // if (document.getElementById(id)?.style.display == 'none') {
    //   document.getElementById(id)?.setAttribute('style', 'display:block');
    // } else {
    //   document.getElementById(id)?.setAttribute('style', 'display:none');
    // }
  }
  getImageName(url: string): string {
    const imageName = url?.substring(
      url.lastIndexOf('/') + 1,
      url.lastIndexOf('.')
    );
    return imageName || 'Unknown photo';
  }
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }
  ngOnInit(): void {
    this.titleService.setTitle('Confirm Booking');

    this.edit = localStorage['editLiveaboard'];
    this.initForm();
    this.getNationality();
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);
      this.selectedOption = params['class'];
      this.schedules_id = params['schedules_id'];
      this.Bookingid = params.Bookingid;
      this.tripId = params['trip_id'];
      this.adult = params['adult'];
      this.getDataById(this.tripId, params['schedules_id']);
      this.getCabinBySchedulesId(this.tripId, this.schedules_id);
      console.log(params);
    });
    if (JSON.parse(localStorage['queryParamsliveaboard']).BookingInfo) {
      this.userData.name =
        JSON.parse(localStorage['queryParamsliveaboard']).BookingInfo.name ||
        '';
      this.userData.phone =
        JSON.parse(localStorage['queryParamsliveaboard']).BookingInfo.Phone ||
        '';
      this.userData.email =
        JSON.parse(localStorage['queryParamsliveaboard']).BookingInfo[
          'E-mail'
        ] || '';
      this.customerForm.patchValue(this.userData);
      this.customerForm?.get('phone')?.patchValue('+' + this.userData.phone);
    } else {
      this._AuthService.getUserData().subscribe(
        (data: any) => {
          this.userData = JSON.parse(data); // Assigning the received object directly
          this.customerForm.patchValue(this.userData);
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
  }

  initForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      // nationality: ['', [Validators.required]],
      note: [''],
      pickup_point: ['', this.showServices ? [Validators.required] : []],
      locationValue: [''],
    });
  }

  getDataById(Id: any, schedulesId: any) {
    this._httpService
      .get(environment.marsa, `liveboard/details/` + Id)
      .subscribe((res: any) => {
        this.liveabourdData = res?.tripDetails;
        this.selectedSchedule = res?.tripDetails?.Schedules.find(
          (schedule: any) => schedule.id == schedulesId
        );
      });
  }

  getCabinBySchedulesId(id: any, schedulesId: any) {
    this._httpService
      .get(environment.marsa, `liveboard/getcabin/` + id + `/` + schedulesId)
      .subscribe((res: any) => {
        this.cabins = res?.cabins;
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

  incrementAdult(item: any) {
    const totalPersons = Object.values(this.personsMap).reduce(
      (acc: number, val: number) => acc + val,
      0
    );
    if (totalPersons >= this.adult) {
      this.toastr.info('Total number of persons cannot exceed ' + this.adult);
      // this.canProceedToCustomerInfo = true;
      return;
    }
    if (!this.personsMap[item.id]) {
      this.personsMap[item.id] = 0;
      console.log(item.id);
      console.log(this.personsMap);
    }
    if (this.selectedOption == 'privete') {
      if (this.personsMap[item.id] < item.max_occupancy      ) {
        this.personsMap[item.id]++;
      }
    }
    else{
      if (this.personsMap[item.id] < item.available) {
      this.personsMap[item.id]++;
    }

    }
    this.cdRef.detectChanges(); // Add

    console.log(!this.personsMap[item.id]);
  }

  decrementAdult(item: any) {
    if (!this.personsMap[item.id]) {
      this.personsMap[item.id] = 0; // Initialize persons value for the item if not already set
    }
    if (this.personsMap[item.id] > 0) {
      this.personsMap[item.id]--;
    } else {
      this.toastr.info(
        `Sorry, you cannot exceed the minimum cant be 0. Please adjust the number.`,
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
    this.cdRef.detectChanges(); // Add
  }

  getValue(item: any): number {
    return item;
  }

  openCabinSliderModal(cabin: any): void {
    const boatImages = cabin.images;
    const dialogRef = this.dialog.open(CabinInfoModalComponent, {
      width: '60%',
    });
    dialogRef.componentInstance.images = boatImages;
    dialogRef.componentInstance.data = cabin;
  }

  toggleTab(tabId: string, paymentMethod: string) {
    this.activeTab = tabId;
    this.payment_method = paymentMethod;
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
  }

  goToNextStep(stepper: MatStepper) {
    const totalPersons = Object.values(this.personsMap).reduce(
      (acc: number, val: number) => acc + val,
      0
    );
    if (totalPersons < this.adult) {
      this.toastr.info('Please allocate all Persons before proceeding.');
      return;
    } else {
      const model = {
        trip_id: this.tripId,
        class: this.selectedOption,
        coupon_code: this.coupon,
        adult: this.adult,
        schedules_id: this.schedules_id,
        cabins: this.cabins
          .map((cabin: any) => ({
            id: cabin.id,
            persons:
              this.personsMap[cabin.id] !== 0
                ? this.personsMap[cabin.id]
                : undefined,
          }))
          .filter((cabin: any) => cabin.persons !== undefined),
      };
      console.log(model);

      this._httpService
        .post(environment.marsa, 'liveboard/cabin/price', model)
        .subscribe({
          next: (res: any) => {
            this.responseFromAvailableOption = res;
            stepper.next();
          },
          error: (err: any) => {
            console.log(err);

            // this.Coupons = false;
          },
        });
    }
  }

  goToPreviousStep(stepper: MatStepper) {
    stepper.previous();
  }

  applycoupon() {
    const totalPersons = Object.values(this.personsMap).reduce(
      (acc: number, val: number) => acc + val,
      0
    );
    if (totalPersons < this.adult) {
      this.toastr.info('Please allocate all Persons before proceeding.');
      this.coupon = '';
      return;
    }
    const model = {
      trip_id: this.tripId,
      class: this.selectedOption,
      coupon_code: this.coupon,
      adult: this.adult,
      schedules_id: this.schedules_id,
      cabins: this.cabins
        .map((cabin: any) => ({
          id: cabin.id,
          persons:
            this.personsMap[cabin.id] !== 0
              ? this.personsMap[cabin.id]
              : undefined,
        }))
        .filter((cabin: any) => cabin.persons !== undefined),
    };
    this._httpService
      .post(environment.marsa, 'liveboard/cabin/price', model)
      .subscribe({
        next: (res: any) => {
          this.responseFromAvailableOption = res;
          this.Total = this.responseFromAvailableOption?.TotlaPrice;
          this.Coupons = true;
        },
        error: (err) => {
          this.toastr.error(err.error.message);
          this.coupon = '';
          this.Coupons = false;
          const model = {
            trip_id: this.tripId,
            class: this.selectedOption,
            adult: this.adult,
            schedules_id: this.schedules_id,
            cabins: this.cabins
              .map((cabin: any) => ({
                id: cabin.id,
                persons:
                  this.personsMap[cabin.id] !== 0
                    ? this.personsMap[cabin.id]
                    : undefined,
              }))
              .filter((cabin: any) => cabin.persons !== undefined),
          };
          this._httpService
            .post(environment.marsa, 'liveboard/cabin/price', model)
            .subscribe({
              next: (res: any) => {
                this.responseFromAvailableOption = res;
                this.Total = this.responseFromAvailableOption?.TotlaPrice;
              },
            });
        },
      });
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
      this.spinner.show();
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        trip_id: this.tripId,
        class: this.selectedOption,
        code: code,
        adult: this.adult,
        schedules_id: this.schedules_id,
        payment_method: this.payment_method ? this.payment_method : 'tap',
        ...this.customerForm.value,
        coupon_code: this.coupon,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        cardholder_name: this.cardholderName,
        cvv: this.cvv,
        expiry_year: this.expirYear,
        expiry_month: this.expiryMonth ? Number(this.expiryMonth) : null,
        card_number: this.cardNumber,
        cabins: this.cabins
          .map((cabin: any) => ({
            id: cabin.id,
            persons:
              this.personsMap[cabin.id] !== 0
                ? this.personsMap[cabin.id]
                : undefined,
          }))
          .filter((cabin: any) => cabin.persons !== undefined),
      };

      Object.keys(model).forEach(
        (k) => (model[k] == '' || model[k]?.length == 0) && delete model[k]
      );

      this._httpService
        .post(environment.marsa, 'bookinfo/' + this.Bookingid, model)
        .subscribe({
          next: (res: any) => {
            this.spinner.hide();
            this._httpService
              .get(environment.marsa, 'liveboard/details/' + this.tripId)
              .subscribe({
                next: (res: any) => {
                  this.liveabourd = res?.tripDetails;
                  this.router.navigate([
                    '/',
                    this.translate.currentLang,
                    'liveboard',
                    'liveboardDetails',
                    this.liveabourd?.id,
                    this.liveabourd?.Title,
                  ]);
                  localStorage.removeItem('editLiveaboard');
                  localStorage.removeItem('queryParamsliveaboard');
                },
              });

            Swal.fire(
              'Your Booking has been send successfully.',
              'The Liveaboard official will contact you as soon as possible. For Future communication, please reach out to info@marsawaves.com',
              'success'
            );
            localStorage.removeItem('editLiveaboard');
            localStorage.removeItem('queryParamsliveaboard');
            this.router.navigate(['/', this.translate.currentLang]);
          },
          error: (err: any) => {
            console.error('Error during booking:', err);

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
      this.spinner.hide();
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

    if (
      this.cardholderName == undefined ||
      this.cardNumber == undefined ||
      this.expiryMonth == undefined ||
      this.expirYear == undefined ||
      this.cvv == undefined
    ) {
      this.isDisable = true;

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
      this.spinner.show();
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        trip_id: this.tripId,
        class: this.selectedOption,
        code: code,
        adult: this.adult,
        schedules_id: this.schedules_id,
        payment_method: this.payment_method ? this.payment_method : 'tap',
        ...this.customerForm.value,
        coupon_code: this.coupon,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        cardholder_name: this.cardholderName,
        cvv: this.cvv,
        expiry_year: this.expirYear,
        expiry_month: this.expiryMonth ? Number(this.expiryMonth) : null,
        card_number: this.cardNumber,
        cabins: this.cabins
          .map((cabin: any) => ({
            id: cabin.id,
            persons:
              this.personsMap[cabin.id] !== 0
                ? this.personsMap[cabin.id]
                : undefined,
          }))
          .filter((cabin: any) => cabin.persons !== undefined),
      };

      this._httpService
        .post(environment.marsa, 'liveboard/book', model)
        .subscribe({
          next: (res: any) => {
            this.isDisable = false;
            this.isLoading = false;
            this.spinner.hide();
            if (res && res.link) {
              window.location.href = res.link;
            } else {
              const queryParams = {
                res: JSON.stringify(res),
                trip_id: this.tripId,
              };
              this.router.navigate(
                ['/', this.translate.currentLang, 'liveboard', 'confirm'],
                { queryParams }
              );
              Swal.fire(
                'Your Booking has been send successfully.',
                'The Liveaboard official will contact you as soon as possible. For any inquiries, please contact info@marsawaves.com',
                'success'
              );
            }
          },
          error: (err) => {
            this.isDisable = false;
            this.isLoading = false;
            Swal.fire(err.error.message);
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
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];
      const model = {
        trip_id: this.tripId,
        class: this.selectedOption,
        adult: this.adult,
        code: code,
        schedules_id: this.schedules_id,
        payment_method: this.payment_method ? this.payment_method : 'cash',
        ...this.customerForm.value,
        coupon_code: this.coupon,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        cabins: this.cabins
          .map((cabin: any) => ({
            id: cabin.id,
            persons:
              this.personsMap[cabin.id] !== 0
                ? this.personsMap[cabin.id]
                : undefined,
          }))
          .filter((cabin: any) => cabin.persons !== undefined),
      };

      this._httpService
        .post(environment.marsa, 'liveboard/book', model)
        .subscribe({
          next: (res: any) => {
            this.isDisable = false;
            this.isLoading = false;
            const queryParams = {
              res: JSON.stringify(res),
              trip_id: this.tripId,
            };
            this.router.navigate(
              ['/', this.translate.currentLang, 'liveboard', 'confirm'],
              { queryParams }
            );
            Swal.fire(
              'Your Booking has been send successfully.',
              'The Liveaboard official will contact you as soon as possible. For Future communication, please reach out to info@marsawaves.com',
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
      // Mark all form controls as touched to trigger validation messages
      this.isDisable = false;
      this.isLoading = false;

      this.markFormGroupTouched(this.customerForm);
    }
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

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    margin: 10,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1, // Display one item per slide for smaller screen sizes
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
  };

  goBack() {
    localStorage.removeItem('editLiveaboard');
    localStorage.removeItem('queryParamsliveaboard');
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
    const filterValue = typeof value === 'string' ? value.toLowerCase() : ''; // Convert value to lowercase if it's a string, otherwise use an empty string
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
