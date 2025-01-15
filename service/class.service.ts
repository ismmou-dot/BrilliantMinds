import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private apiUrl = 'http://localhost:8000/api/classes'; // Update with your actual API URL
  private token = localStorage.getItem('token');
  private  headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  constructor(private http: HttpClient) {}

  // Method to get classes
  getClasses(): Observable<any> {
    return this.http.get(this.apiUrl, { headers : this.headers });
  }
  createClass(classData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, classData,{ headers : this.headers });
  }
  updateClass(classId: string, classData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${classId}/update`, classData, { headers : this.headers });
  }
  getClass(id: number): Observable<any> {   
    return this.http.get<any>(`${this.apiUrl}/${id}`, {headers : this.headers});
  }

  
  getClassStudents(classId: string): Observable<any> {
  
  return this.http.get<any>(`${this.apiUrl}/${classId}/students`, {headers : this.headers });}

  removeStudentFromClass(classId: string, studentId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${classId}/students/${studentId}/remove`, { headers: this.headers });
}
  getClassStatistics(classId:any): Observable<any> {
    const url = classId ? `${this.apiUrl}/statistics/${classId}` : `${this.apiUrl}/statistics`;
    return this.http.get<any>(url, { headers: this.headers });
  }
}
