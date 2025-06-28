import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogsRoutingModule } from './blogs-routing.module';
import { LandingBlogsComponent } from './landing-blogs/landing-blogs.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogSignalComponent } from './components/blog-signal/blog-signal.component';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
  declarations: [
    LandingBlogsComponent,
    BlogComponent,
    BlogSignalComponent
  ],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    SharedModule,
    PaginatorModule
  ]
})
export class BlogsModule { }
