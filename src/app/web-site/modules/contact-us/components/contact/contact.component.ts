import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactus: any = [];
  googleIframe!: SafeHtml;
  contactForm!: FormGroup;
  backgroundImages: string[] = [];
  backgroundImageUrl: string = '';
  currentImageIndex: number = 0;
  intervalId: any;
  data:any;
  partnerPaths: string[] = [];

  constructor(
    private _HttpService: HttpService,
    private sanitizer: DomSanitizer,
    public translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Contact Us');
    this.getContact();
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      message: ['', Validators.required],
    });
    this._HttpService.get(environment.marsa, 'Aboutus').subscribe({
      next: (response: any) => {
        this.data = response;

        this.partnerPaths = Object.values(this.data.partner);

      },
    });

  }
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
  aboutOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    margin: 10,
    autoplay: false,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
        center: true,
      },
      400: {
        items: 1,
        center: true,
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
    nav: false,
  };
  youtubeLink:any;
  getContact() {
    this._HttpService.get(environment.marsa, 'ContactUs').subscribe({
      next: (response: any) => {
        this.contactus = response.contactus;
        const youtubeUrl = response.contactus["youtube "];
        this.backgroundImageUrl = encodeURI(this.backgroundImages[this.currentImageIndex]);
        this.youtubeLink=youtubeUrl;
        this.googleIframe = this.sanitizer.bypassSecurityTrustHtml(this.contactus.google);
        this.backgroundImages = this.contactus.cover; // توقع أن الصور هي مصفوفة
        if (this.backgroundImages.length > 0) {
          this.backgroundImageUrl = encodeURI(this.backgroundImages[this.currentImageIndex]);
          this.startImageRotation(); // بدء تغيير الصور
        }
      }
    });
  }

  startImageRotation() {
    this.intervalId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.backgroundImages.length;
      this.backgroundImageUrl = this.backgroundImages[this.currentImageIndex];
    }, 4000); // كل 4 ثواني
  }

  contact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();

      this.toastr.info("please enter all required fields", '', {
        disableTimeOut: false,
        titleClass: "toastr_title",
        messageClass: "toastr_message",
        timeOut: 5000,
        closeButton: true,
      });
    } else {
      this._HttpService.post(environment.marsa, 'contactus/store', this.contactForm.value).subscribe({
        next: (res: any) => {
          this.toastr.success(res.message, '', {
            disableTimeOut: false,
            titleClass: "toastr_title",
            messageClass: "toastr_message",
            timeOut: 5000,
            closeButton: true,
          });
          this.contactForm.reset();
        }
      });
    }
  }


  get name() {
    return this.contactForm.get('name')!;
  }

  get email() {
    return this.contactForm.get('email')!;
  }

  get message() {
    return this.contactForm.get('message')!;
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
