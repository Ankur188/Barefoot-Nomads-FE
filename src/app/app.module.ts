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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    TripCarouselComponent,
    TripCardComponent,
    TimestampToDatePipe,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SwiperModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
