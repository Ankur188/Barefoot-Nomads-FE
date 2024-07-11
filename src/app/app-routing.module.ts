import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from 'src/components/about/about.component';
import { HomeComponent } from 'src/components/home/home.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'about',pathMatch: 'full', component: AboutComponent},
  {path:'**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
