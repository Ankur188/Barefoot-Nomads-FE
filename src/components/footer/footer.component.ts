import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { StaticService } from 'src/services/static.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  showFooter: boolean;
  year: number = new Date().getFullYear();

  email: string = '';

  constructor(private router: Router, private staticService: StaticService) { }

  submitEmail(): void {
    const email = this.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }
    this.staticService.postEnquiry({
      email,
      createdAt: Math.floor(Date.now() / 1000)
    }).subscribe(() => {
      this.email = '';
    });
  }

  ngOnInit(): void {
        this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Hide footer on admin page
        this.showFooter = !event.url.includes('/admin');
      })
  }

}
