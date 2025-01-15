import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service'; // Adjust the path based on your project structure
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  
  onSubmit(): void {
    console.group('Login Debugging'); // Group debugging logs for clarity
    console.log('Login attempt started.');
    console.log('Entered Email:', this.email);
    console.log('Entered Password:', this.password ? '******' : 'Not Provided');

    const credentials = { email: this.email, password: this.password };
    console.log('Login Credentials:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login Successful. Response:', response);

        // Save the token to local storage
        const token = response.token;
        localStorage.setItem('token', token);
        console.log('Token saved to localStorage:', token);

        // Extract user role
        const userRole = response.user.role;
        localStorage.setItem('userRole', userRole); // Assuming the role is returned in the response
        console.log('User Role:', userRole);

        // Navigate based on user role
        if (userRole === 'teacher') {
          console.log('Role identified as Teacher. Navigating to /teacher/dashboard...');
          this.router.navigate(['/teacher/dashboard']);
        } else if (userRole === 'student') {
          console.log('Role identified as Student. Navigating to /student/dashboard...');
          this.router.navigate(['/student/dashboard']);
        } else {
          console.warn('Unknown role. Redirecting to /login...');
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Login Failed. Error Object:', error);

        // Error handling and displaying a user-friendly message
        this.errorMessage =
          error.error?.errors?.email?.[0] ||
          error.error?.message ||
          'Login failed. Please try again.';
        console.log('Error Message to Display:', this.errorMessage);
      },
      complete: () => {
        console.log('Login API call completed.');
        console.groupEnd(); // End of debugging group
      },
    });
  }
}
