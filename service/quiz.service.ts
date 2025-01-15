import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../models/Quiz';
import { Question } from '../models/Question';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private token = localStorage.getItem('token');
  private headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  constructor(private http: HttpClient) { }
  getQuizzes(classId:any): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/quizzes/${classId}`, { headers: this.headers });
  }

  getQuiz(quizId: number): Observable<Quiz> {

    return this.http.get<Quiz>(`${this.apiUrl}/quiz/${quizId}`,{headers: this.headers});
  }
  submitQuiz(quizId: any, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/quiz/${quizId}/submit`, data, { headers: this.headers });
  }
  createQuiz(classId:any,quiz: any): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.apiUrl}/quizzes/${classId}/store`, quiz,{headers: this.headers});
  }
  getSubmission(QuizId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/quiz/${QuizId}/checkSubmission`,{headers: this.headers});
  }
  createQuestion(question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions`, question);
  }
  checkIfSubmitted(quizId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/quiz/${quizId}/checkSubmission`, { headers: this.headers });
  }
  getAllSubmissions(quizId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/quiz/${quizId}/submissions`, { headers: this.headers });
  }
  quizzes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/quizzes`, { headers: this.headers });
    }
}
