import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  name: string = '';
  email: string = '';
  role: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  gender:string = '';
  date_of_birth:string = '';
  phone:string = '';
  

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    console.log('Form submission initiated.');

    if (this.password !== this.passwordConfirmation) {
      this.errorMessage = 'Passwords do not match!';
      console.warn('Password mismatch:', {
        password: this.password,
        passwordConfirmation: this.passwordConfirmation,
      });
      return;
    }

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.passwordConfirmation,
      role: this.role,
      gender:this.gender,
      date_of_birth:this.date_of_birth,
      phone:this.phone
    };

    console.log('User data prepared for submission:', userData);

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registration successful. Response:', response);
        this.successMessage = 'Registration successful! Redirecting to login...';

        // Navigate to login page
        setTimeout(() => {
          console.log('Navigating to login page...');
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration failed. Error:', error);
        this.errorMessage = error.error?.message || 'Registration failed.';
      },
    });
  }
}
