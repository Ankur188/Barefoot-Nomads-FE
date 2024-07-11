import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  viewPort = window.innerWidth;
  constructor() { }

  ngOnInit(): void {
  }

}
