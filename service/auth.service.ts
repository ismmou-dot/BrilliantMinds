import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private apiUrl = 'http://127.0.0.1:8000/api'; // Replace with your Laravel API URL

  constructor(private http: HttpClient) {}
  setUserRole(role: string): void {
    localStorage.setItem('userRole', role);
  }
  setUserName(name: string): void {
    localStorage.setItem('userName', name);
  }
  getUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 0;
  }
  isAuthenticated(): boolean {
    const user = localStorage.getItem('userRole'); // Replace with real implementation
    return !!user;
  }

  isTeacher(): boolean {
    const user = localStorage.getItem('userRole') ;
    return user==='teacher';
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') || ''; 
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); 
  }
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  logout(): Observable<any> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
