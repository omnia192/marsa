import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Item {
  id: number;
  name: string;
  value: number;
}
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit {
  imageUrl!: File;
  name: any;
  phone: any;
  phoneNumber: any;
  email: any;
  dob: any;
  deactivateChaecked = false;
  @Input() userDetails: any;
  constructor(
    private httpService: HttpService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
  ) { }

  formData = new FormData();


  isOpen = false;
  selectedLabel!: any;
  selectedImg!: any;
  countries1: any = [];
  gender: any;
  selectedCountryName: string = '';

  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
  ngOnInit() {
    this.fillUserData();
  }
  selectedCountry: any;
  ngOnChanges() {
    this.fillUserData();
  }

  fillUserData() {
    if (this.userDetails) {
      this.selectedCountryName = this.userDetails?.overviwe?.country || '';

      this.name = this.userDetails?.name || '';
      this.phone = this.userDetails?.overviwe?.phone
        || this.userDetails?.overviwe?.phonenumber
        || this.userDetails?.phone
        || '';
      this.email = this.userDetails?.overviwe?.email || '';
      this.dob = this.userDetails?.overviwe?.dateofbirth || '';
      this.gender = this.userDetails?.overviwe?.gender;
      this.phoneNumber =
        '+' +
        (this.userDetails?.overviwe?.countrycode || '') +
        (this.phone ? this.phone.replace(/\s/g, '') : ''); if (this.gender === 1) {
          this.selectedItem = this.items[0];
        } else if (this.gender === 0) {
          this.selectedItem = this.items[1];
        } else {
        this.selectedItem = null;
      }
    }
  }

 onCountryChange(event: any) {
  if (event && event.dialCode) {
    this.phoneNumber = event.dialCode;
    this.selectedCountryName = event.name || ''; // تحديث الدولة المختارة
    console.log('تم تغيير كود الدولة:', this.phoneNumber);
    console.log('الدولة المختارة:', this.selectedCountryName);
  }
}




  items: Item[] = [
    { id: 1, name: 'Male', value: 1 },
    { id: 2, name: 'Female', value: 0 },
  ];

  selectedItem: Item | null = null;

  selectItem(item: Item): void {
    this.selectedItem = item;
  }

  isSelected(item: Item): boolean {
    return this.selectedItem === item;
  }

  imagePreview!: string;
  imageFile!: File;

  previewImage(files: FileList | null): void {
    if (!files || files.length === 0) {
      return;
    }
    this.imageFile = files[0];

    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    };
    reader.readAsDataURL(this.imageFile);
  }

  submit(): void {
    if (!this.name || !this.email || !this.phone || !this.phoneNumber) {
      this.toastr.error('Please fill all required fields');
      return;
    }

    // معالجة رقم الهاتف ليكون string فقط
    let phoneValue = this.phone;
    if (typeof phoneValue === 'object' && phoneValue.number) {
      phoneValue = phoneValue.number;
    }
    phoneValue = String(phoneValue);

    if (!this.imageFile) {
      const data = {
        fname: this.name,
        email: this.email,
        phone: phoneValue,
        country_code: typeof this.phoneNumber === 'object' ? this.phoneNumber.dialCode : this.phoneNumber,
        dateofbirth: this.dob,
        gender: this.selectedItem?.name === 'Male' ? 1 : this.selectedItem?.name === 'Female' ? 0 : null
      };
      this.httpService.post(environment.marsa, 'user/update', data).subscribe(
        (res) => {
          this.toastr.success('The data has been updated successfully', '', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
        },
        (error) => {
          const errorMessage = error?.error?.message || 'Update Faild !';
          this.toastr.error(errorMessage, '', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
        }
      );
      return;
    }

    const formData = new FormData();
    formData.append('fname', this.name);
    formData.append('email', this.email);
    formData.append('phone', phoneValue);
    formData.append('country_code', typeof this.phoneNumber === 'object' ? this.phoneNumber.dialCode : this.phoneNumber);
    if (this.dob) formData.append('dateofbirth', this.dob);
    if (this.selectedItem?.name === 'Male') {
      formData.append('gender', '1');
    } else if (this.selectedItem?.name === 'Female') {
      formData.append('gender', '0');
    }
    formData.append('cover', this.imageFile);

    // اطبع نوع الصورة
    console.log('imageFile:', this.imageFile);
    console.log('imageFile instanceof File:', this.imageFile instanceof File);

    const token = localStorage.getItem('userToken');

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : { Authorization: '' };

    this.http.post('https://admin.marsawaves.org/api/user/update', formData, { headers: new HttpHeaders(headers) }).subscribe(
      (res) => {
        this.toastr.success('The data has been updated successfully', '', {
          disableTimeOut: false,
          titleClass: 'toastr_title',
          messageClass: 'toastr_message',
          timeOut: 5000,
          closeButton: true,
        });
      },
      (error) => {
        this.toastr.error('Update Failed!');
        console.error(error);
      }
    );
  }



  deactivate() {
    if (this.deactivateChaecked) {
      this.httpService
        .get(environment.marsa, 'user/deactive')
        .subscribe((res: any) => {
          this.toastr.success('The Account deactive Sucsseful', ' ', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
          this.authService.logout();
          this.router.navigate(['/']);
        });
    } else {
      this.toastr.error('Please check confirm account deactivation', ' ', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
    }
  }
}
