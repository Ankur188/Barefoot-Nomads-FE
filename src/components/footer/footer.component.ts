import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  showFooter: boolean;
  year: number = new Date().getFullYear();

  constructor(private router: Router) { }

  ngOnInit(): void {
        this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Hide footer on admin page
        this.showFooter = !event.url.includes('/admin');
      })
  }

}
