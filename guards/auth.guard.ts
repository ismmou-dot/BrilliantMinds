import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const role = this.authService.getUserRole(); // Assuming this returns 'student' or 'teacher'

    if (route.url[0].path === 'teacher' && role !== 'teacher') {
      this.router.navigate(['/login']);
      return false;
    }

    if (route.url[0].path === 'student' && role !== 'student') {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
