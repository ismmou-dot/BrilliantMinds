import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private token = localStorage.getItem('token');
  private headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  constructor(private http: HttpClient) { }
  getAssignments() {
    return this.http.get(`${this.apiUrl}/assignments`, { headers: this.headers });
  }
  getAssignmentsByClassId(classId:any) {
    return this.http.get(`${this.apiUrl}/classrooms/${classId}/assignments`, { headers: this.headers });
  }
  createAssignment(classId:any ,data: any) {
    return this.http.post(`${this.apiUrl}/classrooms/${classId}/assignments/store`, data, { headers: this.headers });
  }
  getAssignment(id: number) {
    return this.http.get(`${this.apiUrl}/assignments/${id}`, { headers: this.headers });
  }
  submitAssignment(id: any, data: any) {
    return this.http.post(`${this.apiUrl}/submissions/${id}/submit`, data, { headers: this.headers });
  }
  getSubmissions(assignmentId: string)  {
    return this.http.get(`${this.apiUrl}/assignments/${assignmentId}/submissions`,{ headers: this.headers });
  }
  getSubmission(assignmentId: string) {
    return this.http.get(`${this.apiUrl}/submission/${assignmentId}`, { headers: this.headers });
  }
}
