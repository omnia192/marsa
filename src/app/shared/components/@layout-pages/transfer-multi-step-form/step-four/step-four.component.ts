import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.scss']
})
export class StepFourComponent {
  @Output() submitForm = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  formData: any = {};
  tabs = [
    { section: 4, label: 'Booking is Confirmed' },
  ];
   customOptions: OwlOptions = {
      loop: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      dots: false,
      autoplay: true,
      margin: 10,
      navSpeed: 700,
      navText: [
        "<i class='fa fa-angle-left'></i>",
        "<i class='fa fa-angle-right'></i>",
      ],
      responsive: {
        0: {
          items: 1,
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
      nav: true,
    };
  constructor(

    private route: ActivatedRoute,
  ) { }
  activeSection: any;
  currentStep: any;
  submit(): void {
    this.submitForm.emit(this.formData);
  }
  setActiveSection(section: number): void {
    this.currentStep = section;
    this.activeSection = section;
  }

  previousStep(): void {
    this.previous.emit();
  }
  confirmRequest: any;
  relatedtrips: any[] = [];


  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      const res = JSON.parse(params['res']);
      this.confirmRequest = res.bookingDetails;
      this.relatedtrips = res.Relatedtrips;
    })
  }
}
