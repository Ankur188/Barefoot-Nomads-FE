import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isScroll: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  // @HostListener('window:scroll', [])
  // onScroll(): void {
  //   console.log(111, window.innerHeight, window.scrollY , document.body.offsetHeight)
  //   if (window.innerHeight + window.scrollY >532) {
  //     this.isScroll = true;
  //   } else {
  //     this.isScroll = false;
  //   }
  // }

}
