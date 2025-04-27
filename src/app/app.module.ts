import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/components/home/home.component';
import { HeaderComponent } from 'src/components/header/header.component';
import { TripCarouselComponent } from 'src/components/trip-carousel/trip-carousel.component';
import { SwiperModule } from 'swiper/angular';
import { TripCardComponent } from 'src/components/trip-card/trip-card.component';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimestampToDatePipe } from 'src/utils/timestamp-to-date.pipe';
import { FooterComponent } from 'src/components/footer/footer.component';
import { AboutComponent } from 'src/components/about/about.component';
import { ImageSliderComponent } from 'src/components/image-slider/image-slider.component';
import { StaticService } from 'src/services/static.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UploadFileComponent } from 'src/components/upload-file/upload-file.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from 'src/components/login/login.component';
import { EnquireComponent } from 'src/components/enquire/enquire.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { GetQuotationComponent } from './get-quotation/get-quotation.component';
import { TripDetailsComponent } from 'src/components/trip-details/trip-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { BookingComponent } from 'src/components/booking/booking.component';
import { TripDurationPipe } from 'src/utils/trip-duration.pipe';
import { LightboxComponent } from 'src/components/lightbox/lightbox.component';
import { LoadingInterceptor } from 'src/interceptors/loading.interceptor';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    TripCarouselComponent,
    TripCardComponent,
    TimestampToDatePipe,
    FooterComponent,
    AboutComponent,
    ImageSliderComponent,
    UploadFileComponent,
    LoginComponent,
    EnquireComponent,
    GetQuotationComponent,
    TripDetailsComponent,
    BookingConfirmationComponent,
    BookingComponent,
    TripDurationPipe,
    LightboxComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SwiperModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatRadioModule,
    MatTabsModule,
    MatExpansionModule,
  ],
  providers: [
    StaticService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
