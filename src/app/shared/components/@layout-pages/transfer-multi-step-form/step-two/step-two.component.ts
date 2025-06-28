import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  formData: any = {
    selectedOptions: {} // To store the selected options
  };
  responseData: any;
  savedSelectedOpti: any;
  numberOfOption: any;
  bookdetail: any;
  fromId: any;
  way: any;
  toId: any;
  person: any;
  carId: any;
  pickuptime_fromDta: any;
  bookingDate: any;
  bookingTime: any;
  kilometr: any;
  flightNumper: any;
  formData1: any;
  returnbookingtime: any;
  returnbookingdate: any;
  optionId:any;
  selectedCar:any;

  constructor(private toastr: ToastrService, private _httpService: HttpService,) { }

  ngOnInit() {

    this.returnbookingdate = localStorage.getItem('returnDate') || '';
    const savedSelectedCar = localStorage.getItem('selectedCar');

    if (savedSelectedCar) {
      this.selectedCar = JSON.parse(savedSelectedCar);
      this.carId = this.selectedCar.id;
    }
    const savedFlightNumper = localStorage.getItem('formData');

    if (savedFlightNumper) {
      this.formData1 = JSON.parse(savedFlightNumper);
      this.flightNumper = this.formData1?.flightNumber;

    }
    this.returnbookingtime = localStorage.getItem('returnPickuptime') || '';

    this.way = localStorage.getItem('activeSection') || '';

    const bookingDetail = localStorage.getItem('bookdetail');
    const formdata_time = localStorage.getItem('formData');
    if (bookingDetail) {
      this.bookdetail = JSON.parse(bookingDetail);
    }



    if (this.bookdetail) {
      this.fromId = this.bookdetail.from_id || '';
      this.toId = this.bookdetail.to_id || '';
      this.bookingDate = this.bookdetail.date || '';
      // this.bookingTime = this.bookdetail.pickuptime || '';
      this.person = this.bookdetail.person || '';
      this.kilometr = this.bookdetail.kilometr || '';
    } else {
      console.warn(' bookdetail is undefined or null');
    }
    if (formdata_time ) {
      this. pickuptime_fromDta = JSON.parse(formdata_time );
    }

      if ( this. pickuptime_fromDta ) {
      this.bookingTime = this. pickuptime_fromDta.pickuptime || '';
      console.log("hiii this.bookingTime")
      console.log(this.bookingTime)
    }

    const savedResponseData = localStorage.getItem('responseData');
    if (savedResponseData) {
      this.responseData = JSON.parse(savedResponseData);


      const savedSelectedOptions = localStorage.getItem('selectedCar');
      if (savedSelectedOptions) {
        this.savedSelectedOpti = JSON.parse(savedSelectedOptions);
        this.savedSelectedOpti.option.forEach((opt: any) => {
          opt.number = opt.number || 0;
        });
      } else {
        this.savedSelectedOpti = { option: [] };
      }

      this.formData.selectedOptions = {};
    }
  }

  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }


  // onOptionChange(option: any, event: any): void {
  //   if (event.target.checked) {
  //     this.formData.selectedOptions[option.id] = {
  //       id: option.id,
  //       number: option.number || 0,
  //       name: option.name
  //     };
  //   } else {
  //     delete this.formData.selectedOptions[option.id];
  //   }
  //   if (typeof window !== 'undefined' && window.localStorage) {
  //     localStorage.setItem('selectedOptions', JSON.stringify(this.formData.selectedOptions));
  //   }
  // }

  // savenumberOfOption(option: any): void {
  //   option.number = Math.max(0, option.number || 0);
  //   if (this.formData.selectedOptions[option.id]) {
  //     this.formData.selectedOptions[option.id].number = option.number;
  //   }
  //   localStorage.setItem('selectedOptions', JSON.stringify(this.formData.selectedOptions));
  // }

  onOptionChange(option: any, event: any): void {
    option.selected = event.target.checked; // تحديث الحالة عند التغيير يدويًا

    if (event.target.checked) {
      this.formData.selectedOptions[option.id] = {
        id: option.id,
        number: option.number || 0,
        name: option.name
      };
    } else {
      delete this.formData.selectedOptions[option.id];
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('selectedOptions', JSON.stringify(this.formData.selectedOptions));
    }
  }

  savenumberOfOption(option: any): void {
    option.number = Math.max(0, option.number || 0);

    if (option.number > 0) {
      option.selected = true; // تحديد الـ checkbox تلقائيًا عند إدخال رقم
      this.formData.selectedOptions[option.id] = {
        id: option.id,
        number: option.number,
        name: option.name
      };
    } else {
      option.selected = false; // إلغاء التحديد إذا أصبح الرقم 0
      delete this.formData.selectedOptions[option.id];
    }

    localStorage.setItem('selectedOptions', JSON.stringify(this.formData.selectedOptions));
  }


  increment(option: any): void {
    if (!option.number) {
      option.number = 0;
    }
    option.number++;
    this.savenumberOfOption(option); 
  }

  decrement(option: any): void {
    if (option.number > 0) {
      option.number--;
      this.savenumberOfOption(option); 
    }
  }

  nextStep(): void {
    const invalidOptions = Object.values(this.formData.selectedOptions).filter((option: any) => {
      return option && (!option.number || option.number <= 0);
    });

    if (invalidOptions.length > 0) {
      this.toastr.info('Please enter a valid number for the selected option!', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      return;
    }

    // حفظ الخيارات في التخزين المحلي
    localStorage.setItem('selectedOptions', JSON.stringify(this.formData.selectedOptions));

    // تجهيز بيانات الحجز
    const bookingOption = Object.values(this.formData.selectedOptions).map((option: any) => ({
      id: option.id,
      persons: option.number,
    }));

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
    };

    this._httpService.post(environment.marsa, 'transfer/get/price', model)
      .subscribe({
        next: (res: any) => {
          if (res) {
            localStorage.setItem("Add-on-details", JSON.stringify(res));
            this.next.emit(this.formData);
            window.scrollTo(0, 0);
          }
        },
        error: (error) => {
          // جلب رسالة الخطأ من الباك اند
          const errorMessage = error?.error?.message || 'An error occurred!';
          this.toastr.error(errorMessage, '', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
        }
      });


  }


  confirmBooking() {
    // Initialize bookingOption array

  }


  previousStep(): void {
    this.previous.emit();
  }
}
