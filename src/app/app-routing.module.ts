import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from 'src/components/about/about.component';
import { EnquireComponent } from 'src/components/enquire/enquire.component';
import { HomeComponent } from 'src/components/home/home.component';
import { LoginComponent } from 'src/components/login/login.component';
import { UploadFileComponent } from 'src/components/upload-file/upload-file.component';
import { GetQuotationComponent } from './get-quotation/get-quotation.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'enquire', pathMatch: 'full', component: EnquireComponent },
  { path: 'quotation', pathMatch: 'full', component: GetQuotationComponent },
  { path: 'about', pathMatch: 'full', component: AboutComponent },
  { path: 'upload', pathMatch: 'full', component: UploadFileComponent },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
