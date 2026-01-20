import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Check if user is logged in
    if (!localStorage['isUserLoggedIn'] || !sessionStorage['bn_access']) {
      // Redirect to login page with returnUrl
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check if user has admin role
    const userRole = localStorage['userRole'];
    if (userRole && userRole.toLowerCase() === 'admin') {
      return true;
    } else {
      // Redirect to home page if not admin
      this.router.navigate(['/']);
      return false;
    }
  }
}
