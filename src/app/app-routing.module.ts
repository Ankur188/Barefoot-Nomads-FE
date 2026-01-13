import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from 'src/components/about/about.component';
import { EnquireComponent } from 'src/components/enquire/enquire.component';
import { HomeComponent } from 'src/components/home/home.component';
import { LoginComponent } from 'src/components/login/login.component';
import { UploadFileComponent } from 'src/components/upload-file/upload-file.component';
import { GetQuotationComponent } from '../components/get-quotation/get-quotation.component';
import { TripDetailsComponent } from 'src/components/trip-details/trip-details.component';
import { BookingConfirmationComponent } from '../components/booking-confirmation/booking-confirmation.component';
import { BookingComponent } from 'src/components/booking/booking.component';
import { LoginAuthGuard } from 'src/auth-guards/login.guard';
import { AdventuresComponent } from 'src/components/adventures/adventures.component';
import { AdminPanelComponent } from 'src/components/admin-panel/admin-panel.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'enquire', pathMatch: 'full', component: EnquireComponent },
  { path: 'quotation', pathMatch: 'full', component: GetQuotationComponent },
  { path: 'about', pathMatch: 'full', component: AboutComponent },
  { path: 'upload', pathMatch: 'full', component: UploadFileComponent },
  { path: 'trip/:id', pathMatch: 'full', component: TripDetailsComponent },
  { path: 'trip/:id/booking', pathMatch: 'full', component: BookingComponent, canActivate: [LoginAuthGuard] },
  { path: 'trip/:id/booking/:bookingId', pathMatch: 'full', component: BookingConfirmationComponent, canActivate: [LoginAuthGuard] },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'adventures', pathMatch: 'full', component: AdventuresComponent },
  { path: 'admin', pathMatch: 'full', component: AdminPanelComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
