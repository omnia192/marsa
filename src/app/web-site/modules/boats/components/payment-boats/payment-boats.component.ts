import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map, startWith } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { MapModalComponent } from 'src/app/shared/components/@layout-pages/map-modal/map-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { Code } from '../../context/code.interface';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-boats',
  templateUrl: './payment-boats.component.html',
  styleUrls: ['./payment-boats.component.scss'],
})
export class PaymentBoatsComponent {
  data: any;
  userData: any;
  customerForm!: FormGroup;
  showServices: boolean = true;
  filteredNationalities: Observable<Code[]> | undefined;
  isDisable = false;

  nationalities!: Code[];
  model = {
    trip_id: '',
    distnation_id: '',
    startdate: '',
    enddate: '',
    distnation_name: '',
  };
  distention: any;
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
  cover: any;
  boatData: any;

  constructor(
    private route: ActivatedRoute,
    private _AuthService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private _httpService: HttpService,
    private location: Location,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Confirm Booking');

    this.initForm();
    this.getNationality();
    this.route.queryParams.subscribe((params: any) => {
      this.model = params;
    });
    this.getActivityById(this.model.trip_id);
    this._AuthService.getUserData().subscribe(
      (data: any) => {
        this.userData = JSON.parse(data);
        this.customerForm.patchValue(this.userData);
        

        const result = this.userData.phone.substring(4);
        this.customerForm?.get('phone')?.patchValue(result);
        console.log(data);
        console.log(this.userData.countrycode);

        this.customerForm?.get('phone')?.patchValue('+' + this.userData.phone);
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    console.log(this.boatData);
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
  getActivityById(BoatID: any) {
    this._httpService
      .get(environment.marsa, `Boats/details/` + BoatID)
      .subscribe((res: any) => {
        this.boatData = res?.tripDetails;
        this.cover = { value: this.boatData?.Cover };

        this.distention = this.boatData.Distnation.find(
          (dist: any) => dist.id !== this.model.distnation_id
        );
        console.log(this.distention);
      });
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

  bookNow() {
    if (this.showServices) {
      this.customerForm
        .get('pickup_point')
        ?.setValidators([Validators.required]);
    } else {
      this.customerForm.get('pickup_point')?.clearValidators();
      this.customerForm.get('pickup_point')?.updateValueAndValidity();
    }

    if (this.customerForm.valid) {
      this.isDisable = true;
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code: code,
        ...this.model,
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
      };

      this._httpService.post(environment.marsa, 'Boats/book', model).subscribe({
        next: (res: any) => {
          const queryParams = {
            res: JSON.stringify(res),
            trip_id: this.model.trip_id,
          };
          this.router.navigate(
            ['/', this.translate.currentLang, 'boats', 'confirm'],
            { queryParams }
          );
          Swal.fire(
            'Your request has been sent successfully.',
            'The boat representative will contact you shortly. For Future communication, please reach us at info@marsawaves.com.',
            'success'
          );
        },
      });
    } else {
      this.isDisable = false;

      // Mark all form controls as touched to trigger validation messages
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

  goBack() {
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
}
