import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-signal',
  templateUrl: './blog-signal.component.html',
  styleUrls: ['./blog-signal.component.scss'],
})
export class BlogSignalComponent implements OnInit {
  showAllReviews: boolean = false;
  chosse: any;
  blogID: any;
  blog: any = [];
  prevBlog: any;
  nextBlog: any;
  allBlogs: any[] = [];
  filteredBlogs: any[] = [];
  allCategories: any[] = [];
  activeCategory: any;
  showBlogByCategory: boolean = false;
  isLogin: boolean = false;
  comment: any;
  userData: any;
  review:any;
  isMobile = false;
  items: any[] = [];
  pagedItems: any[] = [];


  constructor(
    public translate: TranslateService,
    private route: ActivatedRoute,
    private _httpService: HttpService,
    private router: Router,
    private toastr: ToastrService,
    private headerService: HeaderService,
    private _AuthService: AuthService,
    private titleService: Title,
  ) {
    if (window.screen.width < 992) {
      this.isMobile = true;
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Blog Single');
    this.route.params.subscribe((params) => {
      this.blogID = +params['id']; // Ensure blogID is a number
      this.getAbout();
      this.getAllBlogs();
    });

    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });

    this._AuthService.getUserData().subscribe(
      (data: any) => {
        this.userData = JSON.parse(data);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getAbout() {
    this._httpService.get('marsa', 'Aboutus').subscribe({
      next: (response: any) => {
        this.chosse = response.Why_chosse_us;
      },
    });
  }

  getAllBlogs() {
    this._httpService.get('marsa', 'blog').subscribe({
      next: (res: any) => {
        this.allBlogs = res.Blogs.data;

        this.filteredBlogs = this.allBlogs;
        this.allCategories = res.allCategory;
        this.getSingleBlog(this.blogID);
      },
    });
  }

  getSingleBlog(blogID: any) {
    this._httpService.get('marsa', `blog/${blogID}`).subscribe({
      next: (res: any) => {
        this.blog = res.Blog[0];
      this.review=this.blog.comments;
      this.items = this.review.reverse();
      console.log(this.review);
        this.getAdjacentBlogs(blogID);
        // this.seoService.updateSEO(
        //   this.blog?.metatitle,
        //   this.blog?.metadesc,
        //   this.blog?.seo
        // );
      },
    });
  }
  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = event.first + event.rows;
    this.pagedItems = this.items.slice(startIndex, endIndex);
  }

  getAdjacentBlogs(blogID: any) {
    const currentIndex = this.allBlogs.findIndex((blog) => blog.id === blogID);
    if (currentIndex !== -1) {
      this.prevBlog = this.allBlogs[currentIndex - 1] || null;
      this.nextBlog = this.allBlogs[currentIndex + 1] || null;
    }
  }

  navigateToBlog(blogID: any) {
    this.showBlogByCategory = false;

    const lang = this.translate.currentLang;
    this.router.navigate(['/', lang, 'blogs', 'blogSignal', blogID]);
  }

  getUniqueTags() {
    const uniqueTags = new Set<string>();

    // Check if this.allBlogs exists and is an array
    if (this.allBlogs && Array.isArray(this.allBlogs)) {
      this.allBlogs.forEach((blog: any) => {
        // Check if blog.seo exists and is an array
        if (blog.seo && Array.isArray(blog.seo)) {
          blog.seo.forEach((tag: any) => {
            uniqueTags.add(tag);
          });
        }
      });
    }

    return Array.from(uniqueTags);
  }


  filterBlogsByCategory(categoryId: any) {
    this.activeCategory = categoryId;
    this.showBlogByCategory = true;
    if (categoryId) {
      this.filteredBlogs = this.allBlogs.filter(
        (blog) => blog.category_id === categoryId
      );
    } else {
      this.filteredBlogs = this.allBlogs; // Show all blogs if no category is selected
    }
  }

  addReview(): void {
    const model = {
      blog_id: this.blogID,
      user_id: this.userData.id,
      comment: this.comment,
    };
    if (!this.isLogin) {
      this.toastr.info('Please login first', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      window.scroll(0, 0);
      this.headerService.toggleDropdown();
    } else {
      this._httpService.post('marsa', 'blog/addcomment', model).subscribe({
        next: (res: any) => {
          this.toastr.success(res.message, '', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
          this.comment = '';
        },
      });
    }
  }

  carouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    margin: 0,
    navSpeed: 700,
    nav: true,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
      1200: {
        items: 1,
      },
    },

  };
  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement; // التأكد من أن الهدف هو عنصر صورة
    if (target) {
      target.src =
        '../../../../../../assets/custom/user-dasboard/avatar-place.png';
    }
  }
}
