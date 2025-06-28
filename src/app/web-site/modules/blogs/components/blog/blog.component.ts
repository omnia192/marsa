import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  Why_chosse_us: any;
  blogs: any = [];
  filteredBlogs: any = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];
  allCategories: any = [];
  selectedCategory: number | string = 'all';
  activeCategory: string | number = 'all';
  cover = '';
  page!: number;
  last_page!: number;
  productTotal!: number;
  isMobile = false;
  allTags:any=[];
  allTagss:any=[];
  constructor(
    private _httpService: HttpService,
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
  ) {
    if (window.screen.width < 992) {
      this.isMobile = true;
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Blogs');
    // this.getBlogs();
    // console.log('All Tags:', this.allTags);
    this.getAbout();
    this.pages = [];
    this._httpService.get('marsa', `blog`, { page: this.page }).subscribe({
      next: (response: any) => {
        this.blogs = response?.Blogs?.data;
        this.cover = response?.cover;
        this.filteredBlogs = this.blogs;
        this.allCategories = response?.allCategory;
        this.last_page = response?.Blogs?.last_page;
        this.productTotal = response?.Blogs?.total;
        this.pages = Array.from({ length: this.last_page }, (_, i) => i + 1);
  
        // معالجة البيانات وتحويل الكائنات إلى نصوص
        this.allTags = this.blogs.map((blog: any) => {
          // التأكد من أن `Tage` مصفوفة، وإذا لم تكن كذلك، تحويلها إلى مصفوفة فارغة
          const tags = Array.isArray(blog.Tage) 
            ? blog.Tage.map((tag: { name: { toString: () => any; }; toString: () => any; } | null) => {
                // إذا كان `tag` كائنًا، نحوله إلى نص JSON أو نأخذ قيمة `name` منه
                if (typeof tag === 'object' && tag !== null) {
                  return tag.name ? tag.name.toString() : JSON.stringify(tag);
                }
                return tag; // إذا كان نصًا عاديًا
              }) 
            : []; 
  
          // استخراج القيم وضمان عدم ظهور `undefined`
          const [name, name2, name3] = tags;
  
          return {
            name: name || '', 
            name2: name2 || '',
            name3: name3 || '',
            blogId: blog.id
          };
        });
      
      },
    });
    this.route.queryParams.subscribe((params: any) => {
      this.page = +params.page ? +params.page : 1;

      if (this.page) {
        this.getBlogs();
      }
    });
      console.log('All Tags:', this.allTags);
  }

  getAbout() {
    this._httpService.get('marsa', 'Aboutus').subscribe({
      next: (response: any) => {
        this.Why_chosse_us = response.Why_chosse_us;
      },
    });
  }

  getBlogs() {
   
  }
  


  next() {
    this.page = this.page < this.last_page ? this.page + 1 : this.page;
    this.updatePageQueryParam();
    this.getBlogs();
  }
  previous() {
    this.page = this.page > 1 ? this.page - 1 : this.page;
    this.updatePageQueryParam();
    this.getBlogs();
  }

  private updatePageQueryParam() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.page },
      queryParamsHandling: 'merge',
    });
  }

  navigateByPage(page: number) {
    this.page = page;
    this.updatePageQueryParam();
    this.getBlogs();
  }

  filterByCategory(categoryId: string | number) {
    this.activeCategory = categoryId;
    if (categoryId === 'all') {
      this.filteredBlogs = this.blogs;
    } else {
      this.filteredBlogs = this.blogs.filter(
        (blog: any) => blog.category_id === categoryId
      );
    }
  }

  getUniqueTags() {
    const uniqueTags = new Set<string>();
    if (this.filteredBlogs && Array.isArray(this.filteredBlogs)) {
      this.filteredBlogs.forEach((blog: any) => {
        if (blog.Tages && Array.isArray(blog.Tages)) {
          blog.Tages.forEach((tag: any) => {
            uniqueTags.add(tag);
          });
        }
      });
    }
    return Array.from(uniqueTags);
  }


  carouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    margin: 0,
    navSpeed: 900,
    navText: [
      "<div class='nav-button nav-left'><i class='fas fa-chevron-left'></i></div>",
      "<div class='nav-button nav-right'><i class='fas fa-chevron-right'></i></div>"
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
    nav: false,
  };


}
