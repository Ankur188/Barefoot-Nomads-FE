import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isScroll: boolean = true;
  isMenuOpen: boolean = false;
  constructor(public authService: AuthService, private elementRef: ElementRef) { 
  }

  ngOnInit(): void {
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInsideHeader = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInsideHeader) {
      this.closeMenu();
    }
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
