import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent {
  whishlistEmpty = true;
  wishlist: any = [];
  result: any = [];
  constructor(private httpService: HttpService,
    private titleService: Title,
) {}
  responsiveOptions: any[] | undefined;

  ngOnInit() {

    this.titleService.setTitle('Wishlist');
    this.httpService
      .get(environment.marsa, 'Wishlist')
      .subscribe((res: any) => {

        this.wishlist = res.wishlist;
        this.result = res.categorys.map((category: { id: number; name: string }) => {
          // Map the categories to their new names and set URLs
          const categoryNames: Record<number, string> = {
            1: "Tours & Activities",
            2: "Liveaboard",
            3: "Private Boats",
            4: "Transfer",
            5: "Packages"
          };

          const categoryUrls: Record<number, string> = {
            1: "tours/details/",
            2: "liveboard/liveboardDetails/",
            3: "boats/details/",
            4: "",
            5: "packages/packageDetails/"
          };

          return {
            category: categoryNames[category.id] || category.name, // Use mapped name or default
            categoryId: category.id,
            url: categoryUrls[category.id], // Add URL attribute
            trips: res.wishlist.filter((wish: any) =>
              wish.trip.some((trip: any) => trip.category_id === category.id)
            )
          };
        });




        if (this.wishlist.length > 0) {
          this.whishlistEmpty = false;
        }

      });
      this.responsiveOptions = [
        {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 1
        },
        {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 1
        },
        {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
        }
      ];

  }
  RemoveFromWishlist(id:any){


    this.httpService
        .get(environment.marsa,'Wishlist/delete/'+id)
        .subscribe({
          next: (res: any) => {
            this.httpService
      .get(environment.marsa, 'Wishlist')
      .subscribe((res: any) => {

        this.wishlist = res.wishlist;
        this.result = res.categorys.map((category:any) => ({
          category: category.name,
          categoryId: category.id,
          trips: res.wishlist.filter((wish :any) => wish.trip.some((trip:any) => trip.category_id === category.id))
        }));


        if (this.wishlist.length > 0) {
          this.whishlistEmpty = false;
        }

      });

          }
        });

  }
  get carouselClass() {
    return this.result.length === 1 ? 'single-item' : 'multiple-items';
  }

}
