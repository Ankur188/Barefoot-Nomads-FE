import { Component, HostListener, OnInit } from '@angular/core';
import { StaticService } from 'src/services/static.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  viewPort = window.innerWidth;
  bannerUrl: string = '';
  constructor(public staticService: StaticService) {}

  ngOnInit(): void {
    this.staticService.getBanner('home_page_banner').subscribe((data) => {
      this.bannerUrl = data.imageUrl;
      console.log(111, this.bannerUrl);
    });
  }
}
