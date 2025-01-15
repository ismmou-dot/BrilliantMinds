import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
interface Post {
  id: number;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  content: string;
  created_at: string;
  files?: Array<{
    name: string;
    file_path: string;
    size: number;
    type: string;
  }>;
  links?: Array<{
    url: string;
  }>;
  comments?: Array<{
    id: number;
    user: {
      id: number;
      name: string;
      avatar?: string;
    };
    content: string;
    created_at: string;
  }>;
  class?: string;
}
@Injectable({
  providedIn: 'root',
})
export class DiscussionService {
  apiUrl = 'http://127.0.0.1:8000/api';
  private token = localStorage.getItem('token');
  private headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  constructor(private http: HttpClient) {}

  getPosts(discussionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/discussion/${discussionId}/posts`,{ headers : this.headers });
  }

  getDiscussion(discussionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/discussion/${discussionId}/discussion`, { headers : this.headers });
  }
  deletePost(discussionId: number, postId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/discussion/${discussionId}/post/${postId}`, { headers : this.headers });
  }

  createPost(discussionId: any, content: FormData): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/discussion/${discussionId}/post`,
      content,
      { headers : this.headers }
    );
  }

  getPost(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${postId}`);
  }

  uploadFile(postId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      `${this.apiUrl}/post/${postId}/upload`,
      formData,
      { headers : this.headers }
    );
  }
  PostComment(postId: number, content: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = {
      content,
    };
    return this.http.post<any>(
      `${this.apiUrl}/post/${postId}/comment`,
      data,
      { headers }
    );
  }
}
