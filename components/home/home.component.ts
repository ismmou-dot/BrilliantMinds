import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service'; // Adjust the import path as necessary
import { Inject } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    isAuth: boolean = false;
  constructor(@Inject(AuthService) private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuth = localStorage.getItem('token') !== null;
  }
  getDashboardLink(): string {
    const userRole = this.authService.getUserRole();
    if (userRole === 'teacher') {
      return '/teacher/dashboard';
    } else if (userRole === 'student') {
      return '/student/dashboard';
    }
    return '/login'; // Fallback if role is undefined
  }

}
