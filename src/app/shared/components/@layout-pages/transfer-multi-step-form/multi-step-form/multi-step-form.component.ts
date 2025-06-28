import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/web-site/modules/transfer/dataService';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-multi-step-form',
  templateUrl: './multi-step-form.component.html',
  styleUrls: ['./multi-step-form.component.scss'],
})
export class MultiStepFormComponent {
  currentStep: number = 1;
  formData: any = {}; // To store the data from all steps
  activeSection: number = 1; // Active section corresponds to the current step
  responseData: any;
  constructor(private titleService: Title,private dataService: DataService,private route: ActivatedRoute) {}
  tabs = [
    { section: 1, label: 'Customer information' },
    { section: 2, label: 'Optional items' },
    { section: 3, label: 'Payment information' },
    { section: 4, label: 'Booking is Confirmed' },
  ];
  ngOnInit(): void {
    this.titleService.setTitle('Transfer');
    // Retrieve the data from the service
    this.responseData = this.dataService.getResponseData();

    // Check queryParams to set current step
    this.route.queryParams.subscribe((params) => {
      const step = +params['step']; // Convert 'step' to a number
      if (step && step >= 1 && step <= 4) {
        this.currentStep = step;
        this.activeSection = step;
      }
    });
  }

  setActiveSection(section: number): void {
    this.currentStep = section;
    this.activeSection = section;
  }
  /***********************/
  goToNextStep(data: any): void {
    this.formData = { ...this.formData, ...data };
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }


  selectedCar:any;
  goToPreviousStep(): void {
    // استرجاع البيانات المخزنة
    const selectedCarData = localStorage.getItem('selectedCar');
    const formDataData = localStorage.getItem('formData');

    if (selectedCarData) {
      this.selectedCar = JSON.parse(selectedCarData); // تحويل البيانات إلى كائن
     // console.log('Selected Car Data:', this.selectedCar);
    } else {
      console.log('No data found for selectedCar in localStorage');
    }

    if (formDataData) {
      this.formData = JSON.parse(formDataData); // تحويل البيانات إلى كائن
    } else {
      console.log('No data found for formData in localStorage');
    }

    // تقليل الخطوة
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }



  submitForm(data: any): void {
    this.formData = { ...this.formData, ...data };
    console.log('Form Data:', this.formData);
  }

}
