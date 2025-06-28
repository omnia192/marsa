import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingBlogsComponent } from './landing-blogs/landing-blogs.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogSignalComponent } from './components/blog-signal/blog-signal.component';

const routes: Routes = [
  {
    path: '', component: LandingBlogsComponent,
    children: [
      { path: '', redirectTo: "", pathMatch: 'full' },
      //here your components on folder components
      { path: '', component: BlogComponent},
      { path: 'blogSignal/:id', component: BlogSignalComponent},
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  
})
export class BlogsRoutingModule { }
