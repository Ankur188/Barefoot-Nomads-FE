import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/components/home/home.component';
import { HeaderComponent } from 'src/components/header/header.component';
import { TripCarouselComponent } from 'src/components/trip-carousel/trip-carousel.component';
import { SwiperModule } from 'swiper/angular';
import { TripCardComponent } from 'src/components/trip-card/trip-card.component';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TimestampToDatePipe } from 'src/utils/timestamp-to-date.pipe';
import { FooterComponent } from 'src/components/footer/footer.component';
import { AboutComponent } from 'src/components/about/about.component';
import { ImageSliderComponent } from 'src/components/image-slider/image-slider.component';
import { StaticService } from 'src/services/static.service';
import { HttpClientModule } from '@angular/common/http';
import { UploadFileComponent } from 'src/components/upload-file/upload-file.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from 'src/components/login/login.component';

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
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SwiperModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [StaticService],
  bootstrap: [AppComponent]
})
export class AppModule { }
