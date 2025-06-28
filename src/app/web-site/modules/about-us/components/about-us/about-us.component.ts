import { AboutUs } from './../../about-us';
import { environment } from 'src/environments/environment.prod';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  data: any = [];
  partnerPaths: string[] = [];
  backgroundImageUrl: any = [];
  @ViewChild('videoModal') videoModal!: TemplateRef<any>;
  videoUrl!: SafeHtml;
  rev: any;
  currentBackgroundImage: string = '';
  currentIndex: number = 0;
  interval: any;
  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }
  constructor(
    private _HttpService: HttpService,
    public translate: TranslateService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private titleService: Title,

  ) {}
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }

  ngOnInit(): void {
    this.titleService.setTitle('About Us');

    this.getAbout();
    this.startImageRotation();
  }

  onImgError(event: any) {
    event.target.src = 'assets/custom/user-dasboard/user.jpeg';
  }

  getAbout() {
    this._HttpService.get(environment.marsa, 'Background').subscribe(
      (res: any) => {
        this.backgroundImageUrl = res?.aboutus || [];
        if (this.backgroundImageUrl.length > 0) {
          this.currentBackgroundImage = this.backgroundImageUrl[0]; // حفظ الصورة الأولى
        }
      },
      (err) => {}
    );

    this._HttpService.get(environment.marsa, 'Aboutus').subscribe({
      next: (response: any) => {

        this.data = response;


        this.rev = this.data.review;

        this.partnerPaths = Object.values(this.data.partner);
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.data.chosse_us_video
        );
      },
    });
  }

  startImageRotation() {
    this.interval = setInterval(() => {
      if (this.backgroundImageUrl.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.backgroundImageUrl.length;
        this.changeBackgroundImage();
      }
    }, 4000);
  }

  changeBackgroundImage() {
    const bgElement = document.querySelector('.bg-img-hero');
    if (bgElement) {
      bgElement.classList.remove('active');
      setTimeout(() => {
        this.currentBackgroundImage = this.backgroundImageUrl[this.currentIndex];
        bgElement.classList.add('active');
      }, 100);
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  openVideo(): void {
    this.dialog.open(this.videoModal, {
      width: '100%',
    });
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
  get aboutOptions2(): OwlOptions {
    return {
      loop: this.data.counter?.length > 4,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      dots: true,
      margin: 10,
      autoplay: true,
      navSpeed: 700,
      nav: false,
     
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

    };
  }




}
